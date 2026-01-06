import { Element } from 'slate';
import { AngularEditor } from '../plugins/angular-editor';
import { SLATE_DEBUG_KEY, SLATE_DEBUG_KEY_SCROLL_TOP, VIRTUAL_SCROLL_DEFAULT_BLOCK_HEIGHT } from './environment';
import { ELEMENT_TO_COMPONENT } from './weak-maps';
import { BaseElementComponent } from '../view/base';
import { BaseElementFlavour } from '../view/flavour/element';
import { VirtualScrollDebugOverlay } from '../components/editable/debug';

export const isDebug = localStorage.getItem(SLATE_DEBUG_KEY) === 'true';
export const isDebugScrollTop = localStorage.getItem(SLATE_DEBUG_KEY_SCROLL_TOP) === 'true';

export const ELEMENT_KEY_TO_HEIGHTS = new WeakMap<AngularEditor, Map<string, number>>();

export const EDITOR_TO_BUSINESS_TOP = new WeakMap<AngularEditor, number>();

export const debugLog = (type: 'log' | 'warn', ...args: any[]) => {
    const doc = document;
    VirtualScrollDebugOverlay.log(doc, type, ...args);
};

export const measureHeightByElement = (editor: AngularEditor, element: Element) => {
    const key = AngularEditor.findKey(editor, element);
    const view = ELEMENT_TO_COMPONENT.get(element);
    if (!view) {
        return;
    }
    const ret = (view as BaseElementComponent | BaseElementFlavour).getRealHeight();
    const heights = ELEMENT_KEY_TO_HEIGHTS.get(editor);
    heights.set(key.id, ret as number);
    return ret as number;
};

export const measureHeightByIndics = (editor: AngularEditor, indics: number[], force = false) => {
    let hasChanged = false;
    indics.forEach((index, i) => {
        const element = editor.children[index] as Element;
        const preHeight = getRealHeightByElement(editor, element, 0);
        if (preHeight && !force) {
            if (isDebug) {
                const height = measureHeightByElement(editor, element);
                if (height !== preHeight) {
                    debugLog(
                        'warn',
                        'measureHeightByElement: height not equal, index: ',
                        index,
                        'preHeight: ',
                        preHeight,
                        'height: ',
                        height
                    );
                }
            }
            return;
        }
        hasChanged = true;
        measureHeightByElement(editor, element);
    });
    return hasChanged;
};

export const getBusinessTop = (editor: AngularEditor) => {
    return EDITOR_TO_BUSINESS_TOP.get(editor) ?? 0;
};

export const getRealHeightByElement = (
    editor: AngularEditor,
    element: Element,
    defaultHeight: number = VIRTUAL_SCROLL_DEFAULT_BLOCK_HEIGHT,
    isVisible?: boolean
) => {
    const visible = isVisible ?? editor.isVisible(element);
    if (!visible) {
        return 0;
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
    const visibles = new Array(children.length);
    const accumulatedHeights = new Array(children.length + 1);
    accumulatedHeights[0] = 0;
    for (let i = 0; i < children.length; i++) {
        const isVisible = editor.isVisible(children[i]);
        visibles[i] = isVisible;
        const height = getRealHeightByElement(editor, children[i], VIRTUAL_SCROLL_DEFAULT_BLOCK_HEIGHT, isVisible);
        heights[i] = height;
        accumulatedHeights[i + 1] = accumulatedHeights[i] + height;
    }
    return { heights, accumulatedHeights, visibles };
};

export const calculateVirtualTopHeight = (editor: AngularEditor, startIndex: number) => {
    const { accumulatedHeights } = buildHeightsAndAccumulatedHeights(editor);
    return accumulatedHeights[startIndex] ?? 0;
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
