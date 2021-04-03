import { BaseRange, BaseText, BaseElement } from 'slate'
import { AngularEditor } from '../plugin/angular-editor';

declare module 'slate' {
    interface CustomTypes {
        Editor: AngularEditor;
        Element: { type: string } & BaseElement
    }
}