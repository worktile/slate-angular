import { SlateLeafContext } from '../../view/context';
import { SlateViewContext } from '../../view/context';
import { Text, Node } from 'slate';
import { getZeroTextNode } from '../../utils/dom';

export enum StringType {
    'normalString' = 'normalString',
    'lineBreakEmptyString' = 'lineBreakEmptyString',
    'normalEmptyText' = 'normalEmptyText',
    'compatibleString' = 'compatibleString',
    'voidString' = 'voidString'
}

export class SlateStringRender {
    nativeElement: HTMLElement;

    constructor(
        public context: SlateLeafContext,
        public viewContext: SlateViewContext
    ) {}

    type: StringType;

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

    get leaf(): Text {
        return this.context && this.context.leaf;
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

    createStringNode(type: StringType) {
        let newNativeElement: HTMLElement;
        switch (type) {
            case StringType.lineBreakEmptyString:
                newNativeElement = createLineBreakEmptyStringDOM(this.getElementStringLength());
                break;
            case StringType.voidString:
            case StringType.normalEmptyText:
                newNativeElement = createEmptyOrVoidStringNode();
                break;
            case StringType.compatibleString:
                newNativeElement = createCompatibleStringNode(this.leaf.text);
                break;
            case StringType.normalString:
                newNativeElement = createDefaultStringNode(this.leaf.text);
                break;
            default:
                newNativeElement = createDefaultStringNode(this.leaf.text);
        }
        return newNativeElement;
    }

    render() {
        this.type = this.getType();
        this.nativeElement = this.createStringNode(this.type);
        return this.nativeElement;
    }

    getType() {
        if (this.isLineBreakEmptyString()) {
            return StringType.lineBreakEmptyString;
        }
        if (this.isVoid()) {
            return StringType.voidString;
        }
        if (this.isEmptyText()) {
            return StringType.normalEmptyText;
        }
        if (this.isCompatibleString()) {
            return StringType.compatibleString;
        }
        return StringType.normalString;
    }

    update(context: SlateLeafContext, viewContext: SlateViewContext) {
        this.context = context;
        this.viewContext = viewContext;
        const type = this.getType();
        if (type !== this.type) {
            const newNativeElement = this.createStringNode(type);
            this.nativeElement.replaceWith(newNativeElement);
            this.nativeElement = newNativeElement;
            this.type = type;
            return;
        }
        if (this.type === StringType.normalString) {
            this.nativeElement.textContent = this.leaf.text;
        }
        if (this.type === StringType.compatibleString) {
            updateCompatibleStringNode(this.nativeElement, this.leaf.text);
        }
    }

    getElementStringLength() {
        return Node.string(this.context.parent).length;
    }
}

export const createDefaultStringNode = (text: string) => {
    const stringNode = document.createElement('span');
    stringNode.textContent = text;
    stringNode.setAttribute('data-slate-string', 'true');
    stringNode.setAttribute('editable-text', '');
    return stringNode;
};

export const createEmptyOrVoidStringNode = () => {
    const stringNode = document.createElement('span');
    stringNode.setAttribute('data-slate-string', 'true');
    stringNode.setAttribute('data-slate-zero-width', 'z');
    stringNode.setAttribute('data-slate-length', '0');
    const zeroWidthSpace = getZeroTextNode();
    stringNode.appendChild(zeroWidthSpace);
    stringNode.setAttribute('editable-text', '');
    return stringNode;
};

export const createCompatibleStringNode = (text: string) => {
    const stringNode = document.createElement('span');
    stringNode.setAttribute('data-slate-string', 'true');
    stringNode.textContent = text;
    stringNode.setAttribute('editable-text', '');
    const zeroWidthSpan = document.createElement('span');
    const zeroWidthSpace = getZeroTextNode();
    zeroWidthSpan.setAttribute('data-slate-zero-width', '');
    zeroWidthSpan.appendChild(zeroWidthSpace);
    stringNode.appendChild(zeroWidthSpan);
    return stringNode;
};

export const updateCompatibleStringNode = (stringNode: HTMLSpanElement, text: string) => {
    const zeroWidthSpan = stringNode.querySelector('span');
    stringNode.textContent = text;
    stringNode.appendChild(zeroWidthSpan);
    return stringNode;
};

export const createLineBreakEmptyStringDOM = (elementStringLength: number) => {
    const stringNode = document.createElement('span');
    stringNode.setAttribute('data-slate-zero-width', 'n');
    stringNode.setAttribute('data-slate-length', `${elementStringLength}`);
    const zeroWidthSpace = getZeroTextNode();
    stringNode.appendChild(zeroWidthSpace);
    const brNode = document.createElement('br');
    stringNode.appendChild(brNode);
    stringNode.setAttribute('editable-text', '');
    return stringNode;
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
