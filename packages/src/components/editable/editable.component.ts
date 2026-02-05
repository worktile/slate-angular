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
import { Text as SlateText, Element, Transforms, Editor, Range, Path, NodeEntry, Node, Selection, Descendant } from 'slate';
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
import { debounceTime, filter, Subject, tap } from 'rxjs';
import { IS_FIREFOX, IS_SAFARI, IS_CHROME, HAS_BEFORE_INPUT_SUPPORT, IS_ANDROID } from '../../utils/environment';
import Hotkeys from '../../utils/hotkeys';
import { BeforeInputEvent, extractBeforeInputEvent } from '../../custom-event/BeforeInputEventPlugin';
import { BEFORE_INPUT_EVENTS } from '../../custom-event/before-input-polyfill';
import { SlateErrorCode } from '../../types/error';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SlateChildrenContext, SlateViewContext } from '../../view/context';
import { ViewType } from '../../types/view';
import { HistoryEditor } from 'slate-history';
import {
    buildHeightsAndAccumulatedHeights,
    EDITOR_TO_VIRTUAL_SCROLL_SELECTION,
    ELEMENT_KEY_TO_HEIGHTS,
    getBusinessTop,
    isDebug,
    isDebugScrollTop,
    isDecoratorRangeListEqual,
    measureHeightByIndics,
    roundTo
} from '../../utils';
import { SlatePlaceholder } from '../../types/feature';
import { restoreDom } from '../../utils/restore-dom';
import { ListRender, updatePreRenderingElementWidth } from '../../view/render/list-render';
import { TRIPLE_CLICK, EDITOR_TO_ON_CHANGE } from 'slate-dom';
import { SlateVirtualScrollConfig, VirtualViewResult } from '../../types';
import { isKeyHotkey } from 'is-hotkey';
import {
    calcBusinessTop,
    calculateAccumulatedTopHeight,
    debugLog,
    EDITOR_TO_IS_FROM_SCROLL_TO,
    EDITOR_TO_ROOT_NODE_WIDTH,
    EDITOR_TO_VIEWPORT_HEIGHT,
    EDITOR_TO_VIRTUAL_SCROLL_CONFIG,
    getCachedHeightByElement,
    getViewportHeight,
    VIRTUAL_BOTTOM_HEIGHT_CLASS_NAME,
    VIRTUAL_CENTER_OUTLET_CLASS_NAME,
    VIRTUAL_TOP_HEIGHT_CLASS_NAME
} from '../../utils/virtual-scroll';

// not correctly clipboardData on beforeinput
const forceOnDOMPaste = IS_SAFARI;

