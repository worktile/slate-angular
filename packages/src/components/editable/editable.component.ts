import {
    Component,
    OnInit,
    Input,
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
    DoCheck,
    inject,
    ViewContainerRef
} from '@angular/core';
import { Text as SlateText, Element, Transforms, Editor, Range, Path, NodeEntry, Node } from 'slate';
import { direction } from 'direction';
import scrollIntoView from 'scroll-into-view-if-needed';
import { AngularEditor } from '../../plugins/angular-editor';
import {
    DOMElement,
    isDOMNode,
    DOMStaticRange,
    DOMRange,
    isDOMElement,
    isPlainTextOnlyPaste,
    DOMSelection,
    getDefaultView,
    EDITOR_TO_WINDOW,
    EDITOR_TO_ELEMENT,
    NODE_TO_ELEMENT,
    ELEMENT_TO_NODE,
    IS_FOCUSED,
    IS_READ_ONLY
} from 'slate-dom';
import { Subject } from 'rxjs';
import {
    IS_FIREFOX,
    IS_SAFARI,
    IS_CHROME,
    HAS_BEFORE_INPUT_SUPPORT,
    IS_ANDROID,
    VIRTUAL_SCROLL_DEFAULT_BUFFER_COUNT,
    VIRTUAL_SCROLL_DEFAULT_BLOCK_HEIGHT,
    SLATE_DEBUG_KEY
} from '../../utils/environment';
import Hotkeys from '../../utils/hotkeys';
import { BeforeInputEvent, extractBeforeInputEvent } from '../../custom-event/BeforeInputEventPlugin';
import { BEFORE_INPUT_EVENTS } from '../../custom-event/before-input-polyfill';
import { SlateErrorCode } from '../../types/error';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SlateChildrenContext, SlateViewContext } from '../../view/context';
import { ViewType } from '../../types/view';
import { HistoryEditor } from 'slate-history';
import { ELEMENT_TO_COMPONENT, isDecoratorRangeListEqual } from '../../utils';
import { SlatePlaceholder } from '../../types/feature';
import { restoreDom } from '../../utils/restore-dom';
import { ListRender } from '../../view/render/list-render';
import { TRIPLE_CLICK, EDITOR_TO_ON_CHANGE } from 'slate-dom';
import { BaseElementComponent } from '../../view/base';
import { BaseElementFlavour } from '../../view/flavour/element';
import { SlateVirtualScrollConfig, VirtualViewResult } from '../../types';

export const JUST_NOW_UPDATED_VIRTUAL_VIEW = new WeakMap<AngularEditor, boolean>();

// not correctly clipboardData on beforeinput
const forceOnDOMPaste = IS_SAFARI;

const isDebug = localStorage.getItem(SLATE_DEBUG_KEY) === 'true';

@Component({
    selector: 'slate-editable',
    host: {
        class: 'slate-editable-container',
        '[attr.contenteditable]': 'readonly ? undefined : true',
        '[attr.role]': `readonly ? undefined : 'textbox'`,
        '[attr.spellCheck]': `!hasBeforeInputSupport ? false : spellCheck`,
        '[attr.autoCorrect]': `!hasBeforeInputSupport ? 'false' : autoCorrect`,
        '[attr.autoCapitalize]': `!hasBeforeInputSupport ? 'false' : autoCapitalize`
    },
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SlateEditable),
            multi: true
        }
    ],
    imports: []
})
export class SlateEditable implements OnInit, OnChanges, OnDestroy, AfterViewChecked, DoCheck {
    viewContext: SlateViewContext;
    context: SlateChildrenContext;

    private destroy$ = new Subject();

    isComposing = false;
    isDraggingInternally = false;
    isUpdatingSelection = false;
    latestElement = null as DOMElement | null;

    protected manualListeners: (() => void)[] = [];

    private initialized: boolean;

    private onTouchedCallback: () => void = () => {};

    private onChangeCallback: (_: any) => void = () => {};

    @Input() editor: AngularEditor;

    @Input() renderElement: (element: Element) => ViewType | null;

    @Input() renderLeaf: (text: SlateText) => ViewType | null;

    @Input() renderText: (text: SlateText) => ViewType | null;

    @Input() decorate: (entry: NodeEntry) => Range[] = () => [];

    @Input() placeholderDecorate: (editor: Editor) => SlatePlaceholder[];

    @Input() scrollSelectionIntoView: (editor: AngularEditor, domRange: DOMRange) => void = defaultScrollSelectionIntoView;

    @Input() isStrictDecorate: boolean = true;

    @Input() trackBy: (node: Element) => any = () => null;

    @Input() readonly = false;

    @Input() placeholder: string;

    @Input()
    set virtualScroll(config: SlateVirtualScrollConfig) {
        this.virtualConfig = config;
        this.refreshVirtualViewAnimId && cancelAnimationFrame(this.refreshVirtualViewAnimId);
        this.refreshVirtualViewAnimId = requestAnimationFrame(() => {
            let virtualView = this.refreshVirtualView();
            let diff = this.diffVirtualView(virtualView);
            if (!diff.isDiff) {
                return;
            }
            if (diff.isMissingTop) {
                const result = this.remeasureHeightByIndics([...diff.diffTopRenderedIndexes]);
                if (result) {
                    virtualView = this.refreshVirtualView();
                    diff = this.diffVirtualView(virtualView, 'second');
                    if (!diff.isDiff) {
                        return;
                    }
                }
            }
            this.applyVirtualView(virtualView);
            if (this.listRender.initialized) {
                this.listRender.update(virtualView.renderedChildren, this.editor, this.context);
            }
            this.scheduleMeasureVisibleHeights();
        });
    }

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

    viewContainerRef = inject(ViewContainerRef);

    getOutletParent = () => {
        return this.elementRef.nativeElement;
    };

