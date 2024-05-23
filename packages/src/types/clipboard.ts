import { Element } from 'slate';

export interface ClipboardData {
    files?: File[];
    elements?: Element[];
    text?: string;
}

export type OriginEvent = 'drag' | 'copy' | 'cut';