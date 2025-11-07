import { ViewContainerRef } from '@angular/core';
import { AngularEditor } from '../../plugins/angular-editor';
import { SlateElementContext, SlateLeafContext, SlateTextContext, SlateViewContext } from '../context';
import { hasAfterContextChange, hasBeforeContextChange } from '../context-change';

export abstract class BaseFlavour<T = SlateTextContext | SlateLeafContext | SlateElementContext, K extends AngularEditor = AngularEditor> {
    static isFlavour = true;

    initialized = false;

    protected _context: T;

    viewContainerRef: ViewContainerRef;

    set context(value: T) {
        if (hasBeforeContextChange<T>(this)) {
            this.beforeContextChange(value);
        }
        this._context = value;
        this.onContextChange();
        if (hasAfterContextChange<T>(this)) {
            this.afterContextChange();
        }
    }

    get context() {
        return this._context;
    }

    viewContext: SlateViewContext<K>;

    get editor() {
        return this.viewContext && this.viewContext.editor;
    }

    nativeElement: HTMLElement;

    abstract onContextChange();

    abstract onInit();

    abstract onDestroy();

    abstract render();

    abstract rerender();
}
