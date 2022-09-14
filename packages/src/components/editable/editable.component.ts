import {
    Component,
    OnInit,
    Input,
    ViewChild,
    HostBinding,
    Renderer2,
    ElementRef,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef,
    NgZone,
    Injector,
    forwardRef,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    DoCheck
} from '@angular/core';
import { NODE_TO_ELEMENT, IS_FOCUSED, EDITOR_TO_ELEMENT, ELEMENT_TO_NODE, IS_READONLY, EDITOR_TO_ON_CHANGE, EDITOR_TO_WINDOW, EDITOR_TO_USER_SELECTION, IS_COMPOSING, EDITOR_TO_PENDING_INSERTION_MARKS, EDITOR_TO_USER_MARKS } from '../../utils/weak-maps';
import { Text as SlateText, Element, Transforms, Editor, Range, Path, NodeEntry, Node, Descendant } from 'slate';
import getDirection from 'direction';
import { AngularEditor } from '../../plugins/angular-editor';
import {
    DOMElement,
    DOMNode,
    isDOMNode,
    DOMStaticRange,
    DOMRange,
    isDOMElement,
    isPlainTextOnlyPaste,
    DOMSelection,
    getDefaultView,
    DOMText
} from '../../utils/dom';
import { Subject } from 'rxjs';
import { IS_FIREFOX, IS_SAFARI, IS_EDGE_LEGACY, IS_CHROME_LEGACY, IS_CHROME, HAS_BEFORE_INPUT_SUPPORT, IS_ANDROID, IS_FIREFOX_LEGACY, IS_IOS, IS_QQBROWSER, IS_WECHATBROWSER, IS_UC_MOBILE } from '../../utils/environment';
import Hotkeys from '../../utils/hotkeys';
import { BeforeInputEvent, extractBeforeInputEvent } from '../../custom-event/BeforeInputEventPlugin';
import { BEFORE_INPUT_EVENTS } from '../../custom-event/before-input-polyfill';
import { SlateErrorCode } from '../../types/error';
import Debug from 'debug';
import { SlateStringTemplateComponent } from '../string/template.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SlateChildrenContext, SlateViewContext } from '../../view/context';
import { ViewType } from '../../types/view';
import { HistoryEditor } from 'slate-history';
import { isDecoratorRangeListEqual } from '../../utils';
import { check, normalize } from '../../utils/global-normalize';
import { SlatePlaceholder } from '../../types/feature';
import { SlateRestoreDomDirective } from '../restore-dom/restore-dom.directive';
import { useRef } from '../../utils/react-workaround';
import { AndroidInputManager } from '../../hooks/android-input-manager/android-input-manager';
import { useTrackUserInput } from '../../hooks';
import { useAndroidInputManager } from '../../hooks/android-input-manager/use-android-input-manager';
import { debounce, throttle } from 'lodash';
import { TRIPLE_CLICK } from '../../utils/constants';
import scrollIntoView from 'scroll-into-view-if-needed';

const timeDebug = Debug('slate-angular-time');

// not correctly clipboardData on beforeinput
const forceOnDOMPaste = IS_SAFARI;

type DeferredOperation = () => void;

@Component({
    selector: 'slate-editable',
    host: {
        class: 'slate-editable-container',
        '[attr.contenteditable]': 'readonly ? undefined : true',
        '[attr.role]': `readonly ? undefined : 'textbox'`,
        '[attr.spellCheck]': `!hasBeforeInputSupport ? false : spellCheck`,
        '[attr.autoCorrect]': `!hasBeforeInputSupport ? 'false' : autoCorrect`,
        '[attr.autoCapitalize]': `!hasBeforeInputSupport ? 'false' : autoCapitalize`,

        "[attr.data-slate-editor]": "true",
        "attr.data-slate-node": "value"
    },
    templateUrl: 'editable.component.html',
    styleUrls: ["./editable.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SlateEditableComponent),
        multi: true
    }]
})
export class SlateEditableComponent extends SlateRestoreDomDirective implements OnInit, OnChanges, OnDestroy, AfterViewChecked, DoCheck {
    viewContext: SlateViewContext;

    private destroy$ = new Subject();

    private deferredOperations = useRef<DeferredOperation[]>([]);

    private state = {
        isDraggingInternally: false,
        isUpdatingSelection: false,
        latestElement: null as DOMElement | null,
        hasMarkPlaceholder: false
    };

    private isComposing = false;

    protected manualListeners: (() => void)[] = [];

    private initialized: boolean;

    private onTouchedCallback: () => void = () => { };

    private onChangeCallback: (_: any) => void = () => { };

    @Input() editor: AngularEditor;

    @Input() scrollSelectionIntoView: (
        editor: AngularEditor,
        domRange: DOMRange
    ) => void = defaultScrollSelectionIntoView;

    @Input() renderElement: (element: Element) => ViewType | null;

    @Input() renderLeaf: (text: SlateText) => ViewType | null;

    @Input() renderText: (text: SlateText) => ViewType | null;

    @Input() decorate: (entry: NodeEntry) => Range[] = () => [];

    @Input() placeholderDecorate: (editor: Editor) => SlatePlaceholder[];

    @Input() isStrictDecorate: boolean = true;

    @Input() trackBy: (node: Element) => any = () => null;

    @Input() readonly = false;

    @Input() placeholder: string;

    //#region input event handler
    @Input() beforeInput: (event: Event) => void;
    @Input() blur: (event: Event) => void;
    @Input() click: (event: MouseEvent) => void;
    @Input() compositionEnd: (event: CompositionEvent) => void;
    @Input() compositionUpdate: (event: CompositionEvent) => void;
    @Input() compositionStart: (event: CompositionEvent) => void;
    @Input() copy: (event: ClipboardEvent) => void;
    @Input() cut: (event: ClipboardEvent) => void;
    @Input() dragOver: (event: DragEvent) => void;
    @Input() dragStart: (event: DragEvent) => void;
    @Input() dragEnd: (event: DragEvent) => void;
    @Input() drop: (event: DragEvent) => void;
    @Input() focus: (event: Event) => void;
    @Input() keydown: (event: KeyboardEvent) => void;
    @Input() paste: (event: ClipboardEvent) => void;
    //#endregion

