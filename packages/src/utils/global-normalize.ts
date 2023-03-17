import { Descendant, Element, Text } from 'slate';

const isValid = (value: Descendant) =>
    (Element.isElement(value) && value.children.length > 0 && (value.children as Descendant[]).every(child => isValid(child))) ||
    Text.isText(value);

const check = (document: Element[]) => {
    return document.every(value => Element.isElement(value) && isValid(value));
};

function normalize(document: Element[]) {
    return document.filter(value => Element.isElement(value) && isValid(value));
}

export { normalize, check, isValid };
