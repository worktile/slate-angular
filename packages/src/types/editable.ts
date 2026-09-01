import { Element } from 'slate';

export interface SlateVirtualScrollConfig {
    enabled?: boolean;
    scrollContainer?: HTMLElement | null;
    scrollTop: number;
}

export interface VirtualViewResult {
    inViewportChildren: Element[];
    inViewportIndics: number[];
    top: number;
    bottom: number;
    heights: number[];
    accumulatedHeights?: number[];
}