    //#region DOM attr
    @Input() spellCheck = false;
    @Input() autoCorrect = false;
    @Input() autoCapitalize = false;

    @HostBinding('attr.data-slate-editor') dataSlateEditor = true;
    @HostBinding('attr.data-slate-node') dataSlateNode = 'value';
    @HostBinding('attr.data-gramm') dataGramm = false;

    get hasBeforeInputSupport() {
        return HAS_BEFORE_INPUT_SUPPORT;
    }
    //#endregion

    @ViewChild('templateComponent', { static: true }) templateComponent: SlateStringTemplateComponent;
    @ViewChild('templateComponent', { static: true, read: ElementRef }) templateElementRef: ElementRef<any>;

    private androidInputManager!: AndroidInputManager;
  
    private onUserInput!: () => void;

    constructor(
        elementRef: ElementRef,
        public renderer2: Renderer2,
        public cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private injector: Injector
    ) {
        super(elementRef)
    }

    ngOnInit() {
        this.editor.injector = this.injector;
        this.editor.children = [];

        const { onUserInput, receivedUserInput } = useTrackUserInput(this.editor);
        this.onUserInput = onUserInput;
        this.receivedUserInput = receivedUserInput;
    
        this.androidInputManager = useAndroidInputManager(this.editor, {
          node: this.elementRef.nativeElement,
          onDOMSelectionChange: this.onDOMSelectionChange,
          scheduleOnDOMSelectionChange: this.scheduleOnDOMSelectionChange
        });
    
        let window = getDefaultView(this.elementRef.nativeElement);
        EDITOR_TO_WINDOW.set(this.editor, window);
        EDITOR_TO_ELEMENT.set(this.editor, this.elementRef.nativeElement);
        NODE_TO_ELEMENT.set(this.editor, this.elementRef.nativeElement);
        ELEMENT_TO_NODE.set(this.elementRef.nativeElement, this.editor);
        IS_READONLY.set(this.editor, this.readonly);
        EDITOR_TO_ON_CHANGE.set(this.editor, () => {
            this.ngZone.run(() => {
                this.onChange();
            });
        });
        this.ngZone.runOutsideAngular(() => {
            this.initialize();
        });
        this.initializeViewContext();
        this.initializeContext();

        // remove unused DOM, just keep templateComponent instance
        this.templateElementRef.nativeElement.remove();

        // add browser class
        let browserClass = IS_FIREFOX ? 'firefox' : (IS_SAFARI ? 'safari' : '');
        browserClass && this.elementRef.nativeElement.classList.add(browserClass);
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (!this.initialized) {
            return;
        }
        const decorateChange = simpleChanges['decorate'];
        if (decorateChange) {
            this.forceFlush();
        }
        const readonlyChange = simpleChanges['readonly'];
        if (readonlyChange) {
            IS_READONLY.set(this.editor, this.readonly);
            this.detectContext();
            this.onDOMSelectionChange();
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    writeValue(value: Element[]) {
        if (value && value.length) {
            if (check(value)) {
                this.editor.children = value;
            } else {
                this.editor.onError({
                    code: SlateErrorCode.InvalidValueError,
                    name: 'initialize invalid data',
                    data: value
                });
                this.editor.children = normalize(value);
            }
            this.initializeContext();
            this.cdr.markForCheck();
        }
    }

    initialize() {
        this.initialized = true;
        const window = AngularEditor.getWindow(this.editor);
        this.addEventListener(
            'selectionchange',
            () => {
                this.onDOMSelectionChange();
            },
            window.document
        );
        if (HAS_BEFORE_INPUT_SUPPORT) {
            this.addEventListener('beforeinput', this.onDOMBeforeInput.bind(this));
        }
        this.addEventListener('input', this.onDOMInput.bind(this));
        this.addEventListener('blur', this.onDOMBlur.bind(this));
        this.addEventListener('click', this.onDOMClick.bind(this));
        this.addEventListener('compositionend', this.onDOMCompositionEnd.bind(this));
        this.addEventListener('compositionupdate', this.onDOMCompositionUpdate.bind(this));
        this.addEventListener('compositionstart', this.onDOMCompositionStart.bind(this));
        this.addEventListener('copy', this.onDOMCopy.bind(this));
        this.addEventListener('cut', this.onDOMCut.bind(this));
        this.addEventListener('dragover', this.onDOMDragOver.bind(this));
        this.addEventListener('dragstart', this.onDOMDragStart.bind(this));
        this.addEventListener('dragend', this.onDOMDragEnd.bind(this));
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
            // Make sure the DOM selection state is in sync.
            const editor = this.editor;
            const state = this.state;
            const { selection } = editor;
            const root = AngularEditor.findDocumentOrShadowRoot(this.editor)
            const domSelection = (root as Document).getSelection();

            if (!domSelection || !AngularEditor.isFocused(editor) || this.androidInputManager?.hasPendingAction()) {
                return;
            }

            const setDomSelection = (forceChange?: boolean) => {
                const hasDomSelection = domSelection.type !== "None";
        
                // If the DOM selection is properly unset, we're done.
                if (!selection && !hasDomSelection) {
                  return;
                }
        
                // verify that the dom selection is in the editor
                const editorElement = EDITOR_TO_ELEMENT.get(editor)!;
                let hasDomSelectionInEditor = false;
                if (
                    editorElement.contains(domSelection.anchorNode) &&
                    editorElement.contains(domSelection.focusNode)
                ) {
                    hasDomSelectionInEditor = true;
                }
        
                // If the DOM selection is in the editor and the editor selection is already correct, we're done.
                if (
                    hasDomSelection &&
                    hasDomSelectionInEditor &&
                    selection &&
                    !forceChange
                ) {
                    const slateRange = AngularEditor.toSlateRange(editor, domSelection, {
                        exactMatch: true,
            
                        // domSelection is not necessarily a valid Slate range
                        // (e.g. when clicking on contentEditable:false element)
                        suppressThrow: true
                    });
            
                    if (slateRange && Range.equals(slateRange, selection)) {
                        if (!state.hasMarkPlaceholder) {
                            return;
                        }
            
                        // Ensure selection is inside the mark placeholder
                        const { anchorNode } = domSelection;
                        if (
                            anchorNode?.parentElement?.hasAttribute(
                                "data-slate-mark-placeholder"
                            )
                        ) {
                            return;
                        }
                    }
                }
        
                // when <Editable/> is being controlled through external value
                // then its children might just change - DOM responds to it on its own
                // but Slate's value is not being updated through any operation
                // and thus it doesn't transform selection on its own
                if (selection && !AngularEditor.hasRange(editor, selection)) {
                    editor.selection = AngularEditor.toSlateRange(editor, domSelection, {
                        exactMatch: false,
                        suppressThrow: true
                    });
                    return;
                }
        
                // Otherwise the DOM selection is out of sync, so update it.
                state.isUpdatingSelection = true;
        
                const newDomRange: DOMRange | null = selection && AngularEditor.toDOMRange(editor, selection);
        
                if (newDomRange) {
                    if (Range.isBackward(selection!)) {
                        domSelection.setBaseAndExtent(
                            newDomRange.endContainer,
                            newDomRange.endOffset,
                            newDomRange.startContainer,
                            newDomRange.startOffset
                        );
                    } else {
                        domSelection.setBaseAndExtent(
                            newDomRange.startContainer,
                            newDomRange.startOffset,
                            newDomRange.endContainer,
                            newDomRange.endOffset
                        );
                    }
                    this.scrollSelectionIntoView(editor, newDomRange);
                } else {
                  domSelection.removeAllRanges();
                }
        
                return newDomRange;
              };
        
              const newDomRange = setDomSelection();
              const ensureSelection = this.androidInputManager?.isFlushing() === "action";
        
              if (!IS_ANDROID || !ensureSelection) {
                setTimeout(() => {
                    // COMPAT: In Firefox, it's not enough to create a range, you also need
                    // to focus the contenteditable element too. (2016/11/16)
                    if (newDomRange && IS_FIREFOX) {
                        const el = AngularEditor.toDOMNode(editor, editor);
                        el.focus();
                    }
            
                    state.isUpdatingSelection = false;
                });
                return;
              }
        
              requestAnimationFrame(() => {
                if (ensureSelection) {
                    const ensureDomSelection = (forceChange?: boolean) => {
                        try {
                            const el = AngularEditor.toDOMNode(editor, editor);
                            el.focus();
                
                            setDomSelection(forceChange);
                        } catch (e) {
                            // Ignore, dom and state might be out of sync
                        }
                    };
            
                    // Compat: Android IMEs try to force their selection by manually re-applying it even after we set it.
                    // This essentially would make setting the slate selection during an update meaningless, so we force it
                    // again here. We can't only do it in the setTimeout after the animation frame since that would cause a
                    // visible flicker.
                    ensureDomSelection();
            
                    setTimeout(() => {
                        // COMPAT: While setting the selection in an animation frame visually correctly sets the selection,
                        // it doesn't update GBoards spellchecker state. We have to manually trigger a selection change after
                        // the animation frame to ensure it displays the correct state.
                        ensureDomSelection(true);
                        state.isUpdatingSelection = false;
                    });
                }
            });
        } catch (error) {
            this.editor.onError({ code: SlateErrorCode.ToNativeSelectionError, nativeError: error })
        }
    }

    onChange() {
        this.forceFlush();
        this.onChangeCallback(this.editor.children);
    }

    ngAfterViewChecked() {
        super.ngAfterViewChecked();
        timeDebug('editable ngAfterViewChecked');
    }

    ngDoCheck() {
        timeDebug('editable ngDoCheck');
    }

    forceFlush() {
        timeDebug('start data sync');
        this.detectContext();
        this.cdr.detectChanges();
        // repair collaborative editing when Chinese input is interrupted by other users' cursors
        // when the DOMElement where the selection is located is removed
        // the compositionupdate and compositionend events will no longer be fired
        // so isComposing needs to be corrected
        // need exec after this.cdr.detectChanges() to render HTML
        // need exec before this.toNativeSelection() to correct native selection
        if (this.isComposing) {
            // Composition input text be not rendered when user composition input with selection is expanded
            // At this time, the following matching conditions are met, assign isComposing to false, and the status is wrong
            // this time condition is true and isComposiing is assigned false
            // Therefore, need to wait for the composition input text to be rendered before performing condition matching
            setTimeout(() => {
                const textNode = Node.get(this.editor, this.editor.selection.anchor.path);
                const textDOMNode = AngularEditor.toDOMNode(this.editor, textNode);
                let textContent = '';
                // skip decorate text
                textDOMNode.querySelectorAll('[editable-text]').forEach((stringDOMNode) => {
                    let text = stringDOMNode.textContent;
                    const zeroChar = '\uFEFF';
                    // remove zero with char
                    if (text.startsWith(zeroChar)) {
                        text = text.slice(1);
                    }
                    if (text.endsWith(zeroChar)) {
                        text = text.slice(0, text.length - 1);
                    }
                    textContent += text;
                });
                if (Node.string(textNode).endsWith(textContent)) {
                    this.isComposing = false;
                }
            }, 0);
        }
        this.toNativeSelection();
        timeDebug('end data sync');
    }

    initializeContext() {
        this.context = {
            parent: this.editor,
            selection: this.editor.selection,
            decorations: this.generateDecorations(),
            decorate: this.decorate,
            readonly: this.readonly
        };
    }

    initializeViewContext() {
        this.viewContext = {
            editor: this.editor,
            renderElement: this.renderElement,
            renderLeaf: this.renderLeaf,
            renderText: this.renderText,
            trackBy: this.trackBy,
            isStrictDecorate: this.isStrictDecorate,
            templateComponent: this.templateComponent
        };
    }

    detectContext() {
        const decorations = this.generateDecorations();
        if (this.context.selection !== this.editor.selection ||
            this.context.decorate !== this.decorate ||
            this.context.readonly !== this.readonly ||
            !isDecoratorRangeListEqual(this.context.decorations, decorations)) {
            this.context = {
                parent: this.editor,
                selection: this.editor.selection,
                decorations: decorations,
                decorate: this.decorate,
                readonly: this.readonly
            };
        }
    }

    composePlaceholderDecorate(editor: Editor) {
        if (this.placeholderDecorate) {
            return this.placeholderDecorate(editor) || [];
        }

        if (
            this.placeholder &&
            editor.children.length === 1 &&
            Array.from(Node.texts(editor)).length === 1 &&
            Node.string(editor) === ''
        ) {
            const start = Editor.start(editor, [])
            return [
                {
                    placeholder: this.placeholder,
                    anchor: start,
                    focus: start,
                },
            ]
        } else {
            return []
        }
    }

    generateDecorations() {
        const decorations = this.decorate([this.editor, []]);
        const placeholderDecorations = this.isComposing
            ? []
            : this.composePlaceholderDecorate(this.editor)
        decorations.push(...placeholderDecorations);
        return decorations;
    }

    //#region event proxy
    private addEventListener(eventName: string, listener: EventListener, target: HTMLElement | Document = this.elementRef.nativeElement) {
        this.manualListeners.push(
            this.renderer2.listen(target, eventName, (event: Event) => {
                const beforeInputEvent = extractBeforeInputEvent(event.type, null, event, event.target);
                if (beforeInputEvent) {
                    this.onFallbackBeforeInput(beforeInputEvent);
                }
                listener(event);
            })
        );
    }

    private onDOMSelectionChange = throttle(() => {
        try {
            const editor = this.editor;
            const state = this.state;
        
            if (
                (IS_ANDROID || !AngularEditor.isComposing(editor)) &&
                (!state.isUpdatingSelection ||
                this.androidInputManager?.isFlushing()) &&
                !state.isDraggingInternally
            ) {
                const root = AngularEditor.findDocumentOrShadowRoot(editor);
                const { activeElement } = root;
                const el = AngularEditor.toDOMNode(editor, editor);
                const domSelection = (root as Document).getSelection();
        
                if (activeElement === el) {
                    state.latestElement = activeElement;
                    IS_FOCUSED.set(editor, true);
                } else {
                    IS_FOCUSED.delete(editor);
                }
        
                if (!domSelection) {
                    return Transforms.deselect(editor);
                }
        
                const { anchorNode, focusNode } = domSelection;
        
                const anchorNodeSelectable =
                  hasEditableTarget(editor, anchorNode) ||
                  isTargetInsideNonReadonlyVoid(editor, anchorNode);
        
                const focusNodeSelectable =
                  hasEditableTarget(editor, focusNode) ||
                  isTargetInsideNonReadonlyVoid(editor, focusNode);
        
                if (anchorNodeSelectable && focusNodeSelectable) {
                    const range = AngularEditor.toSlateRange(editor, domSelection, {
                        exactMatch: false,
                        suppressThrow: true
                    });
            
                    if (range) {
                        if (
                            !AngularEditor.isComposing(editor) &&
                            !this.androidInputManager?.hasPendingChanges() &&
                            !this.androidInputManager?.isFlushing()
                        ) {
                            Transforms.select(editor, range);
                        } else {
                            this.androidInputManager?.handleUserSelect(range);
                        }
                    }
                }
            }
        } catch (error) {
            this.editor.onError({
                code: SlateErrorCode.ToSlateSelectionError,
                nativeError: error
            });
        }
    });
    
    private scheduleOnDOMSelectionChange = debounce(this.onDOMSelectionChange, 0);

    private onDOMBeforeInput(event: InputEvent) {
        try {
            const editor = this.editor;
      
            this.onUserInput();
      
            if (
                !this.readonly &&
                hasEditableTarget(editor, event.target) &&
                !this.isDOMEventHandled(event, this.beforeInput)
            ) {
                // COMPAT: BeforeInput events aren't cancelable on android, so we have to handle them differently using the android input manager.
                if (this.androidInputManager) {
                    return this.androidInputManager.handleDOMBeforeInput(event);
                }
        
                // Some IMEs/Chrome extensions like e.g. Grammarly set the selection immediately before
                // triggering a `beforeinput` expecting the change to be applied to the immediately before
                // set selection.
                this.scheduleOnDOMSelectionChange.flush();
                this.onDOMSelectionChange.flush();
        
                const { selection } = editor;
                const { inputType: type } = event;
                const data = (event as any).dataTransfer || event.data || undefined;
        
                const isCompositionChange =
                    type === "insertCompositionText" || type === "deleteCompositionText";
        
                // COMPAT: use composition change events as a hint to where we should insert
                // composition text if we aren't composing to work around https://github.com/ianstormtaylor/slate/issues/5038
                if (isCompositionChange && AngularEditor.isComposing(editor)) {
                    return;
                }
        
                let native = false;
                if (
                    type === "insertText" &&
                    selection &&
                    Range.isCollapsed(selection) &&
                    // Only use native character insertion for single characters a-z or space for now.
                    // Long-press events (hold a + press 4 = ä) to choose a special character otherwise
                    // causes duplicate inserts.
                    event.data &&
                    event.data.length === 1 &&
                    /[a-z ]/i.test(event.data) &&
                    // Chrome has issues correctly editing the start of nodes: https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
                    // When there is an inline element, e.g. a link, and you select
                    // right after it (the start of the next node).
                    selection.anchor.offset !== 0
                ) {
                    native = true;
        
                    // Skip native if there are marks, as
                    // `insertText` will insert a node, not just text.
                    if (editor.marks) {
                        native = false;
                    }
        
                    // Chrome also has issues correctly editing the end of anchor elements: https://bugs.chromium.org/p/chromium/issues/detail?id=1259100
                    // Therefore we don't allow native events to insert text at the end of anchor nodes.
                    const { anchor } = selection;
        
                    const [node, offset] = AngularEditor.toDOMPoint(editor, anchor);
                    const anchorNode = node.parentElement?.closest("a");
        
                    const window = AngularEditor.getWindow(editor);
        
                    if (
                        native &&
                        anchorNode &&
                        AngularEditor.hasDOMNode(editor, anchorNode)
                    ) {
                        // Find the last text node inside the anchor.
                        const lastText = window?.document
                            .createTreeWalker(anchorNode, NodeFilter.SHOW_TEXT)
                            .lastChild() as DOMText | null;
            
                        if (lastText === node && lastText.textContent?.length === offset) {
                            native = false;
                        }
                    }
        
                    // Chrome has issues with the presence of tab characters inside elements with whiteSpace = 'pre'
                    // causing abnormal insert behavior: https://bugs.chromium.org/p/chromium/issues/detail?id=1219139
                    if (
                        native &&
                        node.parentElement &&
                        window?.getComputedStyle(node.parentElement)?.whiteSpace === "pre"
                    ) {
                        const block = Editor.above(editor, {
                            at: anchor.path,
                            match: n => Editor.isBlock(editor, n)
                        });
        
                        if (block && Node.string(block[0]).includes("\t")) {
                            native = false;
                        }
                    }
                }
        
                // COMPAT: For the deleting forward/backward input types we don't want
                // to change the selection because it is the range that will be deleted,
                // and those commands determine that for themselves.
                if (!type.startsWith("delete") || type.startsWith("deleteBy")) {
                    const [targetRange] = (event as any).getTargetRanges();
        
                    if (targetRange) {
                    const range = AngularEditor.toSlateRange(editor, targetRange, {
                        exactMatch: false,
                        suppressThrow: false
                    });
        
                    if (!selection || !Range.equals(selection, range)) {
                        native = false;
        
                        const selectionRef =
                        !isCompositionChange &&
                        editor.selection &&
                        Editor.rangeRef(editor, editor.selection);
        
                        Transforms.select(editor, range);
        
                        if (selectionRef) {
                            EDITOR_TO_USER_SELECTION.set(editor, selectionRef);
                        }
                    }
                    }
                }
        
                // Composition change types occur while a user is composing text and can't be
                // cancelled. Let them through and wait for the composition to end.
                if (isCompositionChange) {
                    return;
                }
        
                if (!native) {
                    event.preventDefault();
                }
        
                // COMPAT: If the selection is expanded, even if the command seems like
                // a delete forward/backward command it should delete the selection.
                if (
                    selection &&
                    Range.isExpanded(selection) &&
                    type.startsWith("delete")
                ) {
                    const direction = type.endsWith("Backward") ? "backward" : "forward";
                    Editor.deleteFragment(editor, { direction });
                    return;
                }
        
                switch (type) {
                    case "deleteByComposition":
                    case "deleteByCut":
                    case "deleteByDrag": {
                        Editor.deleteFragment(editor);
                        break;
                    }
        
                    case "deleteContent":
                    case "deleteContentForward": {
                        Editor.deleteForward(editor);
                        break;
                    }
        
                    case "deleteContentBackward": {
                        Editor.deleteBackward(editor);
                        break;
                    }
        
                    case "deleteEntireSoftLine": {
                        Editor.deleteBackward(editor, { unit: "line" });
                        Editor.deleteForward(editor, { unit: "line" });
                        break;
                    }
        
                    case "deleteHardLineBackward": {
                        Editor.deleteBackward(editor, { unit: "block" });
                        break;
                    }
        
                    case "deleteSoftLineBackward": {
                        Editor.deleteBackward(editor, { unit: "line" });
                        break;
                    }
        
                    case "deleteHardLineForward": {
                        Editor.deleteForward(editor, { unit: "block" });
                        break;
                    }
        
                    case "deleteSoftLineForward": {
                        Editor.deleteForward(editor, { unit: "line" });
                        break;
                    }
        
                    case "deleteWordBackward": {
                        Editor.deleteBackward(editor, { unit: "word" });
                        break;
                    }
        
                    case "deleteWordForward": {
                        Editor.deleteForward(editor, { unit: "word" });
                        break;
                    }
        
                    case "insertLineBreak":
                        Editor.insertSoftBreak(editor);
                        break;
        
                    case "insertParagraph": {
                        Editor.insertBreak(editor);
                        break;
                    }
        
                    case "insertFromComposition":
                    case "insertFromDrop":
                    case "insertFromPaste":
                    case "insertFromYank":
                    case "insertReplacementText":
                    case "insertText": {
                        const { selection } = editor;
                        if (selection) {
                            if (Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor);
                            }
                        }
            
                        if (type === "insertFromComposition") {
                            // COMPAT: in Safari, `compositionend` is dispatched after the
                            // `beforeinput` for "insertFromComposition". But if we wait for it
                            // then we will abort because we're still composing and the selection
                            // won't be updated properly.
                            // https://www.w3.org/TR/input-events-2/
                            if (AngularEditor.isComposing(editor)) {
                                this.isComposing = false;
                                IS_COMPOSING.set(editor, false);
                            }
                        }
            
                        // use a weak comparison instead of 'instanceof' to allow
                        // programmatic access of paste events coming from external windows
                        // like cypress where cy.window does not work realibly
                        if (data?.constructor.name === "DataTransfer") {
                            AngularEditor.insertData(editor, data);
                        } else if (typeof data === "string") {
                            // Only insertText operations use the native functionality, for now.
                            // Potentially expand to single character deletes, as well.
                            if (native) {
                            this.deferredOperations.current.push(() =>
                                Editor.insertText(editor, data)
                            );
                            } else {
                            Editor.insertText(editor, data);
                            }
                        }
            
                        break;
                    }
                }
        
                // Restore the actual user section if nothing manually set it.
                const toRestore = EDITOR_TO_USER_SELECTION.get(editor)?.unref();
                EDITOR_TO_USER_SELECTION.delete(editor);
        
                if (
                    toRestore &&
                    (!editor.selection || !Range.equals(editor.selection, toRestore))
                ) {
                    Transforms.select(editor, toRestore);
                }
            }
          } catch (error) {
            this.editor.onError({
              code: SlateErrorCode.OnDOMBeforeInputError,
              nativeError: error
            });
          }
    }

