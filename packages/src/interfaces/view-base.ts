import { ChangeDetectorRef, ElementRef, Input, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { AngularEditor } from "../plugins/angular-editor";
import { ELEMENT_TO_COMPONENT, ELEMENT_TO_NODE, NODE_TO_ELEMENT } from "../utils/weak-maps";
import { SlateViewContext, SlateElementContext, SlateTextContext, SlateLeafContext } from "./view-context";
import { Element } from 'slate';
import { ComponentType } from "@angular/cdk/portal";

export type ViewType = TemplateRef<any> | ComponentType<any>;

/**
 * template context or component base class
 */
export interface SlateViewBase<T> {
    context: T;
    viewContext: SlateViewContext;
}

/**
 * base class for custom element component or text component
 */
export abstract class SlateComponentBase<T = SlateTextContext | SlateLeafContext | SlateElementContext> {
    private _context: T;

    @Input()
    set context(value: T) {
        this._context = value;
        this.onContextChanges();
    }

    get context() {
        return this._context;
    }

    @Input() viewContext: SlateViewContext;

    get nativeElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    constructor(public elementRef: ElementRef, public cdr: ChangeDetectorRef) { }

    abstract onContextChanges();
}

export class SlateLeafComponentBase extends SlateComponentBase<SlateLeafContext> implements OnInit {
    initailzed = false;

    ngOnInit() {
        this.initailzed = true;
    }

    onContextChanges() {
        if (!this.initailzed) {
            return;
        }
        this.cdr.markForCheck();
    }
}

export class SlateElementComponentBase<T extends Element = Element, K extends AngularEditor = AngularEditor> extends SlateComponentBase<SlateElementContext<T, K>> implements OnInit, OnDestroy {
    initailzed = false;

    get element() {
        return this.context && this.context.element;
    }

    get selection() {
        return this.context && this.context.selection;
    }

    get decorations() {
        return this.context && this.context.decorations;
    }

    get children() {
        return this.context.element.children;
    }

    get childrenContext() {
        return { parent: this.context.element, selection: this.context.selection, decorations: this.context.decorations };
    }

    ngOnInit() {
        this.updateWeakMap();
        ELEMENT_TO_COMPONENT.set(this.element, this);
        for (const key in this.context.attributes) {
            this.nativeElement.setAttribute(key, this.context.attributes[key]);
        }
        this.initailzed = true;
    }

    updateWeakMap() {
        NODE_TO_ELEMENT.set(this.element, this.nativeElement);
        ELEMENT_TO_NODE.set(this.nativeElement, this.element);
    }

    ngOnDestroy() {
        if (NODE_TO_ELEMENT.get(this.element) === this.nativeElement) {
            NODE_TO_ELEMENT.delete(this.element);
        }
        if (ELEMENT_TO_COMPONENT.get(this.element) === this) {
            ELEMENT_TO_COMPONENT.delete(this.element);
        }
    }

    onContextChanges() {
        if (!this.initailzed) {
            return;
        }
        this.cdr.markForCheck();
        this.updateWeakMap();
    }
}

export class SlateTextComponentBase extends SlateComponentBase<SlateTextContext> implements OnInit, OnDestroy {
    initailzed = false;

    get text() {
        return this.context.text;
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

    onContextChanges() {
        if (!this.initailzed) {
            return;
        }

        this.cdr.markForCheck();
        this.updateWeakMap();
    }
}
