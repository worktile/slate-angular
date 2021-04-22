import {
    Component,
    OnInit,
    Input,
    TemplateRef,
    ViewChild,
    HostBinding,
    Renderer2,
    ElementRef,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef,
    NgZone,
    Injector,
    forwardRef
} from '@angular/core';
import { NODE_TO_ELEMENT, IS_FOCUSED, EDITOR_TO_ELEMENT, ELEMENT_TO_NODE, IS_READONLY, EDITOR_TO_ON_CHANGE } from '../../utils/weak-maps';
import { Text as SlateText, Element as SlateElement, Transforms, Editor, Range, Path, NodeEntry, Node } from 'slate';
import { AngularEditor } from '../../plugins/angular-editor';
import {
    DOMElement,
    DOMNode,
    isDOMNode,
    DOMStaticRange,
    DOMRange,
    isDOMElement,
    isPlainTextOnlyPaste,
    DOMSelection
} from '../../utils/dom';
import { Subject, interval } from 'rxjs';
import { takeUntil, throttle } from 'rxjs/operators';
import scrollIntoView from 'scroll-into-view-if-needed';
import { IS_FIREFOX, IS_SAFARI, IS_EDGE_LEGACY, IS_CHROME_LEGACY } from '../../utils/environment';
import Hotkeys from '../../utils/hotkeys';
import { BeforeInputEvent, extractBeforeInputEvent } from '../../custom-event/BeforeInputEventPlugin';
import { BEFORE_INPUT_EVENTS } from '../../custom-event/before-input-polyfill';
import { ViewElement, ViewNode, ViewRefType } from '../../interfaces/view-node';
import Debug from 'debug';
import { ViewNodeService } from '../../services/view-node.service';
import { SlaTemplateComponent } from '../template/template.component';
import { SlaErrorCode } from '../../constants';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const timeDebug = Debug('slate-time');
// COMPAT: Firefox/Edge Legacy don't support the `beforeinput` event
// Chrome Legacy doesn't support `beforeinput` correctly
const HAS_BEFORE_INPUT_SUPPORT =
    !IS_CHROME_LEGACY &&
    !IS_EDGE_LEGACY &&
    globalThis.InputEvent &&
    // @ts-ignore The `getTargetRanges` property isn't recognized.
    typeof globalThis.InputEvent.prototype.getTargetRanges === 'function'
// not correctly clipboardData on beforeinput
const forceOnDOMPaste = IS_SAFARI;

@Component({
    selector: 'sla-editable',
    host: {
        class: 'sla-editable-container',
        '[attr.contenteditable]': 'readonly ? undefined : true',
        '[attr.role]': `readonly ? undefined : 'textbox'`,
        '[attr.spellCheck]': `!hasBeforeInputSupport ? undefined : spellCheck`,
        '[attr.autoCorrect]': `!hasBeforeInputSupport ? undefined : autoCorrect`,
        '[attr.autoCapitalize]': `!hasBeforeInputSupport ? undefined : autoCapitalize`
    },
    templateUrl: 'editable.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ViewNodeService, {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SlaEditableComponent),
        multi: true
    }]
})
export class SlaEditableComponent implements OnInit, OnDestroy {
    selectionchangeEventName = 'selectionchange';

    viewElements: ViewElement[] = [];

    private destroy$ = new Subject();

    private selectionChange$ = new Subject<Event>();

    isComposing = false;
    isUpdatingSelection = false;
    latestElement = null as DOMElement | null;

    protected manualListeners: (() => void)[] = [];

    private initialized: boolean;

    private onTouchedCallback: () => void = () => { };

    private onChangeCallback: (_: any) => void = () => { };

    @Input()
    editor: AngularEditor;

    @Input()
    renderElement: (element: SlateElement) => ViewRefType;

    @Input()
    renderLeaf: (text: SlateText) => TemplateRef<any>;

    @Input()
    renderMark: (text: SlateText) => { rootDOM: HTMLElement; deepestDOM: HTMLElement };

    @Input()
    readonly = false;