    private onDOMInput(_event: Event) {
        if (this.androidInputManager) {
            this.androidInputManager.handleInput();
            return;
        }
    
        // Flush native operations, as native events will have propogated
        // and we can correctly compare DOM text values in components
        // to stop rendering, so that browser functions like autocorrect
        // and spellcheck work as expected.
        for (const op of this.deferredOperations.current) {
            op();
        }

        this.deferredOperations.current = [];
    }

    private onDOMBlur(event: FocusEvent) {
        if (
            this.readonly ||
            this.state.isUpdatingSelection ||
            !hasEditableTarget(this.editor, event.target) ||
            this.isDOMEventHandled(event, this.blur)
        ) {
            return;
        }

        // COMPAT: If the current `activeElement` is still the previous
        // one, this is due to the window being blurred when the tab
        // itself becomes unfocused, so we want to abort early to allow to
        // editor to stay focused when the tab becomes focused again.
        const root = AngularEditor.findDocumentOrShadowRoot(this.editor);
        if (this.state.latestElement === root.activeElement) {
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

            if (Element.isElement(node) && !this.editor.isVoid(node)) {
                return;
            }
        }

        // COMPAT: Safari doesn't always remove the selection even if the content-
        // editable element no longer has focus. Refer to:
        // https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
        if (IS_SAFARI) {
            const domSelection = (root as Document).getSelection();
            domSelection?.removeAllRanges();
        }

        IS_FOCUSED.delete(this.editor);
    }

