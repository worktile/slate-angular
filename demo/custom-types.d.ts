import {
    Descendant,
    BaseEditor,
} from 'slate'
import { AngularEditor } from 'slate-angular';

export type BlockQuoteElement = { type: 'block-quote'; children: Descendant[] }

export type BulletedListElement = {
    type: 'bulleted-list'
    children: Descendant[]
}

export type NumberedListElement = {
    type: 'numbered-list'
    children: Descendant[]
}

export type CheckListItemElement = {
    type: 'check-list-item'
    checked: boolean
    children: Descendant[]
}

export type EditableVoidElement = {
    type: 'editable-void'
    children: EmptyText[]
}

export type HeadingOneElement = { type: 'heading-one'; children: Descendant[] }
export type HeadingTwoElement = { type: 'heading-two'; children: Descendant[] }
export type HeadingThreeElement = { type: 'heading-three'; children: Descendant[] }
export type HeadingFourElement = { type: 'heading-four'; children: Descendant[] }
export type HeadingFiveElement = { type: 'heading-five'; children: Descendant[] }
export type HeadingSixElement = { type: 'heading-six'; children: Descendant[] }

export type ImageElement = {
    type: 'image'
    url: string
    children: EmptyText[]
}

export type LinkElement = { type: 'link'; url: string; children: Descendant[] }

export type ListItemElement = { type: 'list-item'; children: Descendant[] }

export type MentionElement = {
    type: 'mention'
    character: string
    children: CustomText[]
}

export type ParagraphElement = { type: 'paragraph'; children: Descendant[] }

export type TableElement = { type: 'table'; children: TableRowElement[] }

export type TableCellElement = { type: 'table-cell'; children: Descendant[] }

export type TableRowElement = { type: 'table-row'; children: TableCellElement[] }

export type TitleElement = { type: 'title'; children: Descendant[] }

// export type VideoElement = { type: 'video'; url: string; children: EmptyText[] }

type CustomElement =
    | BlockQuoteElement
    | NumberedListElement
    | BulletedListElement
    | CheckListItemElement
    | EditableVoidElement
    | HeadingOneElement
    | HeadingTwoElement
    | HeadingThreeElement
    | HeadingFourElement
    | HeadingFiveElement
    | HeadingSixElement
    | ImageElement
    | LinkElement
    | ListItemElement
    | MentionElement
    | ParagraphElement
    | TableElement
    | TableRowElement
    | TableCellElement
    | TitleElement
// | VideoElement

export type CustomText = {
    bold?: boolean
    italic?: boolean
    code?: boolean
    text: string
}

export type EmptyText = {
    text: string
}

export type CustomEditor = BaseEditor & AngularEditor

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText | EmptyText
    }
}