    //#region input event handler
    @Input() slaBeforeInput: (event: Event) => void;
    @Input() slaBlur: (event: Event) => void;
    @Input() slaClick: (event: MouseEvent) => void;
    @Input() slaCompositionEnd: (event: CompositionEvent) => void;
    @Input() slaCompositionStart: (event: CompositionEvent) => void;
    @Input() slaCopy: (event: ClipboardEvent) => void;
    @Input() slaCut: (event: ClipboardEvent) => void;
    @Input() slaDragOver: (event: DragEvent) => void;
    @Input() slaDragStart: (event: DragEvent) => void;
    @Input() slaDrop: (event: DragEvent) => void;
    @Input() slaFocus: (event: Event) => void;
    @Input() slaKeyDown: (event: KeyboardEvent) => void;
    @Input() slaPaste: (event: KeyboardEvent) => void;
    //#endregion

    @ViewChild('templateInstance', { static: true })
    templateInstance: SlaTemplateComponent;

    //#region DOM attr
    @Input()
    spellCheck = false;
    @Input()
    autoCorrect = false;
    @Input()
    autoCapitalize = false;

    @HostBinding('attr.data-slate-editor') dataSlateEditor = true;
    @HostBinding('attr.data-slate-node') dataSlateNode = 'value';
    @HostBinding('attr.data-gramm') dataGramm = false;

    get hasBeforeInputSupport() {
        return HAS_BEFORE_INPUT_SUPPORT;
    }
    //#endregion


    decorations: Range[];

    @Input() decorate: (entry: NodeEntry) => Range[] = () => [];

    constructor(
        public elementRef: ElementRef,
        public renderer2: Renderer2,
        public cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private viewNodeService: ViewNodeService,
        private injector: Injector
    ) { }

