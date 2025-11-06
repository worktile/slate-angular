import { Text } from 'slate';
import { SlateLeafContext } from './context';
import { getContentHeight } from '../utils/dom';
import { BaseFlavour } from './flavour-base';

export abstract class BaseLeafFlavour extends BaseFlavour<SlateLeafContext> {
    placeholderElement: HTMLSpanElement;

    get text(): Text {
        return this.context && this.context.text;
    }

    get leaf(): Text {
        return this.context && this.context.leaf;
    }

    onInit() {
        this.render();
        this.renderPlaceholder();
        this.initialized = true;
    }

    onContextChange() {
        if (!this.initialized) {
            return;
        }
        this.rerender();
        this.renderPlaceholder();
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

        setTimeout(() => {
            const editorElement = this.nativeElement.closest('.the-editor-typo');
            const editorContentHeight = getContentHeight(editorElement);
            if (editorContentHeight > 0) {
                // Not supported webkitLineClamp exceeds height hiding
                placeholderElement.style.maxHeight = `${editorContentHeight}px`;
            }
            const lineClamp = Math.floor(editorContentHeight / this.nativeElement.offsetHeight) || 0;
            placeholderElement.style.webkitLineClamp = `${Math.max(lineClamp, 1)}`;
        });
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

    onDestroy() {
        this.nativeElement?.remove();
    }

    abstract render();

    abstract rerender();
}
