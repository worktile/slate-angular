import { BaseRange, Text } from 'slate';

export interface SlatePlaceholder extends BaseRange {
    placeholder: string;
}

export type TextWithPlaceholder = Text & { placeholder?: string };
