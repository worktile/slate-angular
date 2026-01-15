import { Element } from 'slate';
import { AngularEditor } from '../plugins/angular-editor';
import { SLATE_DEBUG_KEY, SLATE_DEBUG_KEY_SCROLL_TOP } from './environment';
import { ELEMENT_TO_COMPONENT } from './weak-maps';
import { BaseElementComponent } from '../view/base';
import { BaseElementFlavour } from '../view/flavour/element';
import { VirtualScrollDebugOverlay } from '../components/editable/debug';
import { getBlockCardByNativeElement } from '../components/block-card/block-card';

export const isDebug = localStorage.getItem(SLATE_DEBUG_KEY) === 'true';
export const isDebugScrollTop = localStorage.getItem(SLATE_DEBUG_KEY_SCROLL_TOP) === 'true';

export const ELEMENT_KEY_TO_HEIGHTS = new WeakMap<AngularEditor, Map<string, number>>();

export const EDITOR_TO_BUSINESS_TOP = new WeakMap<AngularEditor, number>();

export const EDITOR_TO_ROOT_NODE_WIDTH = new WeakMap<AngularEditor, number>();

export const EDITOR_TO_IS_FROM_SCROLL_TO = new WeakMap<AngularEditor, boolean>();

export const debugLog = (type: 'log' | 'warn', ...args: any[]) => {
    const doc = document;
    VirtualScrollDebugOverlay.log(doc, type, ...args);
};

export const cacheHeightByElement = (editor: AngularEditor, element: Element, height: number) => {
    if (!AngularEditor.isEnabledVirtualScroll(editor)) {
        return;
    }
    if (typeof height !== 'number') {
        console.error('cacheHeightByElement: height must be number', height);
        return;
    }
    const key = AngularEditor.findKey(editor, element);
    const heights = ELEMENT_KEY_TO_HEIGHTS.get(editor);
    heights.set(key.id, height);
};

export const setMinHeightByElement = (editor: AngularEditor, element: Element, rootElementMarginBottom) => {
    if (!AngularEditor.isEnabledVirtualScroll(editor)) {
        return;
    }
    const realHeight = getCachedHeightByElement(editor, element);
    if (realHeight) {
        const nativeElement = AngularEditor.toDOMNode(editor, element);
        const blockCard = getBlockCardByNativeElement(nativeElement);
        if (blockCard) {
            const minHeight = realHeight - rootElementMarginBottom;
            blockCard.style.minHeight = minHeight + 'px';
        }
    }
};

export const clearMinHeightByElement = (editor: AngularEditor, element: Element) => {
    if (!AngularEditor.isEnabledVirtualScroll(editor)) {
        return;
    }
    const nativeElement = AngularEditor.toDOMNode(editor, element);
    const blockCard = getBlockCardByNativeElement(nativeElement);
    if (blockCard && blockCard.style.minHeight) {
        blockCard.style.minHeight = '';
        return true;
    } else {
        return false;
    }
};

export const calcHeightByElement = (editor: AngularEditor, element: Element) => {
    const view = ELEMENT_TO_COMPONENT.get(element);
    if (!view) {
        return;
    }
    const height = (view as BaseElementComponent | BaseElementFlavour).calcHeight();
    cacheHeightByElement(editor, element, height);
    return height;
};

export const measureHeightByIndics = (editor: AngularEditor, indics: number[], force = false) => {
    let hasChanged = false;
    indics.forEach((index, i) => {
        const element = editor.children[index] as Element;
        const preHeight = getCachedHeightByElement(editor, element);
        if (preHeight && !force) {
            if (isDebug) {
                const height = calcHeightByElement(editor, element);
                if (height !== preHeight) {
                    debugLog('warn', 'calcHeightByElement: height not equal, index: ', index, 'preHeight: ', preHeight, 'height: ', height);
                }
            }
            return;
        }
        hasChanged = true;
        calcHeightByElement(editor, element);
    });
    return hasChanged;
};

export const getBusinessTop = (editor: AngularEditor) => {
    return EDITOR_TO_BUSINESS_TOP.get(editor) ?? 0;
};

export const getCachedHeightByElement = (editor: AngularEditor, element: Element) => {
    const heights = ELEMENT_KEY_TO_HEIGHTS.get(editor);
    const key = AngularEditor.findKey(editor, element);
    const height = heights?.get(key.id);
    if (typeof height === 'number') {
        return height;
    }
    if (heights?.has(key.id)) {
        console.error('getBlockHeight: invalid height value', key.id, height);
    }
    return null;
};

export const buildHeightsAndAccumulatedHeights = (editor: AngularEditor, visibleStates: boolean[]) => {
    const children = (editor.children || []) as Element[];
    const heights = new Array(children.length);
    const accumulatedHeights = new Array(children.length + 1);
    accumulatedHeights[0] = 0;
    for (let i = 0; i < children.length; i++) {
        const isVisible = visibleStates[i];
        let height = isVisible ? getCachedHeightByElement(editor, children[i]) : 0;
        if (height === null) {
            try {
                height = editor.getRoughHeight(children[i]);
            } catch (error) {
                console.error('buildHeightsAndAccumulatedHeights: getRoughHeight error', error);
            }
        }
        heights[i] = height;
        accumulatedHeights[i + 1] = accumulatedHeights[i] + height;
    }
    return { heights, accumulatedHeights };
};

export const calculateVirtualTopHeight = (editor: AngularEditor, startIndex: number, visibleStates: boolean[]) => {
    const { accumulatedHeights } = buildHeightsAndAccumulatedHeights(editor, visibleStates);
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
    const visibleStates = editor.getAllVisibleStates();
    const { accumulatedHeights } = buildHeightsAndAccumulatedHeights(editor, visibleStates);
    scrollTo((accumulatedHeights[anchorIndex] ?? 0) + getBusinessTop(editor));
    EDITOR_TO_IS_FROM_SCROLL_TO.set(editor, true);
    setTimeout(() => {
        console.log('scrollToElement: end scroll');
        EDITOR_TO_IS_FROM_SCROLL_TO.set(editor, false);
    }, 0);
};
