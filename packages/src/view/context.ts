import { NodeEntry, Range, Element, Ancestor, Text, Path } from 'slate';
import { SlateStringTemplate } from '../components/string/template.component';
import { AngularEditor } from '../plugins/angular-editor';
import { ComponentType, ViewType } from '../types/view';
import { BaseElementComponent, BaseLeafComponent, BaseTextComponent } from './base';

export interface SlateViewContext<T extends AngularEditor = AngularEditor> {
    editor: T;
    templateComponent: SlateStringTemplate;
    defaultElement: ComponentType<BaseElementComponent>;
    defaultText: ComponentType<BaseTextComponent>;
    defaultVoidText: ComponentType<BaseTextComponent>;
    defaultLeaf: ComponentType<BaseLeafComponent>;
    trackBy: (element: Element) => any;
    renderElement?: (element: Element) => ViewType;
    renderLeaf?: (text: Text) => ViewType;
    renderText?: (text: Text) => ViewType;
    isStrictDecorate: boolean;
}

export interface SlateChildrenContext {
    parent: Ancestor;
    selection: Range;
    decorations: Range[];
    decorate: (entry: NodeEntry) => Range[];
    readonly: boolean;
}

export interface SlateElementContext<T extends Element = Element> {
    element: T;
    selection: Range | null;
    decorations: Range[];
    attributes: SlateElementAttributes;
    decorate: (entry: NodeEntry) => Range[];
    readonly: boolean;
}

export interface SlateTextContext<T extends Text = Text> {
    text: T;
    decorations: Range[];
    isLast: boolean;
    parent: Element;
}

export interface SlateLeafContext {
    leaf: Text;
    text: Text;
    parent: Element;
    isLast: boolean;
    index: number;
}

export interface SlateElementAttributes {
    'data-slate-node': 'element';
    'data-slate-void'?: boolean;
    'data-slate-inline'?: boolean;
    contenteditable?: boolean;
    'data-slate-key'?: string;
    dir?: 'rtl';
}

export interface SlateStringContext {
    text: string;
    elementStringLength: number;
    type: 'string' | 'lineBreakEmptyString';
}
