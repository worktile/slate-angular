import { BaseLeafFlavour } from '../../view/flavour/leaf';
import { SlateStringRender } from '../string/string-render';

export class DefaultLeafFlavour extends BaseLeafFlavour {
    stringRender: SlateStringRender | null = null;

    render() {
        const leafNode = createDefaultLeafNode();
        this.stringRender = new SlateStringRender(this.context, this.viewContext);
        const stringNode = this.stringRender.render();
        leafNode.appendChild(stringNode);
        this.nativeElement = leafNode;
    }

    rerender() {
        this.stringRender?.update(this.context, this.viewContext);
    }
}

export const createDefaultLeafNode = () => {
    const span = document.createElement('span');
    span.setAttribute('data-slate-leaf', 'true');
    return span;
};
