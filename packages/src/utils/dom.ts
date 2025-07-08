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