    private onDOMClick(event: MouseEvent) {
        if (
            hasTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.click) &&
            isDOMNode(event.target)
        ) {
            const node = AngularEditor.toSlateNode(this.editor, event.target);
            const path = AngularEditor.findPath(this.editor, node);

            // At this time, the Slate document may be arbitrarily different,
            // because onClick handlers can change the document before we get here.
            // Therefore we must check that this path actually exists,
            // and that it still refers to the same node.
            if (!Editor.hasPath(this.editor, path) || Node.get(this.editor, path) !== node) {
                return;
            }

            if (event.detail === TRIPLE_CLICK && path.length >= 1) {
                let blockPath = path;
                if (!Editor.isBlock(this.editor, node)) {
                    const block = Editor.above(this.editor, {
                        match: n => Editor.isBlock(this.editor, n),
                        at: path
                    });
        
                    blockPath = block?.[1] ?? path.slice(0, 1);
                }
        
                const range = Editor.range(this.editor, blockPath);
                Transforms.select(this.editor, range);
                return;
            }
    
            if (this.readonly) {
                return;
            }

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
        if (hasEditableTarget(this.editor, event.target)) {
            if (AngularEditor.isComposing(this.editor)) {
                this.isComposing = false;
                IS_COMPOSING.set(this.editor, false);
            }
      
            this.androidInputManager?.handleCompositionEnd(event);
      
            if (this.isDOMEventHandled(event, this.compositionEnd) || IS_ANDROID) {
                return;
            }
      
            // COMPAT: In Chrome, `beforeinput` events for compositions
            // aren't correct and never fire the "insertFromComposition"
            // type that we need. So instead, insert whenever a composition
            // ends since it will already have been committed to the DOM.
            if (
                !IS_SAFARI &&
                !IS_FIREFOX_LEGACY &&
                !IS_IOS &&
                !IS_QQBROWSER &&
                !IS_WECHATBROWSER &&
                !IS_UC_MOBILE &&
                event.data
            ) {
                const placeholderMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(this.editor);
                EDITOR_TO_PENDING_INSERTION_MARKS.delete(this.editor);
        
                // Ensure we insert text with the marks the user was actually seeing
                if (placeholderMarks !== undefined) {
                    EDITOR_TO_USER_MARKS.set(this.editor, this.editor.marks);
                    this.editor.marks = placeholderMarks;
                }
        
                Editor.insertText(this.editor, event.data);
        
                const userMarks = EDITOR_TO_USER_MARKS.get(this.editor);
                EDITOR_TO_USER_MARKS.delete(this.editor);
                if (userMarks !== undefined) {
                    this.editor.marks = userMarks;
                }
            }
        }
        
        this.detectContext();
        this.cdr.detectChanges();
    }

