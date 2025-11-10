import { BaseLeafFlavour } from '../../view/flavour/leaf';
import { Text, Node } from 'slate';

export enum LeafType {
    'normalString' = 'normalString',
    'lineBreakEmptyString' = 'lineBreakEmptyString',
    'normalEmptyText' = 'normalEmptyText',
    'compatibleString' = 'compatibleString',
    'voidString' = 'voidString'
}

export class DefaultLeafFlavour extends BaseLeafFlavour {
    type: LeafType;

    // COMPAT: If the text is empty, it's because it's on the edge of an inline
    // node, so we render a zero-width space so that the selection can be
    // inserted next to it still.
    isEmptyText() {
        return this.context.leaf.text === '';
    }

    // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
    // so we need to add an extra trailing new lines to prevent that.
    isCompatibleString() {
        return this.context.isLast && this.context.leaf.text.slice(-1) === '\n';
    }

    // COMPAT: Render text inside void nodes with a zero-width space.
    // So the node can contain selection but the text is not visible.
    isVoid() {
        return this.viewContext.editor.isVoid(this.context.parent);
    }

    // COMPAT: If this is the last text node in an empty block, render a zero-
    // width space that will convert into a line break when copying and pasting
    // to support expected plain text.
    isLineBreakEmptyString() {
        return (
            this.context.leaf.text === '' &&
            this.context.parent.children[this.context.parent.children.length - 1] === this.context.text &&
            !this.viewContext.editor.isInline(this.context.parent) &&
            // [list-render] performance optimization: reduce the number of calls to the `Editor.string(editor, path)` method
            isEmpty(this.viewContext.editor, this.context.parent)
        );
    }

    createLeafNode(type: LeafType) {
        let newNativeElement: HTMLElement;
        switch (type) {
            case LeafType.lineBreakEmptyString:
                newNativeElement = createLineBreakEmptyStringDOM(this.getElementStringLength());
                break;
            case LeafType.voidString:
            case LeafType.normalEmptyText:
                newNativeElement = createEmptyOrVoidLeafNode();
                break;
            case LeafType.compatibleString:
                newNativeElement = createCompatibleLeafNode(this.leaf.text);
                break;
            case LeafType.normalString:
                newNativeElement = createDefaultLeafNode(this.leaf.text);
                break;
            default:
                newNativeElement = createDefaultLeafNode(this.leaf.text);
        }
        return newNativeElement;
    }

    render() {
        this.type = this.getType();
        this.nativeElement = this.createLeafNode(this.type);
    }

    getType() {
        if (this.isLineBreakEmptyString()) {
            return LeafType.lineBreakEmptyString;
        }
        if (this.isVoid()) {
            return LeafType.voidString;
        }
        if (this.isEmptyText()) {
            return LeafType.normalEmptyText;
        }
        if (this.isCompatibleString()) {
            return LeafType.compatibleString;
        }
        return LeafType.normalString;
    }

    rerender() {
        const type = this.getType();
        if (type !== this.type) {
            const newNativeElement = this.createLeafNode(type);
            this.nativeElement.replaceWith(newNativeElement);
            this.nativeElement = newNativeElement;
            this.type = type;
            return;
        }
        if (this.type === LeafType.normalString) {
            const stringNode = this.nativeElement.querySelector('[data-slate-string="true"]')!;
            stringNode.textContent = this.leaf.text;
        }
    }

    getElementStringLength() {
        return Node.string(this.context.parent).length;
    }
}

export const createLeafNode = () => {
    const leaf = document.createElement('span');
    leaf.setAttribute('data-slate-leaf', 'true');
    return { leaf };
};

export const createDefaultLeafNode = (text: string) => {
    const { leaf } = createLeafNode();
    const stringNode = document.createElement('span');
    leaf.appendChild(stringNode);
    stringNode.textContent = text;
    stringNode.setAttribute('data-slate-string', 'true');
    return leaf;
};

export const createEmptyOrVoidLeafNode = () => {
    const { leaf } = createLeafNode();
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
    const { leaf } = createLeafNode();
    const stringNode = document.createElement('span');
    leaf.appendChild(stringNode);
    stringNode.setAttribute('data-slate-string', 'true');
    stringNode.textContent = text;
    const span = document.createElement('span');
    const zeroWidthSpace = document.createTextNode('\uFEFF');
    span.setAttribute('data-slate-zero-width', '');
    span.appendChild(zeroWidthSpace);
    stringNode.appendChild(span);
    return leaf;
};

export const createLineBreakEmptyStringDOM = (elementStringLength: number) => {
    const { leaf } = createLeafNode();
    const stringNode = document.createElement('span');
    leaf.appendChild(stringNode);
    stringNode.setAttribute('data-slate-zero-width', 'n');
    stringNode.setAttribute('data-slate-length', `${elementStringLength}`);
    const zeroWidthSpace = document.createTextNode(`\uFEFF`);
    stringNode.appendChild(zeroWidthSpace);
    const brNode = document.createElement('br');
    stringNode.appendChild(brNode);
    return leaf;
};

/**
 * TODO: remove when bump slate
 * copy from slate
 * @param editor
 * @param element
 * @returns
 */
export const isEmpty = (editor, element) => {
    const { children } = element;
    const [first] = children;
    return children.length === 0 || (children.length === 1 && Text.isText(first) && first.text === '' && !editor.isVoid(element));
};
