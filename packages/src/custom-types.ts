import { BaseElement, BaseRange, BaseText } from 'slate'
import { AngularEditor } from './plugin/angular-editor';

declare module 'slate' {
  interface CustomTypes {
    Editor: AngularEditor;
    Element: BaseElement & { type?: string; key?: string; };
  }
}
