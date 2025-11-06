import { BaseLeafFlavour } from '../../view/base-leaf';

export class DefaultLeafFlavour extends BaseLeafFlavour {
    isEmpty = false;

    render() {
        if (this.text.text === '') {
            this.isEmpty = true;
            this.nativeElement = createEmptyOrVoidLeafNode();
        } else {
            this.nativeElement = createDefaultLeafNode(this.text.text);
        }
    }

    rerender() {
        if (this.isEmpty && this.text.text !== '') {
            const nativeElement = createDefaultLeafNode(this.text.text);
            this.nativeElement.replaceWith(nativeElement);
            this.nativeElement = nativeElement;
            this.isEmpty = false;
            return;
        }
        if (!this.isEmpty && this.text.text === '') {
            const nativeElement = createEmptyOrVoidLeafNode();
            this.nativeElement.replaceWith(nativeElement);
            this.nativeElement = nativeElement;
            this.isEmpty = true;
            return;
        }
        const stringNode = this.nativeElement.querySelector('[data-slate-string="true"]')!;
        stringNode.textContent = this.text.text;
    }
}

export const createLeafNode = (text: string) => {
    const leaf = document.createElement('span');
    leaf.setAttribute('data-slate-leaf', 'true');
    return { leaf };
};

export const createDefaultLeafNode = (text: string) => {
    const { leaf } = createLeafNode(text);
    const stringNode = document.createElement('span');
    leaf.appendChild(stringNode);
    stringNode.textContent = text;
    stringNode.setAttribute('data-slate-string', 'true');
    return leaf;
};

export const createEmptyOrVoidLeafNode = () => {
    const { leaf } = createLeafNode('');
    const stringNode = document.createElement('span');
    leaf.appendChild(stringNode);
    stringNode.setAttribute('data-slate-string', 'true');
    stringNode.setAttribute('data-slate-zero-width', 'z');
    stringNode.setAttribute('data-slate-length', '0');
    const zeroWidthSpace = document.createTextNode('\uFEFF');
    stringNode.appendChild(zeroWidthSpace);
    return leaf;
};

export const createCompatibleLeafNode = (text: string) => {
    const { leaf } = createLeafNode('');
    const stringNode = document.createElement('span');
    leaf.appendChild(stringNode);
    stringNode.setAttribute('data-slate-string', 'true');
    stringNode.textContent = text;
    const span = document.createElement('span');
    const zeroWidthSpace = document.createTextNode('\uFEFF');
    span.appendChild(zeroWidthSpace);
    stringNode.appendChild(zeroWidthSpace);
    return leaf;
};
