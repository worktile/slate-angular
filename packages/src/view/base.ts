import {
    AfterViewInit,
    ChangeDetectorRef,
    Directive,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewContainerRef
} from '@angular/core';
import { AngularEditor } from '../plugins/angular-editor';
import { ELEMENT_TO_COMPONENT, ELEMENT_TO_NODE, NODE_TO_ELEMENT } from '../utils/weak-maps';
import { SlateViewContext, SlateElementContext, SlateTextContext, SlateLeafContext } from './context';
import { Ancestor, Descendant, Element, Path, Range, Text } from 'slate';
import { SlateChildrenContext } from './context';
import { hasBeforeContextChange } from './before-context-change';
import { ViewLevel, ViewLoopManager, createLoopManager } from './loop-manager';

/**
 * base class for custom element component or text component
 */
@Directive()
export abstract class BaseComponent<
    T = SlateTextContext | SlateLeafContext | SlateElementContext,
    K extends AngularEditor = AngularEditor
> {
    protected _context: T;

    @Input()
    set context(value: T) {
        if (hasBeforeContextChange<T>(this)) {
            this.beforeContextChange(value);
        }
        this._context = value;
        this.onContextChange();
    }

    get context() {
        return this._context;
    }

    @Input() viewContext: SlateViewContext<K>;

    get editor() {
        return this.viewContext && this.viewContext.editor;
    }

    get nativeElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    constructor(public elementRef: ElementRef, public cdr: ChangeDetectorRef) {}

    abstract onContextChange();
}

/**
 * base class for custom leaf component
 */
@Directive()
export class BaseLeafComponent extends BaseComponent<SlateLeafContext> implements OnInit {
    initialized = false;

    placeholderElement: HTMLSpanElement;

    @HostBinding('attr.data-slate-leaf') isSlateLeaf = true;

    get text(): Text {
        return this.context && this.context.text;
    }

    get leaf(): Text {
        return this.context && this.context.leaf;
    }

    ngOnInit() {
        this.initialized = true;
    }

    onContextChange() {
        if (!this.initialized) {
            return;
        }
        this.cdr.detectChanges();
    }

    renderPlaceholder() {
        // issue-1: IME input was interrupted
        // issue-2: IME input focus jumping
        // Issue occurs when the span node of the placeholder is before the slateString span node
        if (this.context.leaf['placeholder']) {
            if (!this.placeholderElement) {
                this.createPlaceholder();
            }
            this.updatePlaceholder();
        } else {
            this.destroyPlaceholder();
        }
    }

    createPlaceholder() {
        const placeholderElement = document.createElement('span');
        placeholderElement.innerText = this.context.leaf['placeholder'];
        placeholderElement.contentEditable = 'false';
        placeholderElement.setAttribute('data-slate-placeholder', 'true');
        this.placeholderElement = placeholderElement;
        this.nativeElement.classList.add('leaf-with-placeholder');
        this.nativeElement.appendChild(placeholderElement);
    }

    updatePlaceholder() {
        if (this.placeholderElement.innerText !== this.context.leaf['placeholder']) {
            this.placeholderElement.innerText = this.context.leaf['placeholder'];
        }
    }

    destroyPlaceholder() {
        if (this.placeholderElement) {
            this.placeholderElement.remove();
            this.placeholderElement = null;
            this.nativeElement.classList.remove('leaf-with-placeholder');
        }
    }
}

/**
 * base class for custom element component
 */
