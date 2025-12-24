import { Element } from 'slate';

export interface SlateVirtualScrollConfig {
    enabled?: boolean;
    scrollTop: number;
    viewportHeight: number;
    viewportBoundingTop: number;
}

export interface VirtualViewResult {
    inViewportChildren: Element[];
    visibleIndexes: number[];
    top: number;
    bottom: number;
    heights: number[];
}