    ngOnInit() {
        this.editor.injector = this.injector;
        this.decorations = this.decorate([this.editor, []]);
        this.viewNodeService.initialize(
            this.editor,
            this.renderElement,
            this.renderLeaf,
            this.templateInstance,
            this.decorate,
            this.readonly
        );
        EDITOR_TO_ELEMENT.set(this.editor, this.elementRef.nativeElement);
        NODE_TO_ELEMENT.set(this.editor, this.elementRef.nativeElement);
        ELEMENT_TO_NODE.set(this.elementRef.nativeElement, this.editor);
        IS_READONLY.set(this.editor, this.readonly);
        EDITOR_TO_ON_CHANGE.set(this.editor, () => {
            this.ngZone.run(() => {
                this.onEditorValueChange();
            });
        });
        this.ngZone.runOutsideAngular(() => {
            this.initialize();
        });
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    writeValue(value: Node[]) {
        if (value && value.length) {
            this.editor.children = value;
            this.viewElements = this.viewNodeService.pack(this.viewElements, this.decorations);
            this.cdr.markForCheck();
        }
    }

    public forceFlush() {
        timeDebug('start data sync');
        this.viewElements = this.viewNodeService.pack(this.viewElements, this.decorations);
        this.cdr.detectChanges();
        this.toNativeSelection();
        timeDebug('end data sync');
    }

    trackByKey(index, item: ViewNode) {
        return item.key;
    }

    initialize() {
        this.initialized = true;
        this.addEventListener(
            this.selectionchangeEventName,
            event => {
                this.selectionChange$.next(event);
            },
            document
        );
        this.selectionChange$
            .pipe(
                throttle(
                    (value: Event) => {
                        return interval(100);
                    },
                    { trailing: true, leading: true }
                ),
                takeUntil(this.destroy$)
            )
            .subscribe(event => {
                this.toSlateSelection();
            });
        if (HAS_BEFORE_INPUT_SUPPORT) {
            this.addEventListener('beforeinput', this.onDOMBeforeInput.bind(this));
        }
        this.addEventListener('blur', this.onDOMBlur.bind(this));
        this.addEventListener('click', this.onDOMClick.bind(this));
        this.addEventListener('compositionend', this.onDOMCompositionEnd.bind(this));
        this.addEventListener('compositionstart', this.onDOMCompositionStart.bind(this));
        this.addEventListener('copy', this.onDOMCopy.bind(this));
        this.addEventListener('cut', this.onDOMCut.bind(this));
        this.addEventListener('dragover', this.onDOMDragOver.bind(this));
        this.addEventListener('dragstart', this.onDOMDragStart.bind(this));
        this.addEventListener('drop', this.onDOMDrop.bind(this));
        this.addEventListener('focus', this.onDOMFocus.bind(this));
        this.addEventListener('keydown', this.onDOMKeydown.bind(this));
        this.addEventListener('paste', this.onDOMPaste.bind(this));
        BEFORE_INPUT_EVENTS.forEach(event => {
            this.addEventListener(event.name, () => { });
        });
    }

    toNativeSelection() {
        try {
            const { selection } = this.editor;
            const domSelection = window.getSelection();

            if (this.isComposing || !domSelection || !AngularEditor.isFocused(this.editor)) {
                return;
            }

            const hasDomSelection = domSelection.type !== 'None';

            // If the DOM selection is properly unset, we're done.
            if (!selection && !hasDomSelection) {
                return;
            }

            // If the DOM selection is already correct, we're done.
            // verify that the dom selection is in the editor
            const editorElement = EDITOR_TO_ELEMENT.get(this.editor)!;
            let hasDomSelectionInEditor = false;
            if (editorElement.contains(domSelection.anchorNode) && editorElement.contains(domSelection.focusNode)) {
                hasDomSelectionInEditor = true;
            }

            // If the DOM selection is in the editor and the editor selection is already correct, we're done.
            if (
                hasDomSelection &&
                hasDomSelectionInEditor &&
                selection &&
                hasStringTarget(domSelection) &&
                Range.equals(AngularEditor.toSlateRange(this.editor, domSelection), selection)
            ) {
                return;
            }

            // Otherwise the DOM selection is out of sync, so update it.
            const el = AngularEditor.toDOMNode(this.editor, this.editor);
            this.isUpdatingSelection = true;

            const newDomRange = selection && AngularEditor.toDOMRange(this.editor, selection);

            if (newDomRange) {
                // COMPAT: Since the DOM range has no concept of backwards/forwards
                // we need to check and do the right thing here.
                if (Range.isBackward(selection)) {
                    // tslint:disable-next-line:max-line-length
                    domSelection.setBaseAndExtent(
                        newDomRange.endContainer,
                        newDomRange.endOffset,
                        newDomRange.startContainer,
                        newDomRange.startOffset
                    );
                } else {
                    // tslint:disable-next-line:max-line-length
                    domSelection.setBaseAndExtent(
                        newDomRange.startContainer,
                        newDomRange.startOffset,
                        newDomRange.endContainer,
                        newDomRange.endOffset
                    );
                }
                const leafEl = newDomRange.startContainer.parentElement;
                scrollIntoView(leafEl, { scrollMode: 'if-needed', boundary: el });
            }

            setTimeout(() => {
                // COMPAT: In Firefox, it's not enough to create a range, you also need
                // to focus the contenteditable element too. (2016/11/16)
                if (newDomRange && IS_FIREFOX) {
                    el.focus();
                }

                this.isUpdatingSelection = false;
            });
        } catch (error) {
            this.editor.onError({ code: SlaErrorCode.ToNativeSelectionError, nativeError: error })
        }
    }

    onEditorValueChange() {
        this.forceFlush();
        this.onChangeCallback(this.editor.children);
    }

    //#region event proxy
    private addEventListener(eventName: string, listener: EventListener, target: HTMLElement | Document = this.elementRef.nativeElement) {
        this.manualListeners.push(
            this.renderer2.listen(target, eventName, (event: Event) => {
                const beforeInputEvent = extractBeforeInputEvent(event.type, null, event, event.target);
                if (beforeInputEvent) {
                    this.onSyntheticBeforeInput(beforeInputEvent);
                }
                listener(event);
            })
        );
    }

    private toSlateSelection() {
        if (!this.readonly && !this.isComposing && !this.isUpdatingSelection) {
            try {
                // card hook
                this.useIsFocus();

                const domSelection = window.getSelection();
                if (!domSelection) {
                    return Transforms.deselect(this.editor);
                }

                const editorElement = EDITOR_TO_ELEMENT.get(this.editor);
                const hasDomSelectionInEditor = editorElement.contains(domSelection.anchorNode) && editorElement.contains(domSelection.focusNode);
                if (!hasDomSelectionInEditor) {
                    Transforms.deselect(this.editor);
                    return;
                }

                // try to get the selection directly, because some terrible case can be normalize for normalizeDOMPoint
                // for example, double-click the last cell of the table to select a non-editable DOM
                const range = AngularEditor.toSlateRange(this.editor, domSelection);
                if (this.editor.selection && Range.equals(range, this.editor.selection) && !hasStringTarget(domSelection)) {
                    // force adjust DOMSelection
                    this.toNativeSelection();
                } else {
                    Transforms.select(this.editor, range);
                }
            } catch (error) {
                this.editor.onError({ code: SlaErrorCode.ToSlateSelectionError, nativeError: error })
            }
        }
    }

    private onDOMBeforeInput(
        event: Event & {
            inputType: string;
            isComposing: boolean;
            data: string | null;
            dataTransfer: DataTransfer | null;
            getTargetRanges(): DOMStaticRange[];
        }
    ) {
        const editor = this.editor;
        if (!this.readonly && hasEditableTarget(editor, event.target) && !this.isDOMEventHandled(event, this.slaBeforeInput)) {
            timeDebug('with intent start beforeinput');
            try {
                const { selection } = editor;
                const { inputType: type } = event;
                const data = event.dataTransfer || event.data || undefined;
                event.preventDefault();

                // COMPAT: If the selection is expanded, even if the command seems like
                // a delete forward/backward command it should delete the selection.
                if (selection && Range.isExpanded(selection) && type.startsWith('delete')) {
                    Editor.deleteFragment(editor);
                    return;
                }

                switch (type) {
                    case 'deleteByComposition':
                    case 'deleteByCut':
                    case 'deleteByDrag': {
                        Editor.deleteFragment(editor);
                        break;
                    }

                    case 'deleteContent':
                    case 'deleteContentForward': {
                        Editor.deleteForward(editor);
                        break;
                    }

                    case 'deleteContentBackward': {
                        Editor.deleteBackward(editor);
                        break;
                    }

                    case 'deleteEntireSoftLine': {
                        Editor.deleteBackward(editor, { unit: 'line' });
                        Editor.deleteForward(editor, { unit: 'line' });
                        break;
                    }

                    case 'deleteHardLineBackward': {
                        Editor.deleteBackward(editor, { unit: 'block' });
                        break;
                    }

                    case 'deleteSoftLineBackward': {
                        Editor.deleteBackward(editor, { unit: 'line' });
                        break;
                    }

                    case 'deleteHardLineForward': {
                        Editor.deleteForward(editor, { unit: 'block' });
                        break;
                    }

                    case 'deleteSoftLineForward': {
                        Editor.deleteForward(editor, { unit: 'line' });
                        break;
                    }

                    case 'deleteWordBackward': {
                        Editor.deleteBackward(editor, { unit: 'word' });
                        break;
                    }

                    case 'deleteWordForward': {
                        Editor.deleteForward(editor, { unit: 'word' });
                        break;
                    }

                    case 'insertLineBreak':
                    case 'insertParagraph': {
                        Editor.insertBreak(editor);
                        break;
                    }

                    case 'insertFromComposition': {
                        // COMPAT: in safari, `compositionend` event is dispatched after
                        // the beforeinput event with the inputType "insertFromComposition" has been dispatched.
                        // https://www.w3.org/TR/input-events-2/
                        // so the following code is the right logic
                        // because DOM selection in sync will be exec before `compositionend` event
                        // isComposing is true will prevent DOM selection being update correctly.
                        this.isComposing = false;
                        preventInsertFromComposition(event);
                    }
                    case 'insertFromDrop':
                    case 'insertFromPaste':
                    case 'insertFromYank':
                    case 'insertReplacementText':
                    case 'insertText': {
                        if (editor.selection && !Range.isCollapsed(editor.selection)) {
                            Editor.deleteFragment(editor);
                        }
                        if (data instanceof DataTransfer) {
                            AngularEditor.insertData(editor, data);
                        } else if (typeof data === 'string') {
                            // block card
                            const domSelection = window.getSelection();
                            const isBlockCard = AngularEditor.hasCardTarget(domSelection.anchorNode) ||
                                AngularEditor.hasCardTarget(domSelection.focusNode);
                            if (isBlockCard) {
                                return;
                            }
                            Editor.insertText(editor, data);
                        }
                        break;
                    }
                }
            } catch (error) {
                this.editor.onError({ code: SlaErrorCode.OnDOMBeforeInputError, nativeError: error });
            }
            timeDebug('with intent end beforeinput');
        }
    }

    private onDOMBlur(event: FocusEvent) {
        if (
            this.readonly ||
            this.isUpdatingSelection ||
            !hasEditableTarget(this.editor, event.target) ||
            this.isDOMEventHandled(event, this.slaBlur)
        ) {
            return;
        }

        // COMPAT: If the current `activeElement` is still the previous
        // one, this is due to the window being blurred when the tab
        // itself becomes unfocused, so we want to abort early to allow to
        // editor to stay focused when the tab becomes focused again.
        if (this.latestElement === window.document.activeElement) {
            return;
        }

        const { relatedTarget } = event;
        const el = AngularEditor.toDOMNode(this.editor, this.editor);

        // COMPAT: The event should be ignored if the focus is returning
        // to the editor from an embedded editable element (eg. an <input>
        // element inside a void node).
        if (relatedTarget === el) {
            return;
        }

        // COMPAT: The event should be ignored if the focus is moving from
        // the editor to inside a void node's spacer element.
        if (isDOMElement(relatedTarget) && relatedTarget.hasAttribute('data-slate-spacer')) {
            return;
        }

        // COMPAT: The event should be ignored if the focus is moving to a
        // non- editable section of an element that isn't a void node (eg.
        // a list item of the check list example).
        if (relatedTarget != null && isDOMNode(relatedTarget) && AngularEditor.hasDOMNode(this.editor, relatedTarget)) {
            const node = AngularEditor.toSlateNode(this.editor, relatedTarget);

            if (SlateElement.isElement(node) && !this.editor.isVoid(node)) {
                return;
            }
        }

        IS_FOCUSED.delete(this.editor);
    }

    private onDOMClick(event: MouseEvent) {
        if (
            !this.readonly &&
            hasTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.slaClick) &&
            isDOMNode(event.target)
        ) {
            const node = AngularEditor.toSlateNode(this.editor, event.target);
            const path = AngularEditor.findPath(this.editor, node);
            const start = Editor.start(this.editor, path);
            const end = Editor.end(this.editor, path);

            const startVoid = Editor.void(this.editor, { at: start });
            const endVoid = Editor.void(this.editor, { at: end });

            if (startVoid && endVoid && Path.equals(startVoid[1], endVoid[1])) {
                const range = Editor.range(this.editor, start);
                Transforms.select(this.editor, range);
            }
        }
    }

