import { Element } from 'slate';

export interface SlateVirtualScrollConfig {
    enabled?: boolean;
    scrollContainer?: HTMLElement;
    scrollTop: number;
    viewportHeight: number;
    viewportBoundingTop: number;
}

export interface VirtualViewResult {
    inViewportChildren: Element[];
    inViewportIndics: number[];
    top: number;
    bottom: number;
    heights: number[];
}
