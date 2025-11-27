import { DOMNode, DOMText, isDOMElement, isDOMNode } from 'slate-dom';

export const SlateFragmentAttributeKey = 'data-slate-angular-fragment';

/**
 * Get x-slate-fragment attribute from data-slate-angular-fragment
 */
const catchSlateFragment = /data-slate-angular-fragment="(.+?)"/m;
export const getSlateFragmentAttribute = (htmlData: string): string | void => {
    const [, fragment] = htmlData.match(catchSlateFragment) || [];
    return fragment;
};

/**
 * Check if a DOM node is an element node.
 */
export const isDOMText = (value: any): value is DOMText => {
    return isDOMNode(value) && value.nodeType === 3;
};

/**
 * Get a plaintext representation of the content of a node, accounting for block
 * elements which get a newline appended.
 *
 * The domNode must be attached to the DOM.
 */
export const getPlainText = (domNode: DOMNode) => {
    let text = '';

    if (isDOMText(domNode) && domNode.nodeValue) {
        return domNode.nodeValue;
    }

    if (isDOMElement(domNode)) {
        for (const childNode of Array.from(domNode.childNodes)) {
            text += getPlainText(childNode);
        }

        const display = getComputedStyle(domNode).getPropertyValue('display');

        if (display === 'block' || display === 'list' || domNode.tagName === 'BR') {
            text += '\n';
        }
    }

    return text;
};

/**
 * Get the dom selection from Shadow Root if possible, otherwise from the document
 */
export const getSelection = (root: Document | ShadowRoot): Selection | null => {
    if ((root as { getSelection: () => Selection }).getSelection != null) {
        return (root as { getSelection: () => Selection }).getSelection();
    }
    return document.getSelection();
};

export const getContentHeight = (element: Element) => {
    if (!element) return 0;
    const style = window.getComputedStyle(element);
    const boxSizing = style.boxSizing;
    const height = parseFloat(style.height) || 0;
    const paddingTop = parseFloat(style.paddingTop) || 0;
    const paddingBottom = parseFloat(style.paddingBottom) || 0;
    const totalPadding = paddingTop + paddingBottom;

    const borderTop = parseFloat(style.borderTopWidth) || 0;
    const borderBottom = parseFloat(style.borderBottomWidth) || 0;
    const totalBorder = borderTop + borderBottom;

    let contentHeight;
    if (boxSizing === 'border-box') {
        contentHeight = height - totalPadding - totalBorder;
    } else {
        contentHeight = height;
    }

    return Math.max(contentHeight, 0);
};

export const getZeroTextNode = (): DOMText => {
    return document.createTextNode('\uFEFF');
};