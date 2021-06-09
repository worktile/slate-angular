import { DOMNode, DOMSelection } from "./dom";

export const FAKE_LEFT_BLOCK_CARD_OFFSET = -1;

export const FAKE_RIGHT_BLOCK_CARD_OFFSET = -2;

export function hasBlockCardWithNode(node: DOMNode) {
    return node && (node.parentElement.hasAttribute('card-target') || (node instanceof HTMLElement && node.hasAttribute('card-target')));
}

export function hasBlockCard(selection: DOMSelection) {
    return hasBlockCardWithNode(selection?.anchorNode) || hasBlockCardWithNode(selection?.focusNode);
}

export function getCardTargetAttribute(node: DOMNode) {
    return node.parentElement.attributes['card-target'] || (node instanceof HTMLElement && node.attributes['card-target']);
}

export function isCardLeft(node: DOMNode) {
    const cardTarget = getCardTargetAttribute(node);
    return cardTarget && cardTarget.nodeValue === 'card-left';
}

export function isCardLeftByTargetAttr(targetAttr: any) {
    return targetAttr && targetAttr.nodeValue === 'card-left';
}

export function isCardRightByTargetAttr(targetAttr: any) {
    return targetAttr && targetAttr.nodeValue === 'card-right';
}

export function isCardCenterByTargetAttr(targetAttr: any) {
    return targetAttr && targetAttr.nodeValue === 'card-center';
}
