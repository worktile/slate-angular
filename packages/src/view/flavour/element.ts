import { AngularEditor } from '../../plugins/angular-editor';
import { SlateChildrenContext, SlateElementContext } from '../context';
import { Descendant, Element, Range } from 'slate';
import { BaseFlavour } from './base';
import { addAfterViewInitQueue, ListRender } from '../render/list-render';
import { ELEMENT_TO_NODE, NODE_TO_ELEMENT } from 'slate-dom';
import { ELEMENT_TO_COMPONENT } from '../../utils/weak-maps';

export const DEFAULT_ELEMENT_HEIGHT = 24;

export abstract class BaseElementFlavour<T extends Element = Element, K extends AngularEditor = AngularEditor> extends BaseFlavour<
    SlateElementContext<T>,
    K
> {
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

    getOutletParent = () => {
        return this.nativeElement;
    };

    getOutletElement = () => {
        return this.nativeElement.querySelector('.children-outlet') as HTMLElement | null;
    };

    listRender: ListRender;

    onInit() {
        this.initialized = true;
        this.render();
        for (const key in this._context.attributes) {
            this.nativeElement.setAttribute(key, this._context.attributes[key]);
        }
        this.updateWeakMap();
        this.listRender = new ListRender(this.viewContext, this.viewContainerRef, this.getOutletParent, this.getOutletElement);
        if (this.editor.isExpanded(this.element)) {
            this.listRender.initialize(this.children, this.element, this.childrenContext);
        }
        addAfterViewInitQueue(this.editor, () => {
            this.afterViewInit();
        });
    }

    afterViewInit() {
        if (this._context.contentEditable !== undefined) {
            this.nativeElement.setAttribute('contenteditable', this._context.contentEditable + '');
        }
    }

    updateWeakMap() {
        NODE_TO_ELEMENT.set(this.element, this.nativeElement);
        ELEMENT_TO_NODE.set(this.nativeElement, this.element);
        ELEMENT_TO_COMPONENT.set(this.element, this);
    }

    onDestroy() {
        if (NODE_TO_ELEMENT.get(this.element) === this.nativeElement) {
            NODE_TO_ELEMENT.delete(this.element);
        }
        ELEMENT_TO_NODE.delete(this.nativeElement);
        if (ELEMENT_TO_COMPONENT.get(this.element) === this) {
            ELEMENT_TO_COMPONENT.delete(this.element);
        }
        this.nativeElement?.remove();
    }

    onContextChange() {
        this.childrenContext = this.getChildrenContext();
        if (!this.initialized) {
            return;
        }
        this.rerender();
        this.updateWeakMap();
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

    getRealHeight(): Promise<number> {
        const computedStyle = getComputedStyle(this.nativeElement);
        return Promise.resolve(
            this.nativeElement.offsetHeight + parseFloat(computedStyle.marginTop) + parseFloat(computedStyle.marginBottom)
        );
    }

    abstract render(): void;

    abstract rerender(): void;
}
