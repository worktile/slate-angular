import { string } from 'slate';
import { BaseTextFlavour } from '../../view/base';

export class DefaultTextFlavour extends BaseTextFlavour {
    isEmpty = false;

    render() {
        if (this.text.text === '') {
            this.isEmpty = true;
            this.nativeElement = createEmptyOrVoidTextNode();
        } else {
            this.nativeElement = createDefaultTextNode(this.text.text);
        }
    }

    rerender() {
        if (this.isEmpty && this.text.text !== '') {
            const nativeElement = createDefaultTextNode(this.text.text);
            this.nativeElement.replaceWith(nativeElement);
            this.nativeElement = nativeElement;
            this.isEmpty = false;
            return;
        }
        if (!this.isEmpty && this.text.text === '') {
            const nativeElement = createEmptyOrVoidTextNode();
            this.nativeElement.replaceWith(nativeElement);
            this.nativeElement = nativeElement;
            this.isEmpty = true;
            return;
        }
        const stringNode = this.nativeElement.querySelector('[data-slate-string="true"]')!;
        stringNode.textContent = this.text.text;
    }
}

export const createTextAndLeafNode = (text: string) => {
    const nativeElement = document.createElement('span');
    nativeElement.setAttribute('data-slate-node', 'text');
    const leaf = document.createElement('span');
    nativeElement.appendChild(leaf);
    leaf.setAttribute('data-slate-leaf', 'true');
    return { nativeElement, leaf };
};

export const createDefaultTextNode = (text: string) => {
    const { nativeElement, leaf } = createTextAndLeafNode(text);
    const stringNode = document.createElement('span');
    leaf.appendChild(stringNode);
    stringNode.textContent = text;
    stringNode.setAttribute('data-slate-string', 'true');
    return nativeElement;
};

export const createEmptyOrVoidTextNode = () => {
    const { nativeElement, leaf } = createTextAndLeafNode('');
    const stringNode = document.createElement('span');
    leaf.appendChild(stringNode);
    stringNode.setAttribute('data-slate-string', 'true');
    stringNode.setAttribute('data-slate-zero-width', 'z');
    stringNode.setAttribute('data-slate-length', '0');
    const zeroWidthSpace = document.createTextNode('\uFEFF');
    stringNode.appendChild(zeroWidthSpace);
    return nativeElement;
};

export const createCompatibleTextNode = (text: string) => {
    const { nativeElement, leaf } = createTextAndLeafNode('');
    const stringNode = document.createElement('span');
    leaf.appendChild(stringNode);
    stringNode.setAttribute('data-slate-string', 'true');
    stringNode.textContent = text;
    const span = document.createElement('span');
    const zeroWidthSpace = document.createTextNode('\uFEFF');
    span.appendChild(zeroWidthSpace);
    stringNode.appendChild(zeroWidthSpace);
    return nativeElement;
};
