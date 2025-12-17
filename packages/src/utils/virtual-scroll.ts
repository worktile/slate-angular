import { Element } from 'slate';
import { AngularEditor } from '../plugins/angular-editor';
import { VIRTUAL_SCROLL_DEFAULT_BLOCK_HEIGHT } from './environment';

export const ELEMENT_KEY_TO_HEIGHTS = new WeakMap<AngularEditor, Map<string, number>>();

export const EDITOR_TO_BUSINESS_TOP = new WeakMap<AngularEditor, number>();

export const getBusinessTop = (editor: AngularEditor) => {
    return EDITOR_TO_BUSINESS_TOP.get(editor) ?? 0;
};

export const getRealHeightByElement = (
    editor: AngularEditor,
    element: Element,
    defaultHeight: number = VIRTUAL_SCROLL_DEFAULT_BLOCK_HEIGHT
) => {
    const isVisible = editor.isVisible(element);
    if (!isVisible) {
        return 0;
    }
    if (!element) {
        return defaultHeight;
    }
    const heights = ELEMENT_KEY_TO_HEIGHTS.get(editor);
    const key = AngularEditor.findKey(editor, element);
    const height = heights?.get(key.id);
    if (typeof height === 'number') {
        return height;
    }
    if (heights?.has(key.id)) {
        console.error('getBlockHeight: invalid height value', key.id, height);
    }
    return defaultHeight;
};

export const buildHeightsAndAccumulatedHeights = (editor: AngularEditor) => {
    const children = (editor.children || []) as Element[];
    const heights = new Array(children.length);
    const accumulatedHeights = new Array(children.length + 1);
    accumulatedHeights[0] = 0;
    for (let i = 0; i < children.length; i++) {
        const height = getRealHeightByElement(editor, children[i]);
        heights[i] = height;
        accumulatedHeights[i + 1] = accumulatedHeights[i] + height;
    }
    return { heights, accumulatedHeights };
};

export const scrollToElement = (editor: AngularEditor, element: Element, scrollTo: (scrollTop: number) => void) => {
    const children = editor.children;
    if (!children.length) {
        return;
    }
    const anchorIndex = children.findIndex(item => item === element);
    if (anchorIndex < 0) {
        return;
    }

    const { accumulatedHeights } = buildHeightsAndAccumulatedHeights(editor);
    scrollTo((accumulatedHeights[anchorIndex] ?? 0) + getBusinessTop(editor));
};
