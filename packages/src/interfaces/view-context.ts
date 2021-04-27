import { NodeEntry, Range, Element, Ancestor, Text } from "slate";
import { SlateStringTemplateComponent } from "../components/string/template.component";
import { AngularEditor } from "../plugins/angular-editor";
import { ViewType } from "./view-base";

export interface SlateViewContext<T extends AngularEditor = AngularEditor> {
    editor: T;
    templateComponent: SlateStringTemplateComponent;
    readonly: boolean;
    renderElement?: (element: Element) => ViewType;
    renderLeaf?: (text: Text) => ViewType;
    renderText?: (text: Text) => ViewType;
    decorate?: (entry: NodeEntry) => Range[];
}

export interface SlateChildrenContext {
    parent: Ancestor;
    selection: Range;
    decorations: Range[];
}

export interface SlateElementContext<T extends Element = Element> {
    element: T;
    selection: Range | null;
    decorations: Range[];
    attributes: SlateElementAttributes;
}

export interface SlateTextContext {
    text: Text;
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
    'contenteditable'?: boolean;
    'data-slate-key'?: string;
    dir?: 'rtl';
}

export interface SlateStringContext {
    text: string;
    elementStringLength: number;
}