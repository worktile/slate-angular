import { SlateStringRender } from '../components/string/string-render';
import { BaseLeafFlavour } from '../view/flavour/leaf';

export class TestingLeafFlavour extends BaseLeafFlavour {
    stringRender: SlateStringRender | null = null;

    render() {
        const leafNode = createDefaultLeafNode();
        this.stringRender = new SlateStringRender(this.context, this.viewContext);
        const stringNode = this.stringRender.render();
        leafNode.appendChild(stringNode);
        this.nativeElement = leafNode;
        this.nativeElement.classList.add('testing-leaf');
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