    getOutletElement = () => {
        if (this.virtualScrollInitialized) {
            return this.virtualCenterOutlet;
        } else {
            return null;
        }
    };

    listRender: ListRender;

    private virtualConfig: SlateVirtualScrollConfig = {
        enabled: false,
        scrollTop: 0,
        viewportHeight: 0
    };
    private renderedChildren: Element[] = [];
    private virtualVisibleIndexes = new Set<number>();
    private measuredHeights = new Map<string, number>();
    private measurePending = false;
    private refreshVirtualViewAnimId: number;
    private measureVisibleHeightsAnimId: number;

    constructor(
        public elementRef: ElementRef,
        public renderer2: Renderer2,
        public cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private injector: Injector
    ) {}

    ngOnInit() {
        this.editor.injector = this.injector;
        this.editor.children = [];
        let window = getDefaultView(this.elementRef.nativeElement);
        EDITOR_TO_WINDOW.set(this.editor, window);
        EDITOR_TO_ELEMENT.set(this.editor, this.elementRef.nativeElement);
        NODE_TO_ELEMENT.set(this.editor, this.elementRef.nativeElement);
        ELEMENT_TO_NODE.set(this.elementRef.nativeElement, this.editor);
        IS_READ_ONLY.set(this.editor, this.readonly);
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

        // add browser class
        let browserClass = IS_FIREFOX ? 'firefox' : IS_SAFARI ? 'safari' : '';
        browserClass && this.elementRef.nativeElement.classList.add(browserClass);
        this.initializeVirtualScrolling();
        this.listRender = new ListRender(this.viewContext, this.viewContainerRef, this.getOutletParent, this.getOutletElement);
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (!this.initialized) {
            return;
        }
        const decorateChange = simpleChanges['decorate'];
        if (decorateChange) {
            this.forceRender();
        }
        const placeholderChange = simpleChanges['placeholder'];
        if (placeholderChange) {
            this.render();
        }
        const readonlyChange = simpleChanges['readonly'];
        if (readonlyChange) {
            IS_READ_ONLY.set(this.editor, this.readonly);
            this.render();
            this.toSlateSelection();
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
            this.editor.children = value;
            this.initializeContext();
            const virtualView = this.refreshVirtualView();
            this.applyVirtualView(virtualView);
            const childrenForRender = virtualView.renderedChildren;
            if (!this.listRender.initialized) {
                this.listRender.initialize(childrenForRender, this.editor, this.context);
            } else {
                this.listRender.update(childrenForRender, this.editor, this.context);
            }
            this.scheduleMeasureVisibleHeights();
            this.cdr.markForCheck();
        }
    }

