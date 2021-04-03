import { BaseRange, BaseText, BaseElement } from 'slate'

declare module 'slate' {
    interface CustomTypes {
        Element: { type: string } & BaseElement
    }
}