class RemeasureConfig {
    indics: number[];
    tryUpdateViewport: boolean;
}

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
        this.virtualScrollConfig = config;
        EDITOR_TO_VIRTUAL_SCROLL_CONFIG.set(this.editor, config);
        if (isDebugScrollTop) {
            debugLog('log', 'virtualScrollConfig scrollTop:', config.scrollTop);
        }
        if (this.isEnabledVirtualScroll()) {
            this.tryUpdateVirtualViewport();
        }
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

    private virtualScrollConfig: SlateVirtualScrollConfig = {
        enabled: false,
        scrollTop: 0,
        scrollContainer: null
    };

    private inViewportChildren: Element[] = [];
    private inViewportIndics: number[] = [];
    private keyHeightMap = new Map<string, number>();
    private tryUpdateVirtualViewportAnimId: number;
    private editorResizeObserver?: ResizeObserver;
    private editorScrollContainerResizeObserver?: ResizeObserver;

    indicsOfNeedRemeasured$ = new Subject<RemeasureConfig>();

    virtualScrollInitialized = false;

    virtualTopHeightElement: HTMLElement;

    virtualBottomHeightElement: HTMLElement;

    virtualCenterOutlet: HTMLElement;

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
        ELEMENT_KEY_TO_HEIGHTS.set(this.editor, this.keyHeightMap);
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
        this.initializeVirtualScroll();
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
            if (this.isEnabledVirtualScroll()) {
                const previousInViewportChildren = [...this.inViewportChildren];
                const visibleStates = this.editor.getAllVisibleStates();
                const virtualView = this.calculateVirtualViewport(visibleStates);
                this.applyVirtualView(virtualView);
                const childrenForRender = virtualView.inViewportChildren;
                if (isDebug) {
                    debugLog('log', 'writeValue calculate: ', virtualView.inViewportIndics, 'initialized: ', this.listRender.initialized);
                }
                if (!this.listRender.initialized) {
                    this.listRender.initialize(childrenForRender, this.editor, this.context, 0, virtualView.inViewportIndics);
                } else {
                    const { preRenderingCount, childrenWithPreRendering, childrenWithPreRenderingIndics } =
                        this.appendPreRenderingToViewport(visibleStates);
                    this.listRender.update(
                        childrenWithPreRendering,
                        this.editor,
                        this.context,
                        preRenderingCount,
                        childrenWithPreRenderingIndics
                    );
                }
                const remeasureIndics = this.getChangedIndics(previousInViewportChildren);
                if (remeasureIndics.length) {
                    this.indicsOfNeedRemeasured$.next({ indics: remeasureIndics, tryUpdateViewport: true });
                }
            } else {
                if (!this.listRender.initialized) {
                    this.listRender.initialize(this.editor.children, this.editor, this.context);
                } else {
                    this.listRender.update(this.editor.children, this.editor, this.context);
                }
            }
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

    private isEnabledVirtualScroll() {
        return !!(this.virtualScrollConfig && this.virtualScrollConfig.enabled);
    }

    initializeVirtualScroll() {
        if (this.virtualScrollInitialized) {
            return;
        }
        if (this.isEnabledVirtualScroll()) {
            this.virtualScrollInitialized = true;
            this.virtualTopHeightElement = document.createElement('div');
            this.virtualTopHeightElement.classList.add(VIRTUAL_TOP_HEIGHT_CLASS_NAME);
            this.virtualTopHeightElement.contentEditable = 'false';
            this.virtualBottomHeightElement = document.createElement('div');
            this.virtualBottomHeightElement.classList.add(VIRTUAL_BOTTOM_HEIGHT_CLASS_NAME);
            this.virtualBottomHeightElement.contentEditable = 'false';
            this.virtualCenterOutlet = document.createElement('div');
            this.virtualCenterOutlet.classList.add(VIRTUAL_CENTER_OUTLET_CLASS_NAME);
            this.elementRef.nativeElement.appendChild(this.virtualTopHeightElement);
            this.elementRef.nativeElement.appendChild(this.virtualCenterOutlet);
            this.elementRef.nativeElement.appendChild(this.virtualBottomHeightElement);
            let editorResizeObserverRectWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
            EDITOR_TO_ROOT_NODE_WIDTH.set(this.editor, this.virtualTopHeightElement.offsetWidth);
            this.editorResizeObserver = new ResizeObserver(entries => {
                if (entries.length > 0 && entries[0].contentRect.width !== editorResizeObserverRectWidth) {
                    editorResizeObserverRectWidth = entries[0].contentRect.width;
                    this.keyHeightMap.clear();
                    let target = this.virtualTopHeightElement;
                    if (this.inViewportChildren[0]) {
                        const firstElement = this.inViewportChildren[0];
                        const firstDomElement = AngularEditor.toDOMNode(this.editor, firstElement);
                        target = firstDomElement;
                    }
                    EDITOR_TO_ROOT_NODE_WIDTH.set(this.editor, target.offsetWidth);
                    updatePreRenderingElementWidth(this.editor);
                    if (isDebug) {
                        debugLog(
                            'log',
                            'editorResizeObserverRectWidth: ',
                            editorResizeObserverRectWidth,
                            'EDITOR_TO_ROOT_NODE_WIDTH: ',
                            EDITOR_TO_ROOT_NODE_WIDTH.get(this.editor)
                        );
                    }
                }
            });
            this.editorResizeObserver.observe(this.elementRef.nativeElement);
            if (this.virtualScrollConfig.scrollContainer) {
                this.editorScrollContainerResizeObserver = new ResizeObserver(entries => {
                    const height = this.virtualScrollConfig.scrollContainer.getBoundingClientRect().height;
                    EDITOR_TO_VIEWPORT_HEIGHT.set(this.editor, height);
                    if (isDebug) {
                        debugLog('log', 'editorScrollContainerResizeObserver calc viewport height: ', height);
                        this.virtualTopHeightElement.setAttribute('viewport-height', height.toString());
                    }
                });
                this.editorScrollContainerResizeObserver.observe(this.virtualScrollConfig.scrollContainer);
            }

            let pendingRemeasureIndics: number[] = [];
            this.indicsOfNeedRemeasured$
                .pipe(
                    tap((previousValue: RemeasureConfig) => {
                        previousValue.indics.forEach((index: number) => {
                            if (!pendingRemeasureIndics.includes(index)) {
                                pendingRemeasureIndics.push(index);
                            }
                        });
                    }),
                    debounceTime(500),
                    filter(() => pendingRemeasureIndics.length > 0)
                )
                .subscribe((previousValue: RemeasureConfig) => {
                    const changed = measureHeightByIndics(this.editor, pendingRemeasureIndics, true);
                    if (changed) {
                        if (previousValue.tryUpdateViewport) {
                            this.tryUpdateVirtualViewport();
                            if (isDebug) {
                                debugLog(
                                    'log',
                                    'exist pendingRemeasureIndics: ',
                                    pendingRemeasureIndics,
                                    'will try to update virtual viewport'
                                );
                            }
                        }
                    }
                    pendingRemeasureIndics = [];
                });
        }
    }

    getChangedIndics(previousValue: Descendant[]) {
        const remeasureIndics = [];
        this.inViewportChildren.forEach((child, index) => {
            if (previousValue.indexOf(child) === -1) {
                remeasureIndics.push(this.inViewportIndics[index]);
            }
        });
        return remeasureIndics;
    }

    setVirtualSpaceHeight(topHeight: number, bottomHeight?: number) {
        if (!this.virtualScrollInitialized) {
            return;
        }
        this.virtualTopHeightElement.style.height = `${roundTo(topHeight, 1)}px`;
        if (bottomHeight !== undefined) {
            this.virtualBottomHeightElement.style.height = `${roundTo(bottomHeight, 1)}px`;
        }
    }

    getActualVirtualTopHeight() {
        if (!this.virtualScrollInitialized) {
            return 0;
        }
        return parseFloat(this.virtualTopHeightElement.style.height.replace('px', ''));
    }

    appendPreRenderingToViewport(visibleStates: boolean[]) {
        let preRenderingCount = 0;
        const childrenWithPreRendering = [...this.inViewportChildren];
        const childrenWithPreRenderingIndics = [...this.inViewportIndics];
        const firstIndex = this.inViewportIndics[0];
        for (let index = firstIndex - 1; index >= 0; index--) {
            const element = this.editor.children[index] as Element;
            if (visibleStates[index]) {
                childrenWithPreRendering.unshift(element);
                childrenWithPreRenderingIndics.unshift(index);
                preRenderingCount = 1;
                break;
            }
        }
        const lastIndex = this.inViewportIndics[this.inViewportIndics.length - 1];
        for (let index = lastIndex + 1; index < this.editor.children.length; index++) {
            const element = this.editor.children[index] as Element;
            if (visibleStates[index]) {
                childrenWithPreRendering.push(element);
                childrenWithPreRenderingIndics.push(index);
                break;
            }
        }
        return { preRenderingCount, childrenWithPreRendering, childrenWithPreRenderingIndics };
    }

    calculateIndicsStartAndEndBySelection() {
        if (!this.editor.selection || Range.isCollapsed(this.editor.selection)) {
            return;
        }
        const isBackward = Range.isBackward(this.editor.selection);
        const anchorIndex = this.editor.selection.anchor.path[0];
        const focusIndex = this.editor.selection.focus.path[0];
        let minStartIndex = anchorIndex;
        let minEndIndex = focusIndex;
        if (isBackward) {
            minStartIndex = focusIndex;
            minEndIndex = anchorIndex;
        }
        if (minStartIndex < this.inViewportIndics[0]) {
            minStartIndex = this.inViewportIndics[0];
        }
        if (minEndIndex > this.inViewportIndics[this.inViewportIndics.length - 1]) {
            minEndIndex = this.inViewportIndics[this.inViewportIndics.length - 1];
        }
        return { minStartIndex, minEndIndex };
    }

    private tryUpdateVirtualViewport() {
        if (isDebug) {
            debugLog('log', 'tryUpdateVirtualViewport');
        }
        const isFromScrollTo = EDITOR_TO_IS_FROM_SCROLL_TO.get(this.editor);
        if (this.inViewportIndics.length > 0 && !isFromScrollTo) {
            const realTopHeight = this.getActualVirtualTopHeight();
            const visibleStates = this.editor.getAllVisibleStates();
            const accumulateTopHeigh = calculateAccumulatedTopHeight(this.editor, this.inViewportIndics[0], visibleStates);
            if (realTopHeight !== accumulateTopHeigh) {
                if (isDebug) {
                    debugLog('log', 'update top height since dirty state，增加高度: ', accumulateTopHeigh - realTopHeight);
                }
                this.setVirtualSpaceHeight(accumulateTopHeigh);
                return;
            }
        }
        this.tryUpdateVirtualViewportAnimId && cancelAnimationFrame(this.tryUpdateVirtualViewportAnimId);
        this.tryUpdateVirtualViewportAnimId = requestAnimationFrame(() => {
            if (isDebug) {
                debugLog('log', 'tryUpdateVirtualViewport Anim start');
            }
            const visibleStates = this.editor.getAllVisibleStates();
            let virtualView = this.calculateVirtualViewport(visibleStates);
            let diff = this.diffVirtualViewport(virtualView);
            if (diff.isDifferent && diff.needRemoveOnTop && !isFromScrollTo) {
                const remeasureIndics = diff.changedIndexesOfTop;
                const changed = measureHeightByIndics(this.editor, remeasureIndics);
                if (changed) {
                    virtualView = this.calculateVirtualViewport(visibleStates);
                    diff = this.diffVirtualViewport(virtualView, 'second');
                }
            }
            if (diff.isDifferent) {
                this.applyVirtualView(virtualView);
                if (this.listRender.initialized) {
                    const { preRenderingCount, childrenWithPreRendering, childrenWithPreRenderingIndics } =
                        this.appendPreRenderingToViewport(visibleStates);
                    this.listRender.update(
                        childrenWithPreRendering,
                        this.editor,
                        this.context,
                        preRenderingCount,
                        childrenWithPreRenderingIndics
                    );
                    if (diff.needAddOnTop && !isFromScrollTo) {
                        const remeasureAddedIndics = diff.changedIndexesOfTop;
                        if (isDebug) {
                            debugLog('log', 'needAddOnTop to remeasure heights: ', remeasureAddedIndics);
                        }
                        const startIndexBeforeAdd = diff.changedIndexesOfTop[diff.changedIndexesOfTop.length - 1] + 1;
                        const topHeightBeforeAdd = virtualView.accumulatedHeights[startIndexBeforeAdd];
                        const changed = measureHeightByIndics(this.editor, remeasureAddedIndics);
                        if (changed) {
                            const newHeights = buildHeightsAndAccumulatedHeights(this.editor, visibleStates);
                            const actualTopHeightAfterAdd = newHeights.accumulatedHeights[startIndexBeforeAdd];
                            const newTopHeight = virtualView.top - (actualTopHeightAfterAdd - topHeightBeforeAdd);
                            if (topHeightBeforeAdd !== actualTopHeightAfterAdd) {
                                this.setVirtualSpaceHeight(newTopHeight);
                                if (isDebug) {
                                    debugLog(
                                        'log',
                                        `update top height since will add element in top，减去高度: ${topHeightBeforeAdd - actualTopHeightAfterAdd}`
                                    );
                                }
                            }
                        }
                    }
                    if (this.editor.selection) {
                        this.toNativeSelection(false);
                    }
                }
            }
            if (isDebug) {
                debugLog('log', 'tryUpdateVirtualViewport Anim end');
            }
        });
    }

    private calculateVirtualViewport(visibleStates: boolean[]) {
        const children = (this.editor.children || []) as Element[];
        if (!children.length || !this.isEnabledVirtualScroll()) {
            return {
                inViewportChildren: children,
                inViewportIndics: [],
                top: 0,
                bottom: 0,
                heights: []
            };
        }
        const scrollTop = this.virtualScrollConfig.scrollTop;
        let viewportHeight = getViewportHeight(this.editor);
        const elementLength = children.length;
        let businessTop = getBusinessTop(this.editor);
        if (businessTop === 0 && this.virtualScrollConfig.scrollTop > 0) {
            businessTop = calcBusinessTop(this.editor);
        }
        const { heights, accumulatedHeights } = buildHeightsAndAccumulatedHeights(this.editor, visibleStates);
        const totalHeight = accumulatedHeights[elementLength] + businessTop;
        let startPosition = Math.max(scrollTop - businessTop, 0);
        let endPosition = startPosition + viewportHeight;
        if (scrollTop < businessTop) {
            endPosition = startPosition + viewportHeight - (businessTop - scrollTop);
        }
        let accumulatedOffset = 0;
        const inViewportChildren: Element[] = [];
        const inViewportIndics: number[] = [];
        const indicsBySelection = this.calculateIndicsStartAndEndBySelection();
        if (isDebug) {
            debugLog('log', 'indicsBySelection: ', indicsBySelection);
        }
        for (let i = 0; i < elementLength; i++) {
            const currentHeight = heights[i];
            const nextOffset = accumulatedOffset + currentHeight;
            const isVisible = visibleStates[i];
            if (!isVisible) {
                accumulatedOffset = nextOffset;
                continue;
            }
            if (
                (indicsBySelection && i > indicsBySelection.minEndIndex && accumulatedOffset >= endPosition) ||
                (!indicsBySelection && accumulatedOffset >= endPosition)
            ) {
                break;
            }
            if (
                (indicsBySelection && i < indicsBySelection.minStartIndex && nextOffset <= startPosition) ||
                (!indicsBySelection && nextOffset <= startPosition)
            ) {
                accumulatedOffset = nextOffset;
                continue;
            }
            inViewportChildren.push(children[i]);
            inViewportIndics.push(i);
            accumulatedOffset = nextOffset;
        }
        if (inViewportIndics.length === 0) {
            inViewportChildren.push(...children);
            inViewportIndics.push(...Array.from({ length: elementLength }, (_, i) => i));
        }
        const inViewportStartIndex = inViewportIndics[0];
        const inViewportEndIndex = inViewportIndics[inViewportIndics.length - 1];
        const top = accumulatedHeights[inViewportStartIndex];
        // todo: toggleHeight: toggleHeight 逻辑需要优化
        const bottom = totalHeight - accumulatedHeights[inViewportEndIndex + 1];
        return {
            inViewportChildren,
            inViewportIndics,
            top,
            bottom,
            heights,
            accumulatedHeights
        };
    }

    private applyVirtualView(virtualView: VirtualViewResult) {
        this.inViewportChildren = virtualView.inViewportChildren;
        this.setVirtualSpaceHeight(virtualView.top, virtualView.bottom);
        this.inViewportIndics = virtualView.inViewportIndics;
    }

    private diffVirtualViewport(virtualView: VirtualViewResult, stage: 'first' | 'second' | 'onChange' = 'first') {
        if (!this.inViewportChildren.length) {
            if (isDebug) {
                debugLog('log', 'diffVirtualViewport', stage, 'empty inViewportChildren', virtualView.inViewportIndics);
            }
            return {
                isDifferent: true,
                changedIndexesOfTop: [],
                changedIndexesOfBottom: []
            };
        }
        const oldIndexesInViewport = [...this.inViewportIndics];
        const newIndexesInViewport = [...virtualView.inViewportIndics];
        const firstNewIndex = newIndexesInViewport[0];
        const lastNewIndex = newIndexesInViewport[newIndexesInViewport.length - 1];
        const firstOldIndex = oldIndexesInViewport[0];
        const lastOldIndex = oldIndexesInViewport[oldIndexesInViewport.length - 1];
        const isSameViewport =
            oldIndexesInViewport.length === newIndexesInViewport.length &&
            oldIndexesInViewport.every((index, i) => index === newIndexesInViewport[i]);
        if (firstNewIndex === firstOldIndex && lastNewIndex === lastOldIndex) {
            return {
                isDifferent: !isSameViewport,
                changedIndexesOfTop: [],
                changedIndexesOfBottom: []
            };
        }
        if (firstNewIndex !== firstOldIndex || lastNewIndex !== lastOldIndex) {
            const changedIndexesOfTop = [];
            const changedIndexesOfBottom = [];
            const needRemoveOnTop = firstNewIndex !== firstOldIndex && firstNewIndex > firstOldIndex;
            const needAddOnTop = firstNewIndex !== firstOldIndex && firstNewIndex < firstOldIndex;
            const needRemoveOnBottom = lastNewIndex !== lastOldIndex && lastOldIndex > lastNewIndex;
            const needAddOnBottom = lastNewIndex !== lastOldIndex && lastOldIndex < lastNewIndex;
            if (needRemoveOnTop || needAddOnBottom) {
                // 向下
                for (let index = 0; index < oldIndexesInViewport.length; index++) {
                    const element = oldIndexesInViewport[index];
                    if (!newIndexesInViewport.includes(element)) {
                        changedIndexesOfTop.push(element);
                    } else {
                        break;
                    }
                }
                for (let index = newIndexesInViewport.length - 1; index >= 0; index--) {
                    const element = newIndexesInViewport[index];
                    if (!oldIndexesInViewport.includes(element)) {
                        changedIndexesOfBottom.push(element);
                    } else {
                        break;
                    }
                }
            } else if (needAddOnTop || needRemoveOnBottom) {
                // 向上
                for (let index = 0; index < newIndexesInViewport.length; index++) {
                    const element = newIndexesInViewport[index];
                    if (!oldIndexesInViewport.includes(element)) {
                        changedIndexesOfTop.push(element);
                    } else {
                        break;
                    }
                }
                for (let index = oldIndexesInViewport.length - 1; index >= 0; index--) {
                    const element = oldIndexesInViewport[index];
                    if (!newIndexesInViewport.includes(element)) {
                        changedIndexesOfBottom.push(element);
                    } else {
                        break;
                    }
                }
            }
            if (isDebug) {
                debugLog('log', `====== diffVirtualViewport stage: ${stage} ======`);
                debugLog('log', 'oldIndexesInViewport:', oldIndexesInViewport);
                debugLog('log', 'newIndexesInViewport:', newIndexesInViewport);
                // this.editor.children[index] will be undefined when it is removed
                debugLog(
                    'log',
                    'changedIndexesOfTop:',
                    needRemoveOnTop ? '-' : needAddOnTop ? '+' : '-',
                    changedIndexesOfTop,
                    changedIndexesOfTop.map(
                        index =>
                            (this.editor.children[index] &&
                                getCachedHeightByElement(this.editor, this.editor.children[index] as Element)) ||
                            0
                    )
                );
                debugLog(
                    'log',
                    'changedIndexesOfBottom:',
                    needAddOnBottom ? '+' : needRemoveOnBottom ? '-' : '+',
                    changedIndexesOfBottom,
                    changedIndexesOfBottom.map(
                        index =>
                            (this.editor.children[index] &&
                                getCachedHeightByElement(this.editor, this.editor.children[index] as Element)) ||
                            0
                    )
                );
                const needTop = virtualView.heights.slice(0, newIndexesInViewport[0]).reduce((acc, height) => acc + height, 0);
                const needBottom = virtualView.heights
                    .slice(newIndexesInViewport[newIndexesInViewport.length - 1] + 1)
                    .reduce((acc, height) => acc + height, 0);
                debugLog(
                    'log',
                    needTop - parseFloat(this.virtualTopHeightElement.style.height),
                    'newTopHeight:',
                    needTop,
                    'prevTopHeight:',
                    parseFloat(this.virtualTopHeightElement.style.height)
                );
                debugLog(
                    'log',
                    'newBottomHeight:',
                    needBottom,
                    'prevBottomHeight:',
                    parseFloat(this.virtualBottomHeightElement.style.height)
                );
                debugLog('warn', '=========== Dividing line ===========');
            }
            return {
                isDifferent: true,
                needRemoveOnTop,
                needAddOnTop,
                needRemoveOnBottom,
                needAddOnBottom,
                changedIndexesOfTop,
                changedIndexesOfBottom
            };
        }
        return {
            isDifferent: false,
            changedIndexesOfTop: [],
            changedIndexesOfBottom: []
        };
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

    calculateVirtualScrollSelection(selection: Selection) {
        if (selection) {
            const isBlockCardCursor = AngularEditor.isBlockCardLeftCursor(this.editor) || AngularEditor.isBlockCardRightCursor(this.editor);
            const indics = this.inViewportIndics;
            if (indics.length > 0) {
                const currentVisibleRange: Range = {
                    anchor: Editor.start(this.editor, [indics[0]]),
                    focus: Editor.end(this.editor, [indics[indics.length - 1]])
                };
                const [start, end] = Range.edges(selection);
                let forwardSelection = { anchor: start, focus: end };
                if (!isBlockCardCursor) {
                    forwardSelection = { anchor: start, focus: end };
                } else {
                    forwardSelection = { anchor: { path: start.path, offset: 0 }, focus: { path: end.path, offset: 0 } };
                }
                const intersectedSelection = Range.intersection(forwardSelection, currentVisibleRange);
                if (intersectedSelection && isBlockCardCursor) {
                    return selection;
                }
                EDITOR_TO_VIRTUAL_SCROLL_SELECTION.set(this.editor, intersectedSelection);
                if (!intersectedSelection || !Range.equals(intersectedSelection, forwardSelection)) {
                    if (isDebug) {
                        debugLog(
                            'log',
                            `selection is not in visible range, selection: ${JSON.stringify(
                                selection
                            )}, currentVisibleRange: ${JSON.stringify(currentVisibleRange)}, intersectedSelection: ${JSON.stringify(intersectedSelection)}`
                        );
                    }
                    return intersectedSelection;
                }
                return selection;
            }
        }
        EDITOR_TO_VIRTUAL_SCROLL_SELECTION.set(this.editor, null);
        return selection;
    }

    private isSelectionInvisible(selection: Selection) {
        const anchorIndex = selection.anchor.path[0];
        const focusIndex = selection.focus.path[0];
        const anchorElement = this.editor.children[anchorIndex] as Element | undefined;
        const focusElement = this.editor.children[focusIndex] as Element | undefined;
        return !anchorElement || !focusElement || !this.editor.isVisible(anchorElement) || !this.editor.isVisible(focusElement);
    }

    toNativeSelection(autoScroll = true) {
        try {
            let { selection } = this.editor;

            if (this.isEnabledVirtualScroll()) {
                selection = this.calculateVirtualScrollSelection(selection);
            }

            const root = AngularEditor.findDocumentOrShadowRoot(this.editor);
            const { activeElement } = root;
            const domSelection = (root as Document).getSelection();

            if ((this.isComposing && !IS_ANDROID) || !domSelection) {
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

            if (!hasDomSelectionInEditor && !AngularEditor.isFocused(this.editor)) {
                return;
            }

            if (AngularEditor.isReadOnly(this.editor) && (!selection || Range.isCollapsed(selection))) {
                return;
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
                if (
                    this.isEnabledVirtualScroll() &&
                    !selection &&
                    this.editor.selection &&
                    autoScroll &&
                    this.virtualScrollConfig.scrollContainer
                ) {
                    this.virtualScrollConfig.scrollContainer.scrollTop = this.virtualScrollConfig.scrollContainer.scrollTop + 100;
                    this.isUpdatingSelection = false;
                    return;
                } else {
                    // handle scrolling in setTimeout because of
                    // dom should not have updated immediately after listRender's updating
                    newDomRange && autoScroll && this.scrollSelectionIntoView(this.editor, newDomRange);
                    // COMPAT: In Firefox, it's not enough to create a range, you also need
                    // to focus the contenteditable element too. (2016/11/16)
                    if (newDomRange && IS_FIREFOX) {
                        el.focus();
                    }
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
        if (this.isEnabledVirtualScroll()) {
            this.updateListRenderAndRemeasureHeights();
        } else {
            this.listRender.update(this.editor.children, this.editor, this.context);
        }
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
        if (this.editor.selection && this.isSelectionInvisible(this.editor.selection)) {
            Transforms.deselect(this.editor);
            return;
        } else {
            this.toNativeSelection();
        }
    }

    render() {
        const changed = this.updateContext();
        if (changed) {
            if (this.isEnabledVirtualScroll()) {
                this.updateListRenderAndRemeasureHeights();
            } else {
                this.listRender.update(this.editor.children, this.editor, this.context);
            }
        }
    }

    updateListRenderAndRemeasureHeights() {
        const operations = this.editor.operations;
        const firstIndex = this.inViewportIndics[0];
        const operationsOfFirstElementMerged = operations.filter(
            op => op.type === 'merge_node' && op.path.length === 1 && firstIndex === op.path[0] - 1
        );
        const operationsOfFirstElementSplitted = operations.filter(
            op => op.type === 'split_node' && op.path.length === 1 && firstIndex === op.path[0]
        );
        const mutationOfFirstElementHeight = operationsOfFirstElementSplitted.length > 0 || operationsOfFirstElementMerged.length > 0;
        const visibleStates = this.editor.getAllVisibleStates();
        const previousInViewportChildren = [...this.inViewportChildren];
        // the first element height will reset to default height when split or merge
        // if the most top content of the first element is not in viewport, the change of height will cause the viewport to scroll
        // to keep viewport stable, we need to use the current inViewportIndics temporarily
        if (mutationOfFirstElementHeight) {
            const newInViewportIndics = [];
            const newInViewportChildren = [];
            this.inViewportIndics.forEach(index => {
                const element = this.editor.children[index] as Element;
                const isVisible = visibleStates[index];
                if (isVisible) {
                    newInViewportIndics.push(index);
                    newInViewportChildren.push(element);
                }
            });
            if (operationsOfFirstElementSplitted.length > 0) {
                const lastIndex = newInViewportIndics[newInViewportIndics.length - 1];
                for (let i = lastIndex + 1; i < this.editor.children.length; i++) {
                    const element = this.editor.children[i] as Element;
                    const isVisible = visibleStates[i];
                    if (isVisible) {
                        newInViewportIndics.push(i);
                        newInViewportChildren.push(element);
                        break;
                    }
                }
            }
            this.inViewportIndics = newInViewportIndics;
            this.inViewportChildren = newInViewportChildren;
            if (isDebug) {
                debugLog(
                    'log',
                    'updateListRenderAndRemeasureHeights',
                    'mutationOfFirstElementHeight',
                    'newInViewportIndics',
                    newInViewportIndics
                );
            }
        } else {
            let virtualView = this.calculateVirtualViewport(visibleStates);
            let diff = this.diffVirtualViewport(virtualView, 'onChange');
            if (diff.isDifferent && diff.needRemoveOnTop) {
                const remeasureIndics = diff.changedIndexesOfTop;
                const changed = measureHeightByIndics(this.editor, remeasureIndics);
                if (changed) {
                    virtualView = this.calculateVirtualViewport(visibleStates);
                    diff = this.diffVirtualViewport(virtualView, 'second');
                }
            }
            this.applyVirtualView(virtualView);
        }
        const { preRenderingCount, childrenWithPreRendering, childrenWithPreRenderingIndics } =
            this.appendPreRenderingToViewport(visibleStates);
        this.listRender.update(childrenWithPreRendering, this.editor, this.context, preRenderingCount, childrenWithPreRenderingIndics);
        const remeasureIndics = this.getChangedIndics(previousInViewportChildren);
        if (remeasureIndics.length) {
            this.indicsOfNeedRemeasured$.next({ indics: remeasureIndics, tryUpdateViewport: true });
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
                            this.toNativeSelection(false);
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
        if (
            AngularEditor.hasEditableTarget(this.editor, event.target) &&
            !isSelectionInsideVoid(this.editor) &&
            !this.isDOMEventHandled(event, this.compositionStart)
        ) {
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
        if (
            AngularEditor.hasEditableTarget(this.editor, event.target) &&
            !isSelectionInsideVoid(this.editor) &&
            !this.isDOMEventHandled(event, this.compositionEnd)
        ) {
            // COMPAT: In Chrome/Firefox, `beforeinput` events for compositions
            // aren't correct and never fire the "insertFromComposition"
            // type that we need. So instead, insert whenever a composition
            // ends since it will already have been committed to the DOM.
            if (this.isComposing === true && !IS_SAFARI && !IS_ANDROID && event.data) {
                preventInsertFromComposition(event, this.editor);
                Editor.insertText(this.editor, event.data);
            }

            // COMPAT: In Firefox 87.0 CompositionEnd fire twice
            // so we need avoid repeat insertText by isComposing === true,
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

                if (isKeyHotkey('mod+a', event)) {
                    this.editor.selectAll();
                    event.preventDefault();
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
        this.editorResizeObserver?.disconnect();
        this.editorScrollContainerResizeObserver?.disconnect();
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

export const isSelectionInsideVoid = (editor: AngularEditor) => {
    const selection = editor.selection;
    if (selection && Range.isCollapsed(selection)) {
        const currentNode = Node.parent(editor, selection.anchor.path);
        return Element.isElement(currentNode) && Editor.isVoid(editor, currentNode);
    }
    return false;
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
