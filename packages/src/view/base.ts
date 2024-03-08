import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
    inject
} from '@angular/core';
import { AngularEditor } from '../plugins/angular-editor';
import { ELEMENT_TO_COMPONENT, ELEMENT_TO_NODE, NODE_TO_ELEMENT } from '../utils/weak-maps';
import { SlateViewContext, SlateElementContext, SlateTextContext, SlateLeafContext } from './context';
import { Descendant, Element, Path, Range, Text } from 'slate';
import { SlateChildrenContext } from './context';
import { hasAfterContextChange, hasBeforeContextChange } from './context-change';
import { ListRender } from './render/list-render';
import { LeavesRender } from './render/leaves-render';
import { SlateChildrenOutlet } from '../components/children/children-outlet.component';

/**
 * base class for template
 */
export interface BaseEmbeddedView<T, K extends AngularEditor = AngularEditor> {
    context: T;
    viewContext: SlateViewContext<K>;
}

/**
 * base class for custom element component or text component
 */
@Directive()
export abstract class BaseComponent<
    T = SlateTextContext | SlateLeafContext | SlateElementContext,
    K extends AngularEditor = AngularEditor
> {
    initialized = false;

    protected _context: T;

    @Input()
    set context(value: T) {
        if (hasBeforeContextChange<T>(this)) {
            this.beforeContextChange(value);
        }
        this._context = value;
        this.onContextChange();
        if (this.initialized) {
            this.cdr.detectChanges();
        }
        if (hasAfterContextChange<T>(this)) {
            this.afterContextChange();
        }
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

    constructor(
        public elementRef: ElementRef,
        public cdr: ChangeDetectorRef
    ) {}

    abstract onContextChange();
}

/**
 * base class for custom leaf component
 */
@Directive()
export class BaseLeafComponent extends BaseComponent<SlateLeafContext> implements OnInit {
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
    implements OnInit, OnDestroy
{
    viewContainerRef = inject(ViewContainerRef);

    childrenContext: SlateChildrenContext;

    @ViewChild(SlateChildrenOutlet, { static: true })
    childrenOutletInstance?: SlateChildrenOutlet;

    get element(): T {
        return this._context && this._context.element;
    }

    get selection(): Range {
        return this._context && this._context.selection;
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

    getOutletParent = () => {
        return this.elementRef.nativeElement;
    };

    getOutletElement = () => {
        if (this.childrenOutletInstance) {
            return this.childrenOutletInstance.getNativeElement();
        }
        return null;
    };

    listRender: ListRender;

    ngOnInit() {
        for (const key in this._context.attributes) {
            this.nativeElement.setAttribute(key, this._context.attributes[key]);
        }
        this.initialized = true;
        this.listRender = new ListRender(this.viewContext, this.viewContainerRef, this.getOutletParent, this.getOutletElement);
        if (this.editor.isExpanded(this.element)) {
            this.listRender.initialize(this.children, this.element, this.childrenContext);
        }
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
        ELEMENT_TO_NODE.delete(this.nativeElement);
        if (ELEMENT_TO_COMPONENT.get(this.element) === this) {
            ELEMENT_TO_COMPONENT.delete(this.element);
        }
    }

    onContextChange() {
        this.childrenContext = this.getChildrenContext();
        this.updateWeakMap();
        if (!this.initialized) {
            return;
        }
        this.updateChildrenView();
    }

    updateChildrenView() {
        if (this.editor.isExpanded(this.element)) {
            this.listRender.update(this.children, this.element, this.childrenContext);
        } else {
            if (this.listRender.initialized) {
                this.listRender.destroy();
            }
        }
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
export class BaseTextComponent<T extends Text = Text> extends BaseComponent<SlateTextContext<T>> implements OnInit, OnDestroy {
    viewContainerRef = inject(ViewContainerRef);

    get text(): T {
        return this._context && this._context.text;
    }

    leavesRender: LeavesRender;

    @ViewChild(SlateChildrenOutlet, { static: true })
    childrenOutletInstance?: SlateChildrenOutlet;

    getOutletParent = () => {
        return this.elementRef.nativeElement;
    };

    getOutletElement = () => {
        if (this.childrenOutletInstance) {
            return this.childrenOutletInstance.getNativeElement();
        }
        return null;
    };

    ngOnInit() {
        this.initialized = true;
        this.leavesRender = new LeavesRender(this.viewContext, this.viewContainerRef, this.getOutletParent, this.getOutletElement);
        this.leavesRender.initialize(this.context);
    }

    updateWeakMap() {
        ELEMENT_TO_NODE.set(this.nativeElement, this.text);
        NODE_TO_ELEMENT.set(this.text, this.nativeElement);
    }

    ngOnDestroy() {
        if (NODE_TO_ELEMENT.get(this.text) === this.nativeElement) {
            NODE_TO_ELEMENT.delete(this.text);
        }
        ELEMENT_TO_NODE.delete(this.nativeElement);
    }

    onContextChange() {
        this.updateWeakMap();
        if (!this.initialized) {
            return;
        }
        this.leavesRender.update(this.context);
    }
}
