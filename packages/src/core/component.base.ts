import { Input, OnInit, ElementRef, OnDestroy, SimpleChanges } from '@angular/core';
import { Element, Range, Editor } from 'slate';
import { Subject } from 'rxjs';
import { ViewElementContext } from '../interfaces/view-node';
import { Initializer } from './initializer';

export abstract class SlaComponentBase<T extends Element = Element, K extends Editor = Editor> {
    private _context: ViewElementContext<T, K>;

    get element() {
        return this._context && this._context.element;
    }

    get children() {
        return this._context && this._context.children;
    }

    get selection() {
        return this._context && this._context.selection;
    }

    get isCollapsed() {
        return this.selection && Range.isCollapsed(this.editor.selection);
    }

    get editor() {
        return this._context && this._context.editor;
    }

    get readonly() {
        return this._context && this._context.readonly;
    }

    // todo can not set @Input in this lib
    abstract set context(value: ViewElementContext<T>);

    destroy$ = new Subject();

    constructor(public elementRef: ElementRef) { }

    setContext(_context: ViewElementContext<T, K>) {
        const isNewElement = this._context && this._context.element !== _context.element;
        this._context = _context;
        if (isNewElement) {
            Initializer.updateWeakMap(_context.element, this.elementRef, this);
        }
    }

    init() {
        Initializer.initComponent(this._context.element, this.elementRef, this._context.attributes, this);
    }

    destroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        Initializer.deleteWeakMap(this.element, this.elementRef, this);
    }
}

export interface ComponentAttributes {
    'data-slate-node': 'element' | 'text';
    'data-slate-void'?: true;
    'data-slate-inline'?: true;
    'contenteditable'?: false;
    'data-slate-key'?: string;
    // dir?: 'rtl';
}

