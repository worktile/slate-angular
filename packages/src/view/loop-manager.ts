import { Ancestor, Descendant, Range, Editor, Element } from 'slate';
import { ViewType } from '../types/view';
import { isComponentType, isTemplateRef } from '../utils/view';
import { SlateChildrenContext, SlateElementContext, SlateLeafContext, SlateTextContext, SlateViewContext } from './context';
import { ComponentRef, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { AngularEditor } from '../plugins/angular-editor';
import { SlateErrorCode } from '../types/error';
import { BaseEmbeddedView } from './types';
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps';

type Context = SlateLeafContext | SlateTextContext | SlateElementContext;

export interface ViewLoopOptions<T = Context> {
    getViewType: (item: Descendant, parent: Ancestor) => ViewType;
    viewContext: SlateViewContext;
    viewContainerRef: ViewContainerRef;
    getContext: (index: number, item: Descendant, parent: Ancestor, childrenContext: SlateChildrenContext) => T;
    itemCallback: (index: number, item: Descendant, parent: Ancestor) => void;
}

/**
 * descendant、leaf
 */
export class ViewLoopManager<T = Context> {
    private childrenViews: (EmbeddedViewRef<any> | ComponentRef<any>)[] = [];
    private childrenContexts: T[] = [];
    private mounted = false;

    constructor(private options: ViewLoopOptions<T>) {}

    initialize(children: Descendant[], parent: Ancestor, childrenContext: SlateChildrenContext) {
        children.forEach((descendant, index) => {
            this.options.itemCallback(index, descendant, parent);
            const context = this.options.getContext(index, descendant, parent, childrenContext);
            const view = this.createEmbeddedViewOrComponent(descendant, parent, context);
            this.childrenViews.push(view);
            this.childrenContexts.push(context);
        });
    }

    mount(nativeElement: HTMLElement) {
        if (!this.mounted) {
            this.mounted = true;
            if (this.childrenViews.length > 0) {
                nativeElement.append(...this.createFragment());
            }
        }
    }

    private createEmbeddedViewOrComponent(item: Descendant, parent: Ancestor, context: T) {
        const viewType = this.options.getViewType(item, parent);
        if (isTemplateRef(viewType)) {
            const embeddedViewContext = {
                context,
                viewContext: this.options.viewContext
            };
            const embeddedViewRef = this.options.viewContainerRef.createEmbeddedView<BaseEmbeddedView<any>>(
                viewType as TemplateRef<BaseEmbeddedView<any, AngularEditor>>,
                embeddedViewContext
            );
            return embeddedViewRef;
        }
        if (isComponentType(viewType)) {
            const componentRef = this.options.viewContainerRef.createComponent(viewType) as ComponentRef<any>;
            componentRef.instance.viewContext = this.options.viewContext;
            componentRef.instance.context = context;
            return componentRef;
        }
    }

    private getRootNodes(ref: EmbeddedViewRef<any> | ComponentRef<any>): HTMLElement[] {
        if (ref instanceof ComponentRef) {
            return [ref.instance.nativeElement];
        } else {
            return [ref.rootNodes[0]];
        }
        return [];
    }

    private createFragment() {
        const result = [];
        this.childrenViews.forEach((component, index) => {
            result.push(...this.getRootNodes(component));
        });
        return result;
    }
}

export function getContext(
    index: number,
    item: Descendant,
    parent: Ancestor,
    viewContext: SlateViewContext,
    childrenContext: SlateChildrenContext
): SlateElementContext | SlateTextContext {
    if (Element.isElement(item)) {
        const computedContext = getCommonContext(index, item, parent, viewContext, childrenContext);
        const key = AngularEditor.findKey(viewContext.editor, item);
        const isInline = viewContext.editor.isInline(item);
        const isVoid = viewContext.editor.isVoid(item);
        const elementContext: SlateElementContext = {
            element: item,
            ...computedContext,
            attributes: {
                'data-slate-node': 'element',
                'data-slate-key': key.id
            },
            decorate: childrenContext.decorate,
            readonly: childrenContext.readonly
        };
        if (isInline) {
            elementContext.attributes['data-slate-inline'] = true;
        }
        if (isVoid) {
            elementContext.attributes['data-slate-void'] = true;
            elementContext.attributes.contenteditable = false;
        }
        return elementContext;
    } else {
        const computedContext = getCommonContext(index, item, parent, viewContext, childrenContext);
        const isLeafBlock = AngularEditor.isLeafBlock(viewContext.editor, childrenContext.parent);
        const textContext: SlateTextContext = {
            decorations: computedContext.decorations,
            isLast: isLeafBlock && index === childrenContext.parent.children.length - 1,
            parent: childrenContext.parent as Element,
            text: item
        };
        return textContext;
    }
}

export function getCommonContext(
    index: number,
    item: Descendant,
    parent: Ancestor,
    viewContext: SlateViewContext,
    childrenContext: SlateChildrenContext
): { selection: Range; decorations: Range[] } {
    const path = AngularEditor.findPath(viewContext.editor, parent);
    const p = path.concat(index);
    try {
        const range = Editor.range(viewContext.editor, p);
        const sel = childrenContext.selection && Range.intersection(range, childrenContext.selection);
        const ds = childrenContext.decorate([item, p]);
        for (const dec of childrenContext.decorations) {
            const d = Range.intersection(dec, range);
            if (d) {
                ds.push(d);
            }
        }
        return { selection: sel, decorations: ds };
    } catch (error) {
        this.options.viewContext.editor.onError({
            code: SlateErrorCode.GetStartPointError,
            nativeError: error
        });
        return { selection: null, decorations: [] };
    }
}

export function createLoopManager(viewContext: SlateViewContext, viewContainerRef: ViewContainerRef) {
    return new ViewLoopManager({
        getViewType: (item: Descendant, parent: Ancestor) => {
            if (Element.isElement(item)) {
                return (viewContext.renderElement && viewContext.renderElement(item)) || viewContext.defaultElement;
            } else {
                const isVoid = viewContext.editor.isVoid(parent as Element);
                return isVoid
                    ? viewContext.defaultVoidText
                    : (viewContext.renderText && viewContext.renderText(item)) || viewContext.defaultText;
            }
        },
        viewContext,
        viewContainerRef,
        getContext: (index: number, item: Descendant, parent: Ancestor, childrenContext: SlateChildrenContext) =>
            getContext(index, item, parent, viewContext, childrenContext),
        itemCallback: (index: number, item: Descendant, parent: Ancestor) => {
            NODE_TO_INDEX.set(item, index);
            NODE_TO_PARENT.set(item, parent);
        }
    });
}

/**
 * string 的场景
 */
export class ViewManager {}