    private onDOMCompositionEnd(event: CompositionEvent) {
        if (!event.data && !Range.isCollapsed(this.editor.selection)) {
            Transforms.delete(this.editor);
        }
        if (hasEditableTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.slaCompositionEnd)) {
            // COMPAT: In Chrome/Firefox, `beforeinput` events for compositions
            // aren't correct and never fire the "insertFromComposition"
            // type that we need. So instead, insert whenever a composition
            // ends since it will already have been committed to the DOM.
            if (this.isComposing === true && !IS_SAFARI && !IS_CHROME_LEGACY && event.data) {
                preventInsertFromComposition(event);
                Editor.insertText(this.editor, event.data);
            }

            // COMPAT: In Firefox 87.0 CompositionEnd fire twice
            // so we need avoid repeat isnertText by isComposing === true,
            this.isComposing = false;
        }
    }

    private onDOMCompositionStart(event: CompositionEvent) {
        const { selection } = this.editor;

        const domSelection = window.getSelection();
        const cardTargetAttr = AngularEditor.getCardTargetAttribute(domSelection.anchorNode);
        const cardTarget = domSelection.anchorNode;

        if (selection) {
            // solve the problem of cross node Chinese input
            if (Range.isExpanded(selection)) {
                Editor.deleteFragment(this.editor);
                this.forceFlush();
            }
            // 当光标是块级光标时，输入中文前需要强制移动选区
            if (cardTargetAttr) {
                const cardEntry = AngularEditor.toSlateCardEntry(this.editor, cardTarget);
                const isCardLeft = AngularEditor.isCardLeftByTargetAttr(cardTargetAttr);
                const point = isCardLeft ? Editor.before(this.editor, cardEntry[1]) : Editor.after(this.editor, cardEntry[1]);
                Transforms.select(this.editor, point);
                this.forceFlush();
            }
        }
        if (hasEditableTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.slaCompositionStart)) {
            this.isComposing = true;
        }
    }

    private onDOMCopy(event: ClipboardEvent) {
        const isOutsideSlate = !hasStringTarget(window.getSelection()) && isTargetInsideVoid(this.editor, event.target);
        if (!isOutsideSlate && hasTarget(this.editor, event.target) && !this.readonly && !this.isDOMEventHandled(event, this.slaCopy)) {
            event.preventDefault();
            AngularEditor.setFragmentData(this.editor, event.clipboardData);
        }
    }

    private onDOMCut(event: ClipboardEvent) {
        if (!this.readonly && hasEditableTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.slaCut)) {
            event.preventDefault();
            AngularEditor.setFragmentData(this.editor, event.clipboardData);
            const { selection } = this.editor;

            if (selection && Range.isExpanded(selection)) {
                Editor.deleteFragment(this.editor);
            }
        }
    }

    private onDOMDragOver(event: DragEvent) {
        if (hasTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.slaDragOver)) {
            // Only when the target is void, call `preventDefault` to signal
            // that drops are allowed. Editable content is droppable by
            // default, and calling `preventDefault` hides the cursor.
            const node = AngularEditor.toSlateNode(this.editor, event.target);

            if (Editor.isVoid(this.editor, node)) {
                event.preventDefault();
            }
        }
    }

    private onDOMDragStart(event: DragEvent) {
        if (hasTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.slaDragStart)) {
            const node = AngularEditor.toSlateNode(this.editor, event.target);
            const path = AngularEditor.findPath(this.editor, node);
            const voidMatch = Editor.void(this.editor, { at: path });

            // If starting a drag on a void node, make sure it is selected
            // so that it shows up in the selection's fragment.
            if (voidMatch) {
                const range = Editor.range(this.editor, path);
                Transforms.select(this.editor, range);
            }

            AngularEditor.setFragmentData(this.editor, event.dataTransfer);
        }
    }

    private onDOMDrop(event: DragEvent) {
        if (hasTarget(this.editor, event.target) && !this.readonly && !this.isDOMEventHandled(event, this.slaDrop)) {
            // COMPAT: Certain browsers don't fire `beforeinput` events at all, and
            // Chromium browsers don't properly fire them for files being
            // dropped into a `contenteditable`. (2019/11/26)
            // https://bugs.chromium.org/p/chromium/issues/detail?id=1028668
            if (!HAS_BEFORE_INPUT_SUPPORT || (!IS_SAFARI && event.dataTransfer.files.length > 0)) {
                event.preventDefault();
                const range = AngularEditor.findEventRange(this.editor, event);
                const data = event.dataTransfer;
                Transforms.select(this.editor, range);
                AngularEditor.insertData(this.editor, data);
            }
        }
    }

    private onDOMFocus(event: Event) {
        if (
            !this.readonly &&
            !this.isUpdatingSelection &&
            hasEditableTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.slaFocus)
        ) {
            const el = AngularEditor.toDOMNode(this.editor, this.editor);
            this.latestElement = window.document.activeElement;

            // COMPAT: If the editor has nested editable elements, the focus
            // can go to them. In Firefox, this must be prevented because it
            // results in issues with keyboard navigation. (2017/03/30)
            if (IS_FIREFOX && event.target !== el) {
                el.focus();
                return;
            }

            IS_FOCUSED.set(this.editor, true);
        }
    }

    private onDOMKeydown(event: KeyboardEvent) {
        const editor = this.editor;
        if (
            !this.readonly &&
            hasEditableTarget(editor, event.target) &&
            !this.isComposing &&
            !this.isDOMEventHandled(event, this.slaKeyDown)
        ) {
            const nativeEvent = event;
            const { selection } = editor;

            try {
                // COMPAT: Since we prevent the default behavior on
                // `beforeinput` events, the browser doesn't think there's ever
                // any history stack to undo or redo, so we have to manage these
                // hotkeys ourselves. (2019/11/06)
                if (Hotkeys.isRedo(nativeEvent)) {
                    event.preventDefault();

                    if (typeof editor.redo === 'function') {
                        editor.redo();
                    }

                    return;
                }

                if (Hotkeys.isUndo(nativeEvent)) {
                    event.preventDefault();

                    if (typeof editor.undo === 'function') {
                        editor.undo();
                    }

                    return;
                }

                // COMPAT: Certain browsers don't handle the selection updates
                // properly. In Chrome, the selection isn't properly extended.
                // And in Firefox, the selection isn't properly collapsed.
                // (2017/10/17)
                if (Hotkeys.isMoveLineBackward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, { unit: 'line', reverse: true });
                    return;
                }

                if (Hotkeys.isMoveLineForward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, { unit: 'line' });
                    return;
                }

                if (Hotkeys.isExtendLineBackward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, {
                        unit: 'line',
                        edge: 'focus',
                        reverse: true
                    });
                    return;
                }

                if (Hotkeys.isExtendLineForward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, { unit: 'line', edge: 'focus' });
                    return;
                }

                // COMPAT: If a void node is selected, or a zero-width text node
                // adjacent to an inline is selected, we need to handle these
                // hotkeys manually because browsers won't be able to skip over
                // the void node with the zero-width space not being an empty
                // string.
                if (Hotkeys.isMoveBackward(nativeEvent)) {
                    event.preventDefault();

                    if (selection && Range.isCollapsed(selection)) {
                        Transforms.move(editor, { reverse: true });
                    } else {
                        Transforms.collapse(editor, { edge: 'start' });
                    }

                    return;
                }

                if (Hotkeys.isMoveForward(nativeEvent)) {
                    event.preventDefault();

                    if (selection && Range.isCollapsed(selection)) {
                        Transforms.move(editor);
                    } else {
                        Transforms.collapse(editor, { edge: 'end' });
                    }

                    return;
                }

                if (Hotkeys.isMoveWordBackward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, { unit: 'word', reverse: true });
                    return;
                }

                if (Hotkeys.isMoveWordForward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, { unit: 'word' });
                    return;
                }

                // COMPAT: Certain browsers don't support the `beforeinput` event, so we
                // fall back to guessing at the input intention for hotkeys.
                // COMPAT: In iOS, some of these hotkeys are handled in the
                if (!HAS_BEFORE_INPUT_SUPPORT) {
                    // We don't have a core behavior for these, but they change the
                    // DOM if we don't prevent them, so we have to.
                    if (Hotkeys.isBold(nativeEvent) || Hotkeys.isItalic(nativeEvent) || Hotkeys.isTransposeCharacter(nativeEvent)) {
                        event.preventDefault();
                        return;
                    }

                    if (Hotkeys.isSplitBlock(nativeEvent)) {
                        event.preventDefault();
                        Editor.insertBreak(editor);
                        return;
                    }

                    if (Hotkeys.isDeleteBackward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor);
                        } else {
                            Editor.deleteBackward(editor);
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteForward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor);
                        } else {
                            Editor.deleteForward(editor);
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor);
                        } else {
                            Editor.deleteBackward(editor, { unit: 'line' });
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteLineForward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor);
                        } else {
                            Editor.deleteForward(editor, { unit: 'line' });
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor);
                        } else {
                            Editor.deleteBackward(editor, { unit: 'word' });
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteWordForward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor);
                        } else {
                            Editor.deleteForward(editor, { unit: 'word' });
                        }

                        return;
                    }
                }
            } catch (error) {
                this.editor.onError({ code: SlaErrorCode.OnDOMKeydownError, nativeError: error });
            }
        }
    }

    private onDOMPaste(event: ClipboardEvent) {
        // COMPAT: Certain browsers don't support the `beforeinput` event, so we
        // fall back to React's `onPaste` here instead.
        // COMPAT: Firefox, Chrome and Safari are not emitting `beforeinput` events
        // when "paste without formatting" option is used.
        // This unfortunately needs to be handled with paste events instead.
        if (
            !this.isDOMEventHandled(event, this.slaPaste) &&
            (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event) || forceOnDOMPaste) &&
            !this.readonly &&
            hasEditableTarget(this.editor, event.target)
        ) {
            event.preventDefault();
            if (this.editor.selection && !Range.isCollapsed(this.editor.selection)) {
                Editor.deleteFragment(this.editor);
            }
            AngularEditor.insertData(this.editor, event.clipboardData);
        }
    }

    private onSyntheticBeforeInput(event: BeforeInputEvent) {
        // COMPAT: Certain browsers don't support the `beforeinput` event, so we
        // fall back to React's leaky polyfill instead just for it. It
        // only works for the `insertText` input type.
        if (
            !HAS_BEFORE_INPUT_SUPPORT &&
            !this.readonly &&
            !this.isDOMEventHandled(event.nativeEvent, this.slaBeforeInput) &&
            hasEditableTarget(this.editor, event.nativeEvent.target)
        ) {
            event.nativeEvent.preventDefault();
            try {
                const text = event.data;
                if (!Range.isCollapsed(this.editor.selection)) {
                    Editor.deleteFragment(this.editor);
                }
                preventInsertFromComposition(event.nativeEvent);

                // block card
                const domSelection = window.getSelection();
                const isBlockCard = AngularEditor.hasCardTarget(domSelection.anchorNode) ||
                    AngularEditor.hasCardTarget(domSelection.focusNode);
                if (isBlockCard) {
                    return;
                }
                Editor.insertText(this.editor, text);
            } catch (error) {
                this.editor.onError({ code: SlaErrorCode.ToNativeSelectionError, nativeError: error });
            }
        }
    }

    private isDOMEventHandled(event: Event, handler?: (event: Event) => void) {
        if (!handler) {
            return false;
        }
        handler(event);
        return event.defaultPrevented;
    }
    //#endregion

    //#region card
    useIsFocus() {
        const activeElement = window.document.activeElement;
        const ediabableElement = AngularEditor.toDOMNode(this.editor, this.editor);
        if (activeElement === ediabableElement || hasEditableTarget(this.editor, activeElement)) {
            this.latestElement = activeElement;
            IS_FOCUSED.set(this.editor, true);
        } else {
            IS_FOCUSED.delete(this.editor);
        }
    }
    //#region
    ngOnDestroy() {
        NODE_TO_ELEMENT.delete(this.editor);
        this.manualListeners.forEach(manualListener => {
            manualListener();
        });
        this.destroy$.complete();
        EDITOR_TO_ON_CHANGE.delete(this.editor);
    }
}

