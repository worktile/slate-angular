import { Element } from 'slate';

export interface ClipboardData {
    files?: File[];
    elements?: Element[];
    text?: string;
    html?: string;
}

export type OriginEvent = 'drag' | 'copy' | 'cut';
