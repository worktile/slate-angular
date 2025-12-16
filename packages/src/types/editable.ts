import { Element } from 'slate';

export interface SlateVirtualScrollConfig {
    enabled?: boolean;
    scrollTop: number;
    viewportHeight: number;
    blockHeight?: number;
    bufferCount?: number;
    anchorKey?: string;
}

export interface SlateVirtualScrollToAnchorConfig {
    anchorElement: Element;
    scrollTo: (scrollTop: number) => void;
}

export interface VirtualViewResult {
    inViewportChildren: Element[];
    visibleIndexes: Set<number>;
    top: number;
    bottom: number;
    heights: number[];
}