@Directive()
export class BaseElementComponent<T extends Element = Element, K extends AngularEditor = AngularEditor>
    extends BaseComponent<SlateElementContext<T>, K>
    implements OnInit, AfterViewInit, OnDestroy
{
    initialized = false;

    childrenContext: SlateChildrenContext;

    viewLoopManager: ViewLoopManager;

    get element(): T {
        return this._context && this._context.element;
    }

    get selection(): Range {
        return this._context && this._context.selection;
    }

    get path(): Path {
        return this._context && this._context.path;
    }

    get decorations(): Range[] {
        return this._context && this._context.decorations;
    }

    get children(): Descendant[] {
        return this._context && this._context.element.children;
    }

    get isCollapsed() {
        return this.selection && Range.isCollapsed(this.selection);
    }

    get isCollapsedAndNonReadonly() {
        return this.selection && Range.isCollapsed(this.selection) && !this.readonly;
    }

    get readonly() {
        return this._context && this._context.readonly;
    }

    getHost = () => {
        return this.elementRef.nativeElement;
    }

    constructor(public elementRef: ElementRef, public cdr: ChangeDetectorRef, public viewContainerRef: ViewContainerRef) {
        super(elementRef, cdr);
    }

    ngOnInit() {
        this.updateWeakMap();
        for (const key in this._context.attributes) {
            this.nativeElement.setAttribute(key, this._context.attributes[key]);
        }
        this.initialized = true;
        this.viewLoopManager = createLoopManager(ViewLevel.node, this.viewContext, this.viewContainerRef, this.getHost);
        this.viewLoopManager.initialize(this.children, this.element, this.path, this.childrenContext);
    }

    ngAfterViewInit(): void {
        this.viewLoopManager.mount();
    }

    updateWeakMap() {
        NODE_TO_ELEMENT.set(this.element, this.nativeElement);
        ELEMENT_TO_NODE.set(this.nativeElement, this.element);
        ELEMENT_TO_COMPONENT.set(this.element, this);
    }

    ngOnDestroy() {
        if (NODE_TO_ELEMENT.get(this.element) === this.nativeElement) {
            NODE_TO_ELEMENT.delete(this.element);
        }
        if (ELEMENT_TO_COMPONENT.get(this.element) === this) {
            ELEMENT_TO_COMPONENT.delete(this.element);
        }
    }

    onContextChange() {
        this.childrenContext = this.getChildrenContext();
        if (!this.initialized) {
            return;
        }
        this.updateWeakMap();
        this.viewLoopManager.doCheck(this.children, this.element, this.path, this.childrenContext);
        this.cdr.detectChanges();
    }

    getChildrenContext(): SlateChildrenContext {
        return {
            parent: this._context.element,
            selection: this._context.selection,
            decorations: this._context.decorations,
            decorate: this._context.decorate,
            readonly: this._context.readonly
        };
    }
}

/**
 * base class for custom text component
 */
@Directive()
export class BaseTextComponent<T extends Text = Text>
    extends BaseComponent<SlateTextContext<T>>
    implements OnInit, AfterViewInit, OnDestroy
{
    initialized = false;

    private leafContexts: SlateLeafContext[];
    private leaves: Text[];

    viewLoopManager: ViewLoopManager<SlateLeafContext, SlateTextContext>;

    get text(): T {
        return this._context && this._context.text;
    }

    getHost = () => {
        return this.elementRef.nativeElement;
    }

    constructor(public elementRef: ElementRef, public cdr: ChangeDetectorRef, public viewContainerRef: ViewContainerRef) {
        super(elementRef, cdr);
    }

    ngOnInit() {
        this.updateWeakMap();
        this.initialized = true;
        this.viewLoopManager = new ViewLoopManager<SlateLeafContext, SlateTextContext>(ViewLevel.leaf, {
            getViewType: (item: Descendant) => {
                return (this.viewContext.renderLeaf && this.viewContext.renderLeaf(item as Text)) || this.viewContext.defaultLeaf;
            },
            viewContext: this.viewContext,
            viewContainerRef: this.viewContainerRef,
            getContext: (index: number, item: Descendant, parent: Ancestor, parentPath: Path, parentContext: SlateTextContext) => {
                return this.leafContexts[index];
            },
            itemCallback: (index: number, item: Descendant) => {},
            trackBy: (index, node) => {
                return index;
            },
            getHost: this.getHost
        });
        this.buildLeaves();
        this.viewLoopManager.initialize(this.leaves, null, null, this.context);
    }

    ngAfterViewInit(): void {
        this.viewLoopManager.mount();
    }

    buildLeaves() {
        this.leaves = Text.decorations(this.context.text, this.context.decorations);
        this.leafContexts = this.leaves.map((leaf, index) => {
            return {
                leaf,
                text: this.context.text,
                parent: this.context.parent,
                index,
                isLast: this.context.isLast && index === this.leaves.length - 1
            };
        });
    }

    updateWeakMap() {
        ELEMENT_TO_NODE.set(this.nativeElement, this.text);
        NODE_TO_ELEMENT.set(this.text, this.nativeElement);
    }

    ngOnDestroy() {
        if (NODE_TO_ELEMENT.get(this.text) === this.nativeElement) {
            NODE_TO_ELEMENT.delete(this.text);
        }
    }

    onContextChange() {
        if (!this.initialized) {
            return;
        }
        this.updateWeakMap();
        this.buildLeaves();
        this.viewLoopManager.doCheck(this.leaves, null, null, this.context);
        this.cdr.detectChanges();
    }
}
