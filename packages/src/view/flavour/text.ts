import { SlateTextContext } from '../context';
import { LeavesRender } from '../render/leaves-render';
import { BaseFlavour } from './base';
import { ELEMENT_TO_NODE, NODE_TO_ELEMENT } from 'slate-dom';
import { Text } from 'slate';

export abstract class BaseTextFlavour<T extends Text = Text> extends BaseFlavour<SlateTextContext<T>> {
    get text(): T {
        return this._context && this._context.text;
    }

    leavesRender: LeavesRender;

    getOutletParent = () => {
        return this.nativeElement;
    };

    getOutletElement = () => {
        return this.nativeElement.querySelector('.children-outlet') as HTMLElement | null;
    };

    onInit() {
        this.render();
        this.updateWeakMap();
        this.initialized = true;
        this.leavesRender = new LeavesRender(this.viewContext, this.viewContainerRef, this.getOutletParent, this.getOutletElement);
        this.leavesRender.initialize(this.context);
    }

    updateWeakMap() {
        ELEMENT_TO_NODE.set(this.nativeElement, this.text);
        NODE_TO_ELEMENT.set(this.text, this.nativeElement);
    }

    onDestroy() {
        if (NODE_TO_ELEMENT.get(this.text) === this.nativeElement) {
            NODE_TO_ELEMENT.delete(this.text);
        }
        ELEMENT_TO_NODE.delete(this.nativeElement);
        this.nativeElement?.remove();
    }

    onContextChange() {
        if (!this.initialized) {
            return;
        }
        this.rerender();
        this.updateWeakMap();
        this.leavesRender.update(this.context);
    }

    abstract render();

    abstract rerender();
}
