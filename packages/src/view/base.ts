import { ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit } from "@angular/core";
import { AngularEditor } from "../plugins/angular-editor";
import { ELEMENT_TO_COMPONENT, ELEMENT_TO_NODE, NODE_TO_ELEMENT } from "../utils/weak-maps";
import { SlateViewContext, SlateElementContext, SlateTextContext, SlateLeafContext } from "./context";
import { Descendant, Element, Range, Text } from 'slate';
import { SlateChildrenContext } from "./context";
import { hasBeforeContextChange } from "./before-context-change";

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
export abstract class BaseComponent<T = SlateTextContext | SlateLeafContext | SlateElementContext, K extends AngularEditor = AngularEditor> {
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

    constructor(public elementRef: ElementRef, public cdr: ChangeDetectorRef) { }

    abstract onContextChange();
}

/**
 * base class for custom leaf component
 */
export class BaseLeafComponent extends BaseComponent<SlateLeafContext> implements OnInit {
    initailzed = false;

    @HostBinding('attr.data-slate-leaf')  isSlateLeaf = true

    get text(): Text {
        return this.context && this.context.text;
    }

    get leaf(): Text {
        return this.context && this.context.leaf;
    }

    ngOnInit() {
        this.initailzed = true;
    }

    onContextChange() {
        if (!this.initailzed) {
            return;
        }
        this.cdr.markForCheck();
    }
}

/**
 * base class for custom element component
 */
export class BaseElementComponent<T extends Element = Element, K extends AngularEditor = AngularEditor> extends BaseComponent<SlateElementContext<T>, K> implements OnInit, OnDestroy {
    initailzed = false;

    childrenContext: SlateChildrenContext;

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
        return this.selection && Range.isCollapsed(this.editor.selection);
    }

    get readonly() {
        return this._context && this._context.readonly;
    }

    ngOnInit() {
        this.updateWeakMap();
        for (const key in this._context.attributes) {
            this.nativeElement.setAttribute(key, this._context.attributes[key]);
        }
        this.initailzed = true;
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
        if (!this.initailzed) {
            return;
        }
        this.cdr.markForCheck();
        this.updateWeakMap();
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
export class BaseTextComponent extends BaseComponent<SlateTextContext> implements OnInit, OnDestroy {
    initailzed = false;

    get text(): Text {
        return this._context.text;
    }

    ngOnInit() {
        this.updateWeakMap();
        this.initailzed = true;
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
        if (!this.initailzed) {
            return;
        }

        this.cdr.markForCheck();
        this.updateWeakMap();
    }
}