    initialize() {
        this.initialized = true;
        const window = AngularEditor.getWindow(this.editor);
        this.addEventListener(
            'selectionchange',
            event => {
                this.toSlateSelection();
            },
            window.document
        );
        if (HAS_BEFORE_INPUT_SUPPORT) {
            this.addEventListener('beforeinput', this.onDOMBeforeInput.bind(this));
        }
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
            this.addEventListener(event.name, () => {});
        });
    }

    toNativeSelection() {
        try {
            const { selection } = this.editor;
            const root = AngularEditor.findDocumentOrShadowRoot(this.editor);
            const { activeElement } = root;
            const domSelection = (root as Document).getSelection();

            if ((this.isComposing && !IS_ANDROID) || !domSelection || !AngularEditor.isFocused(this.editor)) {
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
            if (hasDomSelection && hasDomSelectionInEditor && selection && hasStringTarget(domSelection)) {
                const rangeFromDOMSelection = AngularEditor.toSlateRange(this.editor, domSelection, {
                    exactMatch: false,
                    suppressThrow: true
                });
                if (rangeFromDOMSelection && Range.equals(rangeFromDOMSelection, selection)) {
                    return;
                }
            }

            // prevent updating native selection when active element is void element
            if (isTargetInsideVoid(this.editor, activeElement)) {
                return;
            }

            // when <Editable/> is being controlled through external value
            // then its children might just change - DOM responds to it on its own
            // but Slate's value is not being updated through any operation
            // and thus it doesn't transform selection on its own
            if (selection && !AngularEditor.hasRange(this.editor, selection)) {
                this.editor.selection = AngularEditor.toSlateRange(this.editor, domSelection, { exactMatch: false, suppressThrow: false });
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
                    // eslint-disable-next-line max-len
                    domSelection.setBaseAndExtent(
                        newDomRange.endContainer,
                        newDomRange.endOffset,
                        newDomRange.startContainer,
                        newDomRange.startOffset
                    );
                } else {
                    // eslint-disable-next-line max-len
                    domSelection.setBaseAndExtent(
                        newDomRange.startContainer,
                        newDomRange.startOffset,
                        newDomRange.endContainer,
                        newDomRange.endOffset
                    );
                }
            } else {
                domSelection.removeAllRanges();
            }

            setTimeout(() => {
                // handle scrolling in setTimeout because of
                // dom should not have updated immediately after listRender's updating
                newDomRange && this.scrollSelectionIntoView(this.editor, newDomRange);
                // COMPAT: In Firefox, it's not enough to create a range, you also need
                // to focus the contenteditable element too. (2016/11/16)
                if (newDomRange && IS_FIREFOX) {
                    el.focus();
                }

                this.isUpdatingSelection = false;
            });
        } catch (error) {
            this.editor.onError({
                code: SlateErrorCode.ToNativeSelectionError,
                nativeError: error
            });
            this.isUpdatingSelection = false;
        }
    }

    onChange() {
        this.forceRender();
        this.onChangeCallback(this.editor.children);
    }

    ngAfterViewChecked() {}

    ngDoCheck() {}

    forceRender() {
        this.updateContext();
        const virtualView = this.refreshVirtualView();
        this.applyVirtualView(virtualView);
        this.listRender.update(virtualView.renderedChildren, this.editor, this.context);
        this.scheduleMeasureVisibleHeights();
        // repair collaborative editing when Chinese input is interrupted by other users' cursors
        // when the DOMElement where the selection is located is removed
        // the compositionupdate and compositionend events will no longer be fired
        // so isComposing needs to be corrected
        // need exec after this.cdr.detectChanges() to render HTML
        // need exec before this.toNativeSelection() to correct native selection
        if (this.isComposing) {
            // Composition input text be not rendered when user composition input with selection is expanded
            // At this time, the following matching conditions are met, assign isComposing to false, and the status is wrong
            // this time condition is true and isComposing is assigned false
            // Therefore, need to wait for the composition input text to be rendered before performing condition matching
            setTimeout(() => {
                const textNode = Node.get(this.editor, this.editor.selection.anchor.path);
                const textDOMNode = AngularEditor.toDOMNode(this.editor, textNode);
                let textContent = '';
                // skip decorate text
                textDOMNode.querySelectorAll('[editable-text]').forEach(stringDOMNode => {
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
    }

    render() {
        const changed = this.updateContext();
        if (changed) {
            const virtualView = this.refreshVirtualView();
            this.applyVirtualView(virtualView);
            this.listRender.update(virtualView.renderedChildren, this.editor, this.context);
            this.scheduleMeasureVisibleHeights();
        }
    }

    updateContext() {
        const decorations = this.generateDecorations();
        if (
            this.context.selection !== this.editor.selection ||
            this.context.decorate !== this.decorate ||
            this.context.readonly !== this.readonly ||
            !isDecoratorRangeListEqual(this.context.decorations, decorations)
        ) {
            this.context = {
                parent: this.editor,
                selection: this.editor.selection,
                decorations: decorations,
                decorate: this.decorate,
                readonly: this.readonly
            };
            return true;
        }
        return false;
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
            isStrictDecorate: this.isStrictDecorate
        };
    }

    composePlaceholderDecorate(editor: Editor) {
        if (this.placeholderDecorate) {
            return this.placeholderDecorate(editor) || [];
        }

        if (this.placeholder && editor.children.length === 1 && Array.from(Node.texts(editor)).length === 1 && Node.string(editor) === '') {
            const start = Editor.start(editor, []);
            return [
                {
                    placeholder: this.placeholder,
                    anchor: start,
                    focus: start
                }
            ];
        } else {
            return [];
        }
    }

    generateDecorations() {
        const decorations = this.decorate([this.editor, []]);
        const placeholderDecorations = this.isComposing ? [] : this.composePlaceholderDecorate(this.editor);
        decorations.push(...placeholderDecorations);
        return decorations;
    }

    private shouldUseVirtual() {
        return !!(this.virtualConfig && this.virtualConfig.enabled);
    }

    private h1: number = 0;

    virtualScrollInitialized = false;

    virtualTopHeightElement: HTMLElement;

    virtualBottomHeightElement: HTMLElement;

    virtualCenterOutlet: HTMLElement;

    initializeVirtualScrolling() {
        if (this.virtualScrollInitialized) {
            return;
        }
        if (this.virtualConfig && this.virtualConfig.enabled) {
            this.virtualScrollInitialized = true;
            this.virtualTopHeightElement = document.createElement('div');
            this.virtualTopHeightElement.classList.add('virtual-top-height');
            this.virtualBottomHeightElement = document.createElement('div');
            this.virtualBottomHeightElement.classList.add('virtual-bottom-height');
            this.virtualCenterOutlet = document.createElement('div');
            this.virtualCenterOutlet.classList.add('virtual-center-outlet');
            this.elementRef.nativeElement.appendChild(this.virtualTopHeightElement);
            this.elementRef.nativeElement.appendChild(this.virtualCenterOutlet);
            this.elementRef.nativeElement.appendChild(this.virtualBottomHeightElement);
            // businessHeight
            this.h1 = this.virtualTopHeightElement.getBoundingClientRect()?.top ?? 0;
        }
    }

    changeVirtualHeight(topHeight: number, bottomHeight: number) {
        if (!this.virtualScrollInitialized) {
            return;
        }
        this.virtualTopHeightElement.style.height = `${topHeight}px`;
        this.virtualBottomHeightElement.style.height = `${bottomHeight}px`;
    }

    private refreshVirtualView() {
        const children = (this.editor.children || []) as Element[];
        if (!children.length || !this.shouldUseVirtual()) {
            return {
                renderedChildren: children,
                visibleIndexes: new Set<number>(),
                top: 0,
                bottom: 0,
                heights: []
            };
        }
        const scrollTop = this.virtualConfig.scrollTop;
        const viewportHeight = this.virtualConfig.viewportHeight ?? 0;
        if (!viewportHeight) {
            return {
                renderedChildren: [],
                visibleIndexes: new Set<number>(),
                top: 0,
                bottom: 0,
                heights: []
            };
        }
        const elementLength = children.length;
        const adjustedScrollTop = Math.max(0, scrollTop - this.h1);
        const viewBottom = scrollTop + viewportHeight;
        let accumulatedOffset = 0;
        let visibleStartIndex = -1;
        const visible: Element[] = [];
        const visibleIndexes: number[] = [];

        for (let i = 0; i < elementLength && accumulatedOffset < viewBottom; i++) {
            const currentHeight = this.getBlockHeight(i);
            const nextOffset = accumulatedOffset + currentHeight;
            // 可视区域有交集，加入渲染
            if (nextOffset > adjustedScrollTop && accumulatedOffset < viewBottom) {
                if (visibleStartIndex === -1) visibleStartIndex = i; // 第一个相交起始位置
                visible.push(children[i]);
                visibleIndexes.push(i);
            }
            accumulatedOffset = nextOffset;
        }

        const visibleEndIndex = visibleStartIndex === -1 ? elementLength - 1 : visibleIndexes.length - 1;
        const heights = children.map((_, idx) => this.getBlockHeight(idx));
        const accumulatedHeights = this.buildAccumulatedHeight(heights);
        const top = visibleStartIndex === -1 ? 0 : accumulatedHeights[visibleStartIndex];
        const bottom = accumulatedHeights[children.length] - accumulatedHeights[visibleEndIndex];

        return {
            renderedChildren: visible.length ? visible : children,
            visibleIndexes: new Set(visibleIndexes),
            top,
            bottom,
            heights
        };
    }

    private applyVirtualView(virtualView: VirtualViewResult) {
        this.renderedChildren = virtualView.renderedChildren;
        this.changeVirtualHeight(virtualView.top, virtualView.bottom);
        this.virtualVisibleIndexes = virtualView.visibleIndexes;
    }

    private diffVirtualView(virtualView: VirtualViewResult, stage: 'first' | 'second' = 'first') {
        if (!this.renderedChildren.length) {
            return {
                isDiff: true,
                diffTopRenderedIndexes: [],
                diffBottomRenderedIndexes: []
            };
        }
        const oldVisibleIndexes = [...this.virtualVisibleIndexes];
        const newVisibleIndexes = [...virtualView.visibleIndexes];
        const firstNewIndex = newVisibleIndexes[0];
        const lastNewIndex = newVisibleIndexes[newVisibleIndexes.length - 1];
        const firstOldIndex = oldVisibleIndexes[0];
        const lastOldIndex = oldVisibleIndexes[oldVisibleIndexes.length - 1];
        if (firstNewIndex !== firstOldIndex || lastNewIndex !== lastOldIndex) {
            const diffTopRenderedIndexes = [];
            const diffBottomRenderedIndexes = [];
            const isMissingTop = firstNewIndex !== firstOldIndex && firstNewIndex > firstOldIndex;
            const isAddedTop = firstNewIndex !== firstOldIndex && firstNewIndex < firstOldIndex;
            const isMissingBottom = lastNewIndex !== lastOldIndex && lastOldIndex > lastNewIndex;
            const isAddedBottom = lastNewIndex !== lastOldIndex && lastOldIndex < lastNewIndex;
            if (isMissingTop || isAddedBottom) {
                // 向下
                for (let index = 0; index < oldVisibleIndexes.length; index++) {
                    const element = oldVisibleIndexes[index];
                    if (!newVisibleIndexes.includes(element)) {
                        diffTopRenderedIndexes.push(element);
                    } else {
                        break;
                    }
                }
                for (let index = newVisibleIndexes.length - 1; index >= 0; index--) {
                    const element = newVisibleIndexes[index];
                    if (!oldVisibleIndexes.includes(element)) {
                        diffBottomRenderedIndexes.push(element);
                    } else {
                        break;
                    }
                }
            } else if (isAddedTop || isMissingBottom) {
                // 向上
                for (let index = 0; index < newVisibleIndexes.length; index++) {
                    const element = newVisibleIndexes[index];
                    if (!oldVisibleIndexes.includes(element)) {
                        diffTopRenderedIndexes.push(element);
                    } else {
                        break;
                    }
                }
                for (let index = oldVisibleIndexes.length - 1; index >= 0; index--) {
                    const element = oldVisibleIndexes[index];
                    if (!newVisibleIndexes.includes(element)) {
                        diffBottomRenderedIndexes.push(element);
                    } else {
                        break;
                    }
                }
            }
            if (isDebug) {
                console.log(`====== diffVirtualView stage: ${stage} ======`);
                console.log('oldVisibleIndexes:', oldVisibleIndexes);
                console.log('newVisibleIndexes:', newVisibleIndexes);
                console.log(
                    'diffTopRenderedIndexes:',
                    isMissingTop ? '-' : isAddedTop ? '+' : '-',
                    diffTopRenderedIndexes,
                    diffTopRenderedIndexes.map(index => this.getBlockHeight(index, 0))
                );
                console.log(
                    'diffBottomRenderedIndexes:',
                    isAddedBottom ? '+' : isMissingBottom ? '-' : '+',
                    diffBottomRenderedIndexes,
                    diffBottomRenderedIndexes.map(index => this.getBlockHeight(index, 0))
                );
                const needTop = virtualView.heights.slice(0, newVisibleIndexes[0]).reduce((acc, height) => acc + height, 0);
                const needBottom = virtualView.heights
                    .slice(newVisibleIndexes[newVisibleIndexes.length - 1] + 1)
                    .reduce((acc, height) => acc + height, 0);
                console.log('newTopHeight:', needTop, 'prevTopHeight:', parseFloat(this.virtualTopHeightElement.style.height));
                console.log('newBottomHeight:', needBottom, 'prevBottomHeight:', parseFloat(this.virtualBottomHeightElement.style.height));
                console.warn('=========== Dividing line ===========');
            }
            return {
                isDiff: true,
                isMissingTop,
                isAddedTop,
                isMissingBottom,
                isAddedBottom,
                diffTopRenderedIndexes,
                diffBottomRenderedIndexes
            };
        }
        return {
            isDiff: false,
            diffTopRenderedIndexes: [],
            diffBottomRenderedIndexes: []
        };
    }

    private getBlockHeight(index: number, defaultHeight: number = VIRTUAL_SCROLL_DEFAULT_BLOCK_HEIGHT) {
        const node = this.editor.children[index];
        if (!node) {
            return defaultHeight;
        }
        const key = AngularEditor.findKey(this.editor, node);
        return this.measuredHeights.get(key.id) ?? defaultHeight;
    }

    private buildAccumulatedHeight(heights: number[]) {
        const accumulatedHeights = new Array(heights.length + 1).fill(0);
        for (let i = 0; i < heights.length; i++) {
            // 存储前 i 个的累计高度
            accumulatedHeights[i + 1] = accumulatedHeights[i] + heights[i];
        }
        return accumulatedHeights;
    }

    private getBufferBelowHeight(viewportHeight: number, visibleStart: number, bufferCount: number) {
        let blockHeight = 0;
        let start = visibleStart;
        // 循环累计高度超出视图高度代表找到向下缓冲区的起始位置
        while (blockHeight < viewportHeight) {
            blockHeight += this.getBlockHeight(start);
            start++;
        }
        let bufferHeight = 0;
        for (let i = start; i < start + bufferCount; i++) {
            bufferHeight += this.getBlockHeight(i);
        }
        return bufferHeight;
    }

    private scheduleMeasureVisibleHeights() {
        if (!this.shouldUseVirtual()) {
            return;
        }
        this.measureVisibleHeightsAnimId && cancelAnimationFrame(this.measureVisibleHeightsAnimId);
        this.measureVisibleHeightsAnimId = requestAnimationFrame(() => {
            this.measureVisibleHeights();
        });
    }

    private measureVisibleHeights() {
        const children = (this.editor.children || []) as Element[];
        this.virtualVisibleIndexes.forEach(index => {
            const node = children[index];
            if (!node) {
                return;
            }
            const key = AngularEditor.findKey(this.editor, node);
            // 跳过已测过的块
            if (this.measuredHeights.has(key.id)) {
                return;
            }
            const view = ELEMENT_TO_COMPONENT.get(node);
            if (!view) {
                return;
            }
            const ret = (view as BaseElementComponent | BaseElementFlavour).getRealHeight();
            if (ret instanceof Promise) {
                ret.then(height => {
                    this.measuredHeights.set(key.id, height);
                });
            } else {
                this.measuredHeights.set(key.id, ret);
            }
        });
    }

    private remeasureHeightByIndics(indics: number[]): boolean {
        const children = (this.editor.children || []) as Element[];
        let isHeightChanged = false;
        indics.forEach(index => {
            const node = children[index];
            if (!node) {
                return;
            }
            const key = AngularEditor.findKey(this.editor, node);
            const view = ELEMENT_TO_COMPONENT.get(node);
            if (!view) {
                return;
            }
            const prevHeight = this.measuredHeights.get(key.id);
            const ret = (view as BaseElementComponent | BaseElementFlavour).getRealHeight();
            if (ret instanceof Promise) {
                ret.then(height => {
                    if (height !== prevHeight) {
                        this.measuredHeights.set(key.id, height);
                        isHeightChanged = true;
                        if (isDebug) {
                            console.log(`remeasureHeightByIndics, index: ${index} prevHeight: ${prevHeight} newHeight: ${height}`);
                        }
                    }
                });
            } else {
                if (ret !== prevHeight) {
                    this.measuredHeights.set(key.id, ret);
                    isHeightChanged = true;
                    if (isDebug) {
                        console.log(`remeasureHeightByIndics, index: ${index} prevHeight: ${prevHeight} newHeight: ${ret}`);
                    }
                }
            }
        });
        return isHeightChanged;
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

    private toSlateSelection() {
        if ((!this.isComposing || IS_ANDROID) && !this.isUpdatingSelection && !this.isDraggingInternally) {
            try {
                const root = AngularEditor.findDocumentOrShadowRoot(this.editor);
                const { activeElement } = root;
                const el = AngularEditor.toDOMNode(this.editor, this.editor);
                const domSelection = (root as Document).getSelection();

                if (activeElement === el) {
                    this.latestElement = activeElement;
                    IS_FOCUSED.set(this.editor, true);
                } else {
                    IS_FOCUSED.delete(this.editor);
                }

                if (!domSelection) {
                    return Transforms.deselect(this.editor);
                }

                const editorElement = EDITOR_TO_ELEMENT.get(this.editor);
                const hasDomSelectionInEditor =
                    editorElement.contains(domSelection.anchorNode) && editorElement.contains(domSelection.focusNode);
                if (!hasDomSelectionInEditor) {
                    Transforms.deselect(this.editor);
                    return;
                }

                // try to get the selection directly, because some terrible case can be normalize for normalizeDOMPoint
                // for example, double-click the last cell of the table to select a non-editable DOM
                const range = AngularEditor.toSlateRange(this.editor, domSelection, { exactMatch: false, suppressThrow: true });
                if (range) {
                    if (this.editor.selection && Range.equals(range, this.editor.selection) && !hasStringTarget(domSelection)) {
                        if (!isTargetInsideVoid(this.editor, activeElement)) {
                            // force adjust DOMSelection
                            this.toNativeSelection();
                        }
                    } else {
                        Transforms.select(this.editor, range);
                    }
                }
            } catch (error) {
                this.editor.onError({
                    code: SlateErrorCode.ToSlateSelectionError,
                    nativeError: error
                });
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
        const root = AngularEditor.findDocumentOrShadowRoot(this.editor);
        const { activeElement } = root;
        const { selection } = editor;
        const { inputType: type } = event;
        const data = event.dataTransfer || event.data || undefined;
        if (IS_ANDROID) {
            let targetRange: Range | null = null;
            let [nativeTargetRange] = event.getTargetRanges();
            if (nativeTargetRange) {
                targetRange = AngularEditor.toSlateRange(editor, nativeTargetRange, { exactMatch: false, suppressThrow: false });
            }
            // COMPAT: SelectionChange event is fired after the action is performed, so we
            // have to manually get the selection here to ensure it's up-to-date.
            const window = AngularEditor.getWindow(editor);
            const domSelection = window.getSelection();
            if (!targetRange && domSelection) {
                targetRange = AngularEditor.toSlateRange(editor, domSelection, { exactMatch: false, suppressThrow: false });
            }
            targetRange = targetRange ?? editor.selection;
            if (type === 'insertCompositionText') {
                if (data && data.toString().includes('\n')) {
                    restoreDom(editor, () => {
                        Editor.insertBreak(editor);
                    });
                } else {
                    if (targetRange) {
                        if (data) {
                            restoreDom(editor, () => {
                                Transforms.insertText(editor, data.toString(), { at: targetRange });
                            });
                        } else {
                            restoreDom(editor, () => {
                                Transforms.delete(editor, { at: targetRange });
                            });
                        }
                    }
                }
                return;
            }
            if (type === 'deleteContentBackward') {
                // gboard can not prevent default action, so must use restoreDom,
                // sougou Keyboard can prevent default action（only in Chinese input mode）.
                // In order to avoid weird action in Sougou Keyboard, use resotreDom only range's isCollapsed is false (recognize gboard)
                if (!Range.isCollapsed(targetRange)) {
                    restoreDom(editor, () => {
                        Transforms.delete(editor, { at: targetRange });
                    });
                    return;
                }
            }
            if (type === 'insertText') {
                restoreDom(editor, () => {
                    if (typeof data === 'string') {
                        Editor.insertText(editor, data);
                    }
                });
                return;
            }
        }
        if (
            !this.readonly &&
            AngularEditor.hasEditableTarget(editor, event.target) &&
            !isTargetInsideVoid(editor, activeElement) &&
            !this.isDOMEventHandled(event, this.beforeInput)
        ) {
            try {
                event.preventDefault();

                // COMPAT: If the selection is expanded, even if the command seems like
                // a delete forward/backward command it should delete the selection.
                if (selection && Range.isExpanded(selection) && type.startsWith('delete')) {
                    const direction = type.endsWith('Backward') ? 'backward' : 'forward';
                    Editor.deleteFragment(editor, { direction });
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
                        preventInsertFromComposition(event, this.editor);
                    }
                    case 'insertFromDrop':
                    case 'insertFromPaste':
                    case 'insertFromYank':
                    case 'insertReplacementText':
                    case 'insertText': {
                        // use a weak comparison instead of 'instanceof' to allow
                        // programmatic access of paste events coming from external windows
                        // like cypress where cy.window does not work realibly
                        if (data?.constructor.name === 'DataTransfer') {
                            AngularEditor.insertData(editor, data as DataTransfer);
                        } else if (typeof data === 'string') {
                            Editor.insertText(editor, data);
                        }
                        break;
                    }
                }
            } catch (error) {
                this.editor.onError({
                    code: SlateErrorCode.OnDOMBeforeInputError,
                    nativeError: error
                });
            }
        }
    }

    private onDOMBlur(event: FocusEvent) {
        if (
            this.readonly ||
            this.isUpdatingSelection ||
            !AngularEditor.hasEditableTarget(this.editor, event.target) ||
            this.isDOMEventHandled(event, this.blur)
        ) {
            return;
        }

        const window = AngularEditor.getWindow(this.editor);

        // COMPAT: If the current `activeElement` is still the previous
        // one, this is due to the window being blurred when the tab
        // itself becomes unfocused, so we want to abort early to allow to
        // editor to stay focused when the tab becomes focused again.
        const root = AngularEditor.findDocumentOrShadowRoot(this.editor);
        if (this.latestElement === root.activeElement) {
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

        IS_FOCUSED.delete(this.editor);
    }

    private onDOMClick(event: MouseEvent) {
        if (
            !this.readonly &&
            AngularEditor.hasTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.click) &&
            isDOMNode(event.target)
        ) {
            const node = AngularEditor.toSlateNode(this.editor, event.target);
            const path = AngularEditor.findPath(this.editor, node);
            const start = Editor.start(this.editor, path);
            const end = Editor.end(this.editor, path);

            const startVoid = Editor.void(this.editor, { at: start });
            const endVoid = Editor.void(this.editor, { at: end });

            if (event.detail === TRIPLE_CLICK && path.length >= 1) {
                let blockPath = path;
                if (!(Element.isElement(node) && Editor.isBlock(this.editor, node))) {
                    const block = Editor.above(this.editor, {
                        match: n => Element.isElement(n) && Editor.isBlock(this.editor, n),
                        at: path
                    });

                    blockPath = block?.[1] ?? path.slice(0, 1);
                }

                const range = Editor.range(this.editor, blockPath);
                Transforms.select(this.editor, range);
                return;
            }

            if (
                startVoid &&
                endVoid &&
                Path.equals(startVoid[1], endVoid[1]) &&
                !(AngularEditor.isBlockCardLeftCursor(this.editor) || AngularEditor.isBlockCardRightCursor(this.editor))
            ) {
                const range = Editor.range(this.editor, start);
                Transforms.select(this.editor, range);
            }
        }
    }

    private onDOMCompositionStart(event: CompositionEvent) {
        const { selection } = this.editor;
        if (selection) {
            // solve the problem of cross node Chinese input
            if (Range.isExpanded(selection)) {
                Editor.deleteFragment(this.editor);
                this.forceRender();
            }
        }
        if (AngularEditor.hasEditableTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.compositionStart)) {
            this.isComposing = true;
        }
        this.render();
    }

    private onDOMCompositionUpdate(event: CompositionEvent) {
        this.isDOMEventHandled(event, this.compositionUpdate);
    }

    private onDOMCompositionEnd(event: CompositionEvent) {
        if (!event.data && !Range.isCollapsed(this.editor.selection)) {
            Transforms.delete(this.editor);
        }
        if (AngularEditor.hasEditableTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.compositionEnd)) {
            // COMPAT: In Chrome/Firefox, `beforeinput` events for compositions
            // aren't correct and never fire the "insertFromComposition"
            // type that we need. So instead, insert whenever a composition
            // ends since it will already have been committed to the DOM.
            if (this.isComposing === true && !IS_SAFARI && !IS_ANDROID && event.data) {
                preventInsertFromComposition(event, this.editor);
                Editor.insertText(this.editor, event.data);
            }

            // COMPAT: In Firefox 87.0 CompositionEnd fire twice
            // so we need avoid repeat isnertText by isComposing === true,
            this.isComposing = false;
        }
        this.render();
    }

    private onDOMCopy(event: ClipboardEvent) {
        const window = AngularEditor.getWindow(this.editor);
        const isOutsideSlate = !hasStringTarget(window.getSelection()) && isTargetInsideVoid(this.editor, event.target);
        if (!isOutsideSlate && AngularEditor.hasTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.copy)) {
            event.preventDefault();
            AngularEditor.setFragmentData(this.editor, event.clipboardData, 'copy');
        }
    }

    private onDOMCut(event: ClipboardEvent) {
        if (!this.readonly && AngularEditor.hasEditableTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.cut)) {
            event.preventDefault();
            AngularEditor.setFragmentData(this.editor, event.clipboardData, 'cut');
            const { selection } = this.editor;

            if (selection) {
                AngularEditor.deleteCutData(this.editor);
            }
        }
    }

    private onDOMDragOver(event: DragEvent) {
        if (AngularEditor.hasTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.dragOver)) {
            // Only when the target is void, call `preventDefault` to signal
            // that drops are allowed. Editable content is droppable by
            // default, and calling `preventDefault` hides the cursor.
            const node = AngularEditor.toSlateNode(this.editor, event.target);

            if (Element.isElement(node) && Editor.isVoid(this.editor, node)) {
                event.preventDefault();
            }
        }
    }

    private onDOMDragStart(event: DragEvent) {
        if (!this.readonly && AngularEditor.hasTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.dragStart)) {
            const node = AngularEditor.toSlateNode(this.editor, event.target);
            const path = AngularEditor.findPath(this.editor, node);
            const voidMatch =
                Element.isElement(node) && (Editor.isVoid(this.editor, node) || Editor.void(this.editor, { at: path, voids: true }));

            // If starting a drag on a void node, make sure it is selected
            // so that it shows up in the selection's fragment.
            if (voidMatch) {
                const range = Editor.range(this.editor, path);
                Transforms.select(this.editor, range);
            }

            this.isDraggingInternally = true;

            AngularEditor.setFragmentData(this.editor, event.dataTransfer, 'drag');
        }
    }

    private onDOMDrop(event: DragEvent) {
        const editor = this.editor;
        if (!this.readonly && AngularEditor.hasTarget(this.editor, event.target) && !this.isDOMEventHandled(event, this.drop)) {
            event.preventDefault();
            // Keep a reference to the dragged range before updating selection
            const draggedRange = editor.selection;

            // Find the range where the drop happened
            const range = AngularEditor.findEventRange(editor, event);
            const data = event.dataTransfer;

            Transforms.select(editor, range);

            if (this.isDraggingInternally) {
                if (draggedRange) {
                    Transforms.delete(editor, {
                        at: draggedRange
                    });
                }

                this.isDraggingInternally = false;
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
        if (
            !this.readonly &&
            this.isDraggingInternally &&
            AngularEditor.hasTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.dragEnd)
        ) {
            this.isDraggingInternally = false;
        }
    }

    private onDOMFocus(event: Event) {
        if (
            !this.readonly &&
            !this.isUpdatingSelection &&
            AngularEditor.hasEditableTarget(this.editor, event.target) &&
            !this.isDOMEventHandled(event, this.focus)
        ) {
            const el = AngularEditor.toDOMNode(this.editor, this.editor);
            const root = AngularEditor.findDocumentOrShadowRoot(this.editor);
            this.latestElement = root.activeElement;

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
        const root = AngularEditor.findDocumentOrShadowRoot(this.editor);
        const { activeElement } = root;
        if (
            !this.readonly &&
            AngularEditor.hasEditableTarget(editor, event.target) &&
            !isTargetInsideVoid(editor, activeElement) && // stop fire keydown handle when focus void node
            !this.isComposing &&
            !this.isDOMEventHandled(event, this.keydown)
        ) {
            const nativeEvent = event;
            const { selection } = editor;

            const element = editor.children[selection !== null ? selection.focus.path[0] : 0];
            const isRTL = direction(Node.string(element)) === 'rtl';

            try {
                // COMPAT: Since we prevent the default behavior on
                // `beforeinput` events, the browser doesn't think there's ever
                // any history stack to undo or redo, so we have to manage these
                // hotkeys ourselves. (2019/11/06)
                if (Hotkeys.isRedo(nativeEvent)) {
                    event.preventDefault();

                    if (HistoryEditor.isHistoryEditor(editor)) {
                        editor.redo();
                    }

                    return;
                }

                if (Hotkeys.isUndo(nativeEvent)) {
                    event.preventDefault();

                    if (HistoryEditor.isHistoryEditor(editor)) {
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
                        Transforms.move(editor, { reverse: !isRTL });
                    } else {
                        Transforms.collapse(editor, { edge: 'start' });
                    }

                    return;
                }

                if (Hotkeys.isMoveForward(nativeEvent)) {
                    event.preventDefault();
                    if (selection && Range.isCollapsed(selection)) {
                        Transforms.move(editor, { reverse: isRTL });
                    } else {
                        Transforms.collapse(editor, { edge: 'end' });
                    }

                    return;
                }

                if (Hotkeys.isMoveWordBackward(nativeEvent)) {
                    event.preventDefault();

                    if (selection && Range.isExpanded(selection)) {
                        Transforms.collapse(editor, { edge: 'focus' });
                    }

                    Transforms.move(editor, { unit: 'word', reverse: !isRTL });
                    return;
                }

                if (Hotkeys.isMoveWordForward(nativeEvent)) {
                    event.preventDefault();

                    if (selection && Range.isExpanded(selection)) {
                        Transforms.collapse(editor, { edge: 'focus' });
                    }

                    Transforms.move(editor, { unit: 'word', reverse: isRTL });
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
                            Editor.deleteFragment(editor, {
                                direction: 'backward'
                            });
                        } else {
                            Editor.deleteBackward(editor);
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteForward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                                direction: 'forward'
                            });
                        } else {
                            Editor.deleteForward(editor);
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                                direction: 'backward'
                            });
                        } else {
                            Editor.deleteBackward(editor, { unit: 'line' });
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteLineForward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                                direction: 'forward'
                            });
                        } else {
                            Editor.deleteForward(editor, { unit: 'line' });
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                                direction: 'backward'
                            });
                        } else {
                            Editor.deleteBackward(editor, { unit: 'word' });
                        }

                        return;
                    }

                    if (Hotkeys.isDeleteWordForward(nativeEvent)) {
                        event.preventDefault();

                        if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                                direction: 'forward'
                            });
                        } else {
                            Editor.deleteForward(editor, { unit: 'word' });
                        }

                        return;
                    }
                } else {
                    if (IS_CHROME || IS_SAFARI) {
                        // COMPAT: Chrome and Safari support `beforeinput` event but do not fire
                        // an event when deleting backwards in a selected void inline node
                        if (
                            selection &&
                            (Hotkeys.isDeleteBackward(nativeEvent) || Hotkeys.isDeleteForward(nativeEvent)) &&
                            Range.isCollapsed(selection)
                        ) {
                            const currentNode = Node.parent(editor, selection.anchor.path);
                            if (
                                Element.isElement(currentNode) &&
                                Editor.isVoid(editor, currentNode) &&
                                (Editor.isInline(editor, currentNode) || Editor.isBlock(editor, currentNode))
                            ) {
                                event.preventDefault();
                                Editor.deleteBackward(editor, {
                                    unit: 'block'
                                });
                                return;
                            }
                        }
                    }
                }
            } catch (error) {
                this.editor.onError({
                    code: SlateErrorCode.OnDOMKeydownError,
                    nativeError: error
                });
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
            !this.isDOMEventHandled(event, this.paste) &&
            (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event) || forceOnDOMPaste) &&
            !this.readonly &&
            AngularEditor.hasEditableTarget(this.editor, event.target)
        ) {
            event.preventDefault();
            AngularEditor.insertData(this.editor, event.clipboardData);
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
            AngularEditor.hasEditableTarget(this.editor, event.nativeEvent.target)
        ) {
            event.nativeEvent.preventDefault();
            try {
                const text = event.data;
                if (!Range.isCollapsed(this.editor.selection)) {
                    Editor.deleteFragment(this.editor);
                }
                // just handle Non-IME input
                if (!this.isComposing) {
                    Editor.insertText(this.editor, text);
                }
            } catch (error) {
                this.editor.onError({
                    code: SlateErrorCode.ToNativeSelectionError,
                    nativeError: error
                });
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
        NODE_TO_ELEMENT.delete(this.editor);
        this.manualListeners.forEach(manualListener => {
            manualListener();
        });
        this.destroy$.complete();
        EDITOR_TO_ON_CHANGE.delete(this.editor);
    }
}