/**
 * Check if the target is editable and in the editor.
 */

const hasEditableTarget = (editor: AngularEditor, target: EventTarget | null): target is DOMNode => {
    return isDOMNode(target) && AngularEditor.hasDOMNode(editor, target, { editable: true });
};

/**
 * Check if two DOM range objects are equal.
 */
const isRangeEqual = (a: DOMRange, b: DOMRange) => {
    return (
        (a.startContainer === b.startContainer &&
            a.startOffset === b.startOffset &&
            a.endContainer === b.endContainer &&
            a.endOffset === b.endOffset) ||
        (a.startContainer === b.endContainer &&
            a.startOffset === b.endOffset &&
            a.endContainer === b.startContainer &&
            a.endOffset === b.startOffset)
    );
};

/**
 * Check if the target is in the editor.
 */

const hasTarget = (editor: AngularEditor, target: EventTarget | null): target is DOMNode => {
    return isDOMNode(target) && AngularEditor.hasDOMNode(editor, target);
};

/**
 * Check if the target is inside void and in the editor.
 */

const isTargetInsideVoid = (editor: AngularEditor, target: EventTarget | null): boolean => {
    const slateNode = hasTarget(editor, target) && AngularEditor.toSlateNode(editor, target);
    return Editor.isVoid(editor, slateNode);
};

const hasStringTarget = (domSelection: DOMSelection) => {
    return (domSelection.anchorNode.parentElement.hasAttribute('data-slate-string') || domSelection.anchorNode.parentElement.hasAttribute('data-slate-zero-width')) &&
        (domSelection.focusNode.parentElement.hasAttribute('data-slate-string') || domSelection.focusNode.parentElement.hasAttribute('data-slate-zero-width'));
}

/**
 * remove default insert from composition
 * @param text
 */
const preventInsertFromComposition = (event: Event) => {
    const types = ['compositionend', 'insertFromComposition'];
    if (!types.includes(event.type)) {
        return;
    }
    const insertText = (event as CompositionEvent).data;
    const domSelection = window.getSelection();
    // ensure text node insert composition input text
    if (insertText && domSelection.anchorNode instanceof Text && domSelection.anchorNode.textContent.endsWith(insertText)) {
        const textNode = domSelection.anchorNode;
        textNode.splitText(textNode.length - insertText.length).remove();
    }
}