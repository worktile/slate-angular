import { Element } from 'slate';

export interface SlateVirtualScrollConfig {
    enabled?: boolean;
    scrollTop: number;
    viewportHeight: number;
    blockHeight?: number;
    bufferCount?: number;
}

export interface VirtualViewResult {
    renderedChildren: Element[];
    visibleIndexes: Set<number>;
    top: number;
    bottom: number;
    heights: number[];
}