export const defaultScrollSelectionIntoView = (editor: AngularEditor, domRange: DOMRange) => {
    // This was affecting the selection of multiple blocks and dragging behavior,
    // so enabled only if the selection has been collapsed.
    if (domRange.getBoundingClientRect && (!editor.selection || (editor.selection && Range.isCollapsed(editor.selection)))) {
        const leafEl = domRange.startContainer.parentElement!;

        // COMPAT: In Chrome, domRange.getBoundingClientRect() can return zero dimensions for valid ranges (e.g. line breaks).
        // When this happens, do not scroll like most editors do.
        const domRect = domRange.getBoundingClientRect();
        const isZeroDimensionRect = domRect.width === 0 && domRect.height === 0 && domRect.x === 0 && domRect.y === 0;

        if (isZeroDimensionRect) {
            const leafRect = leafEl.getBoundingClientRect();
            const leafHasDimensions = leafRect.width > 0 || leafRect.height > 0;

            if (leafHasDimensions) {
                return;
            }
        }

        leafEl.getBoundingClientRect = domRange.getBoundingClientRect.bind(domRange);
        scrollIntoView(leafEl, {
            scrollMode: 'if-needed'
        });
        delete leafEl.getBoundingClientRect;
    }
};

/**
 * Check if the target is inside void and in the editor.
 */

const isTargetInsideVoid = (editor: AngularEditor, target: EventTarget | null): boolean => {
    let slateNode: Node | null = null;
    try {
        slateNode = AngularEditor.hasTarget(editor, target) && AngularEditor.toSlateNode(editor, target);
    } catch (error) {}
    return slateNode && Element.isElement(slateNode) && Editor.isVoid(editor, slateNode);
};

const hasStringTarget = (domSelection: DOMSelection) => {
    return (
        (domSelection.anchorNode.parentElement.hasAttribute('data-slate-string') ||
            domSelection.anchorNode.parentElement.hasAttribute('data-slate-zero-width')) &&
        (domSelection.focusNode.parentElement.hasAttribute('data-slate-string') ||
            domSelection.focusNode.parentElement.hasAttribute('data-slate-zero-width'))
    );
};

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
};