    private onDOMCompositionUpdate(event: CompositionEvent) {
        if (
            hasEditableTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.compositionUpdate)
        ) {
            if (!AngularEditor.isComposing(this.editor)) {
                this.isComposing = true;
                IS_COMPOSING.set(this.editor, true);
            }
        }
        
        this.detectContext();
        this.cdr.detectChanges();
    }

    private onDOMCompositionStart(event: CompositionEvent) {
        if (hasEditableTarget(this.editor, event.target)) {
            this.androidInputManager?.handleCompositionStart(event);

            if (this.isDOMEventHandled(event, this.compositionStart) || IS_ANDROID) {
                return;
            }

            this.isComposing = true;

            const { selection } = this.editor;
            if (selection) {
                if (Range.isExpanded(selection)) {
                    Editor.deleteFragment(this.editor);
                    return;
                }
                const inline = Editor.above(this.editor, {
                    match: n => Editor.isInline(this.editor, n),
                    mode: "highest"
                });
                if (inline) {
                    const [, inlinePath] = inline;
                    if (Editor.isEnd(this.editor, selection.anchor, inlinePath)) {
                        const point = Editor.after(this.editor, inlinePath)!;
                        Transforms.setSelection(this.editor, {
                            anchor: point,
                            focus: point
                        });
                    }
                }
            }
        }

        this.detectContext();
        this.cdr.detectChanges();
    }

    private onDOMCopy(event: ClipboardEvent) {
        if (
            hasEditableTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.onDOMCopy)
        ) {
            event.preventDefault();
            AngularEditor.setFragmentData(this.editor, event.clipboardData, "copy");
        }
    }

    private onDOMCut(event: ClipboardEvent) {
        if (
            !this.readonly &&
            hasEditableTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.onDOMCut)
        ) {
            event.preventDefault();
            AngularEditor.setFragmentData(this.editor, event.clipboardData, "cut");
            const { selection } = this.editor;

            if (selection) {
                if (Range.isExpanded(selection)) {
                    Editor.deleteFragment(this.editor);
                } else {
                    const node = Node.parent(this.editor, selection.anchor.path);
                    if (Editor.isVoid(this.editor, node)) {
                        Transforms.delete(this.editor);
                    }
                }
            }
        }
    }

    private onDOMDragOver(event: DragEvent) {
        if (hasTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.dragOver)) {
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
        if (!this.readonly && hasTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.dragStart)) {
            const node = AngularEditor.toSlateNode(this.editor, event.target);
            const path = AngularEditor.findPath(this.editor, node);
            const voidMatch =
                Editor.isVoid(this.editor, node) ||
                Editor.void(this.editor, { at: path, voids: true });

            // If starting a drag on a void node, make sure it is selected
            // so that it shows up in the selection's fragment.
            if (voidMatch) {
                const range = Editor.range(this.editor, path);
                Transforms.select(this.editor, range);
            }

            this.state.isDraggingInternally = true;

            AngularEditor.setFragmentData(this.editor, event.dataTransfer, 'drag');
        }
    }

    private onDOMDrop(event: DragEvent) {
        const editor = this.editor;
        if (!this.readonly && hasTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.drop)) {
            event.preventDefault();
            // Keep a reference to the dragged range before updating selection
            const draggedRange = editor.selection;

            // Find the range where the drop happened
            const range = AngularEditor.findEventRange(editor, event);
            const data = event.dataTransfer;

            Transforms.select(editor, range);

            if (this.state.isDraggingInternally) {
                if (
                    draggedRange &&
                    !Range.equals(draggedRange, range) &&
                    !Editor.void(editor, { at: range, voids: true })
                ) {
                    Transforms.delete(editor, {
                        at: draggedRange,
                    });
                }
            }

            AngularEditor.insertData(editor, data);

            // When dragging from another source into the editor, it's possible
            // that the current editor does not have focus.
            if (!AngularEditor.isFocused(editor)) {
                AngularEditor.focus(editor);
            }
        }
    }

    private onDOMDragEnd(event: DragEvent) {
        if (!this.readonly && this.state.isDraggingInternally && hasTarget(this.editor, event.target) && this.dragEnd) {
            this.dragEnd(event);
        }

        // When dropping on a different droppable element than the current editor,
        // `onDrop` is not called. So we need to clean up in `onDragEnd` instead.
        // Note: `onDragEnd` is only called when `onDrop` is not called
        this.state.isDraggingInternally = false;
    }

    private onDOMFocus(event: Event) {
        if (
            !this.readonly &&
            !this.state.isUpdatingSelection &&
            hasEditableTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.focus)
        ) {
            const el = AngularEditor.toDOMNode(this.editor, this.editor);
            const root = AngularEditor.findDocumentOrShadowRoot(this.editor);
            this.state.latestElement = root.activeElement

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
        const root = AngularEditor.findDocumentOrShadowRoot(this.editor)
        const { activeElement } = root;
        if (
            !this.readonly &&
            hasEditableTarget(editor, event.target)
        ) {
            this.androidInputManager?.handleKeyDown(event);

            const nativeEvent = event;

            // COMPAT: The composition end event isn't fired reliably in all browsers,
            // so we sometimes might end up stuck in a composition state even though we
            // aren't composing any more.
            if (
                AngularEditor.isComposing(editor) &&
                nativeEvent.isComposing === false
            ) {
                IS_COMPOSING.set(editor, false);
                this.isComposing = false;
            }
    
            if (
                this.isDOMEventHandled(event, this.keydown) ||
                AngularEditor.isComposing(editor)
            ) {
                return;
            }

            const { selection } = editor;

            const element = editor.children[selection !== null ? selection.focus.path[0] : 0];
            const isRTL = getDirection(Node.string(element)) === 'rtl';

            try {
                // COMPAT: Since we prevent the default behavior on
                // `beforeinput` events, the browser doesn't think there's ever
                // any history stack to undo or redo, so we have to manage these
                // hotkeys ourselves. (2019/11/06)
                if (Hotkeys.isRedo(nativeEvent)) {
                    event.preventDefault();
                    const maybeHistoryEditor: any = editor;
        
                    if (typeof maybeHistoryEditor.redo === "function") {
                        maybeHistoryEditor.redo();
                    }
        
                    return;
                }
        
                if (Hotkeys.isUndo(nativeEvent)) {
                    event.preventDefault();
                    const maybeHistoryEditor: any = editor;
        
                    if (typeof maybeHistoryEditor.undo === "function") {
                        maybeHistoryEditor.undo();
                    }
        
                    return;
                }
        
                // COMPAT: Certain browsers don't handle the selection updates
                // properly. In Chrome, the selection isn't properly extended.
                // And in Firefox, the selection isn't properly collapsed.
                // (2017/10/17)
                if (Hotkeys.isMoveLineBackward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, { unit: "line", reverse: true });
                    return;
                }
        
                if (Hotkeys.isMoveLineForward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, { unit: "line" });
                    return;
                }
        
                if (Hotkeys.isExtendLineBackward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, {
                        unit: "line",
                        edge: "focus",
                        reverse: true
                    });
                    return;
                }
        
                if (Hotkeys.isExtendLineForward(nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, { unit: "line", edge: "focus" });
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
                        Transforms.move(editor, { reverse: !isRTL });
                    } else {
                        Transforms.collapse(editor, { edge: "start" });
                    }
        
                    return;
                }
        
                if (Hotkeys.isMoveForward(nativeEvent)) {
                    event.preventDefault();
        
                    if (selection && Range.isCollapsed(selection)) {
                        Transforms.move(editor, { reverse: isRTL });
                    } else {
                        Transforms.collapse(editor, { edge: "end" });
                    }
        
                    return;
                }
        
                if (Hotkeys.isMoveWordBackward(nativeEvent)) {
                    event.preventDefault();
        
                    if (selection && Range.isExpanded(selection)) {
                        Transforms.collapse(editor, { edge: "focus" });
                    }
        
                    Transforms.move(editor, { unit: "word", reverse: !isRTL });
                    return;
                }
        
                if (Hotkeys.isMoveWordForward(nativeEvent)) {
                    event.preventDefault();
        
                    if (selection && Range.isExpanded(selection)) {
                        Transforms.collapse(editor, { edge: "focus" });
                    }
        
                    Transforms.move(editor, { unit: "word", reverse: isRTL });
                    return;
                }
        
                // COMPAT: Certain browsers don't support the `beforeinput` event, so we
                // fall back to guessing at the input intention for hotkeys.
                // COMPAT: In iOS, some of these hotkeys are handled in the
                if (!HAS_BEFORE_INPUT_SUPPORT) {
                    // We don't have a core behavior for these, but they change the
                    // DOM if we don't prevent them, so we have to.
                    if (
                        Hotkeys.isBold(nativeEvent) ||
                        Hotkeys.isItalic(nativeEvent) ||
                        Hotkeys.isTransposeCharacter(nativeEvent)
                    ) {
                        event.preventDefault();
                        return;
                    }
        
                    if (Hotkeys.isSoftBreak(nativeEvent)) {
                        event.preventDefault();
                        Editor.insertSoftBreak(editor);
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
                            Editor.deleteFragment(editor, { direction: "backward" });
                        } else {
                            Editor.deleteBackward(editor);
                        }
            
                        return;
                    }
            
                    if (Hotkeys.isDeleteForward(nativeEvent)) {
                        event.preventDefault();
            
                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, { direction: "forward" });
                        } else {
                            Editor.deleteForward(editor);
                        }
            
                        return;
                    }
            
                    if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
                        event.preventDefault();
            
                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, { direction: "backward" });
                        } else {
                            Editor.deleteBackward(editor, { unit: "line" });
                        }
            
                        return;
                    }
            
                    if (Hotkeys.isDeleteLineForward(nativeEvent)) {
                        event.preventDefault();
            
                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, { direction: "forward" });
                        } else {
                            Editor.deleteForward(editor, { unit: "line" });
                        }
            
                        return;
                    }
            
                    if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
                        event.preventDefault();
            
                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, { direction: "backward" });
                        } else {
                            Editor.deleteBackward(editor, { unit: "word" });
                        }
            
                        return;
                    }
            
                    if (Hotkeys.isDeleteWordForward(nativeEvent)) {
                        event.preventDefault();
            
                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, { direction: "forward" });
                        } else {
                            Editor.deleteForward(editor, { unit: "word" });
                        }
            
                        return;
                    }
                } else {
                    if (IS_CHROME || IS_SAFARI) {
                        // COMPAT: Chrome and Safari support `beforeinput` event but do not fire
                        // an event when deleting backwards in a selected void inline node
                        if (
                            selection &&
                            (Hotkeys.isDeleteBackward(nativeEvent) ||
                            Hotkeys.isDeleteForward(nativeEvent)) &&
                            Range.isCollapsed(selection)
                        ) {
                            const currentNode = Node.parent(editor, selection.anchor.path);
            
                            if (
                                Element.isElement(currentNode) &&
                                Editor.isVoid(editor, currentNode) &&
                                Editor.isInline(editor, currentNode)
                            ) {
                                event.preventDefault();
                                Editor.deleteBackward(editor, { unit: "block" });
                
                                return;
                            }
                        }
                    }
                }
            } catch (error) {
                this.editor.onError({ code: SlateErrorCode.OnDOMKeydownError, nativeError: error });
            }
        }
    }

    private onDOMPaste(event: ClipboardEvent) {
        if (
            !this.isDOMEventHandled(event, this.paste) &&
            !this.readonly &&
            hasEditableTarget(this.editor, event.target)
        ) {
            // COMPAT: Certain browsers don't support the `beforeinput` event, so we
            // fall back to React's `onPaste` here instead.
            // COMPAT: Firefox, Chrome and Safari are not emitting `beforeinput` events
            // when "paste without formatting" is used, so fallback (2022/02/20)
            if (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event)) {
                event.preventDefault();
                AngularEditor.insertData(this.editor, event.clipboardData);
            }
        }
    }

    private onFallbackBeforeInput(event: BeforeInputEvent) {
        // COMPAT: Certain browsers don't support the `beforeinput` event, so we
        // fall back to React's leaky polyfill instead just for it. It
        // only works for the `insertText` input type.
        if (
            !HAS_BEFORE_INPUT_SUPPORT &&
            !this.readonly &&
            !this.isDOMEventHandled(event.nativeEvent, this.beforeInput) &&
            hasEditableTarget(this.editor, event.nativeEvent.target)
        ) {
            event.nativeEvent.preventDefault();
            try {
                if (!AngularEditor.isComposing(this.editor)) {
                    const text = (event as any).data as string;
                    Editor.insertText(this.editor, text);
                }
            } catch (error) {
                this.editor.onError({ code: SlateErrorCode.ToNativeSelectionError, nativeError: error });
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

    ngOnDestroy() {
        super.ngOnDestroy();

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
 * Check if the target is inside void and in an non-readonly editor.
 */

export const isTargetInsideNonReadonlyVoid = (
    editor: AngularEditor,
    target: EventTarget | null
): boolean => {
    if (IS_READONLY.get(editor)) return false;
  
    const slateNode =
      hasTarget(editor, target) && AngularEditor.toSlateNode(editor, target);
    return Editor.isVoid(editor, slateNode);
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
 * A default implement to scroll dom range into view.
 */

const defaultScrollSelectionIntoView = (
    editor: AngularEditor,
    domRange: DOMRange
) => {
    // This was affecting the selection of multiple blocks and dragging behavior,
    // so enabled only if the selection has been collapsed.
    if (
      !editor.selection ||
      (editor.selection && Range.isCollapsed(editor.selection))
    ) {
      const leafEl = domRange.startContainer.parentElement!;
      leafEl.getBoundingClientRect = domRange.getBoundingClientRect.bind(
        domRange
      );
      scrollIntoView(leafEl, {
        scrollMode: "if-needed"
      });
  
      delete leafEl.getBoundingClientRect;
    }
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
const preventInsertFromComposition = (event: Event, editor: AngularEditor) => {
    const types = ['compositionend', 'insertFromComposition'];
    if (!types.includes(event.type)) {
        return;
    }
    const insertText = (event as CompositionEvent).data;
    const window = AngularEditor.getWindow(editor);
    const domSelection = window.getSelection();
    // ensure text node insert composition input text
    if (insertText && domSelection.anchorNode instanceof Text && domSelection.anchorNode.textContent.endsWith(insertText)) {
        const textNode = domSelection.anchorNode;
        textNode.splitText(textNode.length - insertText.length).remove();
    }
}
