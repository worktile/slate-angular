import { ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit } from "@angular/core";
import { AngularEditor } from "../plugins/angular-editor";
import { ELEMENT_TO_NODE, NODE_TO_ELEMENT } from "../utils/weak-maps";
import { SlateViewContext, SlateElementContext, SlateTextContext, SlateLeafContext } from "./context";
import { Descendant, Element, Range, Text } from 'slate';
import { SlateChildrenContext } from "./context";
import { hasBeforeContextChange } from "./before-context-change";
import { EDITOR_TO_KEY_TO_ELEMENT, Key } from "../utils";

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
@Directive()
export class BaseLeafComponent extends BaseComponent<SlateLeafContext> implements OnInit {
    initialized = false;

    placeholderElement: HTMLSpanElement;

    @HostBinding('attr.data-slate-leaf') isSlateLeaf = true

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
        this.cdr.markForCheck();
    }

    renderPlaceholder() {
        // issue-1: IME input was interrupted
        // issue-2: IME input focus jumping
        // Issue occurs when the span node of the placeholder is before the slateString span node
        if (this.context.leaf['placeholder']) {
            if (!this.placeholderElement) {
                this.placeholderElement = document.createElement('span');
                this.placeholderElement.innerText = this.context.leaf['placeholder'];
                this.placeholderElement.contentEditable = 'false';
                this.placeholderElement.setAttribute('data-slate-placeholder', 'true');
                this.nativeElement.classList.add('leaf-with-placeholder');
                this.nativeElement.appendChild(this.placeholderElement);
            }
        } else {
            this.destroyPlaceholder();
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
export class BaseElementComponent<T extends Element = Element, K extends AngularEditor = AngularEditor> extends BaseComponent<SlateElementContext<T>, K> implements OnInit, OnDestroy {
    initialized = false;

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
        return this.selection && Range.isCollapsed(this.selection);
    }

    get isCollapsedAndNonReadonly() {
        return this.selection && Range.isCollapsed(this.selection) && !this.readonly;
    }

    get readonly() {
        return this._context && this._context.readonly;
    }

    private get key(): Key {
        return AngularEditor.findKey(this.editor, this.element);
    }
    
    private get KEY_TO_ELEMENT(): WeakMap<Key, HTMLElement> {
        return EDITOR_TO_KEY_TO_ELEMENT.get(this.editor);
    }

    ngOnInit() {
        this.updateWeakMap();
        for (const key in this._context.attributes) {
            this.nativeElement.setAttribute(key, this._context.attributes[key]);
        }
        this.initialized = true;
    }

    updateWeakMap() {
        this.KEY_TO_ELEMENT?.set(this.key, this.nativeElement)
        NODE_TO_ELEMENT.set(this.element, this.nativeElement);
        ELEMENT_TO_NODE.set(this.nativeElement, this.element);
    }

    ngOnDestroy() {
        if (NODE_TO_ELEMENT.get(this.element) === this.nativeElement) {
            this.KEY_TO_ELEMENT?.delete(this.key)
            NODE_TO_ELEMENT.delete(this.element);
        }
    }

    onContextChange() {
        this.childrenContext = this.getChildrenContext();
        if (!this.initialized) {
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
@Directive()
export class BaseTextComponent extends BaseComponent<SlateTextContext> implements OnInit, OnDestroy {
    initialized = false;

    get text(): Text {
        return this._context && this._context.text;
    }

    private get key(): Key {
        return AngularEditor.findKey(this.editor, this.text);
    }
    
    private get KEY_TO_ELEMENT(): WeakMap<Key, HTMLElement> {
        return EDITOR_TO_KEY_TO_ELEMENT.get(this.editor);
    }


    ngOnInit() {
        this.updateWeakMap();
        this.initialized = true;
    }

    updateWeakMap() {
        this.KEY_TO_ELEMENT?.set(this.key, this.nativeElement)
        ELEMENT_TO_NODE.set(this.nativeElement, this.text);
        NODE_TO_ELEMENT.set(this.text, this.nativeElement);
    }

    ngOnDestroy() {
        if (NODE_TO_ELEMENT.get(this.text) === this.nativeElement) {
            this.KEY_TO_ELEMENT?.delete(this.key)
            NODE_TO_ELEMENT.delete(this.text);
        }
    }

    onContextChange() {
        if (!this.initialized) {
            return;
        }

        this.cdr.markForCheck();
        this.updateWeakMap();
    }
}
