import { Element } from 'slate';
import { AngularEditor } from '../plugins/angular-editor';
import { SLATE_DEBUG_KEY, SLATE_DEBUG_KEY_SCROLL_TOP, SLATE_DEBUG_KEY_UPDATE } from './environment';
import { ELEMENT_TO_COMPONENT } from './weak-maps';
import { BaseElementComponent } from '../view/base';
import { BaseElementFlavour } from '../view/flavour/element';
import { VirtualScrollDebugOverlay } from '../components/editable/debug';
import { getBlockCardByNativeElement } from '../components/block-card/block-card';
import { roundTo } from './number';
import { SlateVirtualScrollConfig } from '../types/editable';

export const VIRTUAL_TOP_HEIGHT_CLASS_NAME = 'virtual-top-height';

export const VIRTUAL_BOTTOM_HEIGHT_CLASS_NAME = 'virtual-bottom-height';

export const VIRTUAL_CENTER_OUTLET_CLASS_NAME = 'virtual-center-outlet';

export const isDebug = localStorage.getItem(SLATE_DEBUG_KEY) === 'true';
export const isDebugScrollTop = localStorage.getItem(SLATE_DEBUG_KEY_SCROLL_TOP) === 'true';
export const isDebugUpdate = localStorage.getItem(SLATE_DEBUG_KEY_UPDATE) === 'true';

export const ELEMENT_KEY_TO_HEIGHTS = new WeakMap<AngularEditor, Map<string, number>>();

export const EDITOR_TO_BUSINESS_TOP = new WeakMap<AngularEditor, number>();

export const EDITOR_TO_VIRTUAL_SCROLL_CONFIG = new WeakMap<AngularEditor, SlateVirtualScrollConfig>();

export const EDITOR_TO_VIEWPORT_HEIGHT = new WeakMap<AngularEditor, number>();

export const EDITOR_TO_ROOT_NODE_WIDTH = new WeakMap<AngularEditor, number>();

export const EDITOR_TO_IS_FROM_SCROLL_TO = new WeakMap<AngularEditor, boolean>();

export const isValidNumber = (value: any) => {
    return typeof value === 'number' && !Number.isNaN(value);
};

export const debugLog = (type: 'log' | 'warn', ...args: any[]) => {
    const doc = document;
    VirtualScrollDebugOverlay.log(doc, type, ...args);
};

export const cacheHeightByElement = (editor: AngularEditor, element: Element, height: number) => {
    if (!AngularEditor.isEnabledVirtualScroll(editor)) {
        return;
    }
    if (!isValidNumber(height)) {
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
        const currentHeight = calcHeightByElement(editor, element);
        if (isValidNumber(currentHeight) && currentHeight !== preHeight) {
            hasChanged = true;
        }
        if (isDebug && isValidNumber(currentHeight)) {
            debugLog('log', 'measureHeightByIndics: index: ', index, 'preHeight: ', preHeight, 'height: ', currentHeight);
        }
    });
    return hasChanged;
};

export const getBusinessTop = (editor: AngularEditor) => {
    return EDITOR_TO_BUSINESS_TOP.get(editor) ?? 0;
};

export const getViewportHeight = (editor: AngularEditor) => {
    return EDITOR_TO_VIEWPORT_HEIGHT.get(editor) ?? window.innerHeight;
};

export const getScrollContainer = (editor: AngularEditor) => {
    const config = EDITOR_TO_VIRTUAL_SCROLL_CONFIG.get(editor);
    return config?.scrollContainer || document.body;
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

export const calculateAccumulatedTopHeight = (editor: AngularEditor, startIndex: number, visibleStates: boolean[]) => {
    const { accumulatedHeights } = buildHeightsAndAccumulatedHeights(editor, visibleStates);
    const virtualTopHeight = roundTo(accumulatedHeights[startIndex] ?? 0, 1);
    return virtualTopHeight;
};

export const calcBusinessTop = (editor: AngularEditor) => {
    const editable = AngularEditor.toDOMNode(editor, editor);
    const virtualTopElement = editable.querySelector(`.${VIRTUAL_TOP_HEIGHT_CLASS_NAME}`) as HTMLElement;
    const virtualTopBoundingTop = virtualTopElement?.getBoundingClientRect()?.top ?? 0;
    const virtualScrollConfig = EDITOR_TO_VIRTUAL_SCROLL_CONFIG.get(editor);
    const scrollContainer = virtualScrollConfig?.scrollContainer;
    const viewportBoundingTop = scrollContainer?.getBoundingClientRect()?.top ?? 0;
    const businessTop = Math.ceil(virtualTopBoundingTop) + Math.ceil(virtualScrollConfig.scrollTop) - Math.floor(viewportBoundingTop);
    EDITOR_TO_BUSINESS_TOP.set(editor, businessTop);
    if (isDebug) {
        debugLog('log', 'calcBusinessTop: ', businessTop);
        virtualTopElement.setAttribute('data-business-top', businessTop.toString());
    }
    console.log(
        'virtualTopBoundingTop: ',
        virtualTopBoundingTop,
        'virtualScrollConfig.scrollTop: ',
        virtualScrollConfig.scrollTop,
        'viewportBoundingTop: ',
        viewportBoundingTop
    );
    return businessTop;
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
    let businessTop = getBusinessTop(editor);
    if (businessTop === 0) {
        businessTop = calcBusinessTop(editor);
    }
    scrollTo((accumulatedHeights[anchorIndex] ?? 0) + businessTop);
    EDITOR_TO_IS_FROM_SCROLL_TO.set(editor, true);
    setTimeout(() => {
        console.log('scrollToElement: end scroll');
        EDITOR_TO_IS_FROM_SCROLL_TO.set(editor, false);
    }, 0);
};
