import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { Element as SlateElement, Range as SlateRange, Text as SlateText, Editor, Ancestor, Element } from 'slate';
import { Key } from '../utils/key';
import { ComponentAttributes } from '../core/component.base';

type ViewRefType = TemplateRef<any> | ComponentType<any>;

interface ViewElement {
    viewRef: ViewRefType;
    context: ViewElementContext;
    key: Key;
}

const ViewElement = {
    isViewElement(value: any): value is ViewElement {
        return value && value.context && value.context.element && SlateElement.isElement(value.context.element);
    }
};

interface ViewText {
    viewRef: ViewRefType;
    context: ViewTextContext;
    key: Key;
}

const ViewText = {
    isViewText(value: any): value is ViewText {
        return value && value.context && value.context.text && SlateText.isText(value.context.text);
    },
    isLeafBlock(editor: Editor, node: Ancestor) {
        return SlateElement.isElement(node) && !editor.isInline(node) && Editor.hasInlines(editor, node);
    }
};

type ViewNode = ViewElement | ViewText;

export interface ViewElementContext<T extends SlateElement = SlateElement, K extends Editor = Editor> {
    element: T;
    selection: SlateRange | null;
    children: (ViewElement | ViewText)[];
    attributes: ComponentAttributes;
    editor: K;
    decorations: SlateRange[];
    isInline: boolean;
    isBlockCard: boolean;
    readonly: boolean;
}

export interface ViewTextContext<K extends Editor = Editor>  {
    text: SlateText;
    parent: Element;
    index: number;
    editor: K;
    decorations: SlateRange[];
    renderLeaf?: (text: SlateText) => TemplateRef<any>;
}

export { ViewElement, ViewText, ViewNode, ViewRefType };
