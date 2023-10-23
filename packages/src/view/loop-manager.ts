import { Ancestor, Descendant, Range, Editor, Element, Text } from 'slate';
import { ViewType } from '../types/view';
import { isComponentType, isTemplateRef } from '../utils/view';
import { SlateChildrenContext, SlateElementContext, SlateLeafContext, SlateTextContext, SlateViewContext } from './context';
import {
    ApplicationRef,
    ComponentRef,
    EmbeddedViewRef,
    IterableDiffer,
    IterableDiffers,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { AngularEditor } from '../plugins/angular-editor';
import { SlateErrorCode } from '../types/error';
import { BaseEmbeddedView } from './types';
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps';
import { isDecoratorRangeListEqual } from '../utils/range-list';

type Context = SlateLeafContext | SlateTextContext | SlateElementContext;

type ParentContext = SlateChildrenContext | SlateTextContext;

export enum ViewLevel {
    node,
    leaf
}

export interface ViewLoopOptions<T = Context, K = ParentContext> {
    getViewType: (item: Descendant, parent: Ancestor) => ViewType;
    viewContext: SlateViewContext;
    viewContainerRef: ViewContainerRef;
    getContext: (index: number, item: Descendant, childrenContext?: K, parent?: Ancestor) => T;
    itemCallback: (index: number, item: Descendant, parent?: Ancestor) => void;
    trackBy: (index, node) => any;
    getHost: () => HTMLElement;
}

/**
 * descendant、leaf
 */
export class ViewLoopManager<T = Context, K = ParentContext> {
    private children: Descendant[];
    private childrenViews: (EmbeddedViewRef<any> | ComponentRef<any>)[] = [];
    private childrenContexts: T[] = [];
    private viewTypes: ViewType[] = [];
    public mounted = false;
    public initialized = false;
    public differ: IterableDiffer<any>;

    constructor(private viewLevel: ViewLevel, private options: ViewLoopOptions<T, K>, private differs: IterableDiffers) {}

    initialize(children: Descendant[], parent?: Ancestor, parentContext?: K) {
        this.children = children;
        this.initialized = true;
        children.forEach((descendant, index) => {
            this.options.itemCallback(index, descendant, parent);
            const context = this.options.getContext(index, descendant, parentContext, parent);
            const viewType = this.options.getViewType(descendant, parent);
            const view = this.createEmbeddedViewOrComponent(viewType, descendant, parent, context);
            this.childrenViews.push(view);
            this.childrenContexts.push(context);
            this.viewTypes.push(viewType);
        });
        this.differ = this.differs.find(children).create(this.options.trackBy);
        this.differ.diff(children);
    }

    mount() {
        const nativeElement = this.options.getHost();
        if (this.initialized && !this.mounted) {
            this.mounted = true;
            if (this.childrenViews.length > 0) {
                nativeElement.append(...this.createFragment());
            }
        }
    }

    doCheck(children: Descendant[], parent?: Ancestor, parentContext?: K) {
        if (children === this.children) {
            return;
        }
        const res = this.differ.diff(children);
        if (res) {
            res.forEachIdentityChange(record => {
                if (this.viewLevel === ViewLevel.node) {
                    this.options.itemCallback(record.currentIndex, record.item, parent);
                }
                this.updateView(record.previousIndex, record.currentIndex, record.item, parent, parentContext);
                console.log('forEachIdentityChange', record);
            });
            res.forEachRemovedItem(record => {
                // console.log('forEachRemovedItem', record);
                const view = this.childrenViews[record.previousIndex];
                view.destroy();
            });
            res.forEachRemovedItem(record => {
                // console.log('forEachRemovedItem', record);
                this.removeView(record.previousIndex);
            });
            const addIndex: number[] = [];
            res.forEachAddedItem(record => {
                const view = this.createView(record.currentIndex, record.item, parent, parentContext);
                addIndex.push(record.currentIndex);
            });
            const nativeElement = this.options.getHost();
            // Promise.resolve().then(() => {
            addIndex.forEach(index => {
                this.handleContainerItemChange(index, nativeElement);
            });
            // });
        }
    }

    createView(index: number, item: Descendant, parent: Ancestor, parentContext?: K) {
        this.options.itemCallback(index, item, parent);
        const context = this.options.getContext(index, item, parentContext, parent);
        const viewType = this.options.getViewType(item, parent);
        const view = this.createEmbeddedViewOrComponent(viewType, item, parent, context);
        if (view instanceof ComponentRef) {
            view.changeDetectorRef.detectChanges();
        } else {
            view.detectChanges();
        }
        this.childrenViews.splice(index, 0, view);
        this.childrenContexts.splice(index, 0, context);
        this.viewTypes.splice(index, 0, viewType);
    }

    updateView(previousIndex: number, currentIndex: number, item: Descendant, parent: Ancestor, parentContext?: K) {
        const viewType = this.options.getViewType(item, parent);
        const context = this.options.getContext(currentIndex, item, parentContext, parent);
        const previousView = this.childrenViews[previousIndex];
        const previousViewType = this.viewTypes[previousIndex];
        const previousContext = this.childrenContexts[previousIndex];
        if (this.viewLevel === ViewLevel.node && memoizedContext(this.options.viewContext, item, previousContext as any, context as any)) {
            return;
        }
        if (previousViewType === viewType) {
            if (previousView instanceof ComponentRef) {
                console.log('set_context', context);
                previousView.instance.context = context;
            } else {
                const embeddedViewContext = {
                    context,
                    viewContext: this.options.viewContext
                };
                previousView.context = embeddedViewContext;
                previousView.detectChanges();
            }
        } else {
            // this.viewType = viewType;
            // const firstRootNode = this.rootNodes[0];
            // if (isTemplateRef(this.viewType)) {
            //     this.embeddedViewContext = {
            //         context,
            //         viewContext: this.viewContext
            //     };
            //     const embeddedViewRef = this.viewContainerRef.createEmbeddedView<BaseEmbeddedView<T>>(
            //         this.viewType as TemplateRef<BaseEmbeddedView<T, AngularEditor>>,
            //         this.embeddedViewContext
            //     );
            //     firstRootNode.replaceWith(...embeddedViewRef.rootNodes.filter(rootNode => isDOMElement(rootNode)));
            //     this.destroyView();
            //     this.embeddedViewRef = embeddedViewRef;
            // }
            // if (isComponentType(this.viewType)) {
            //     const componentRef = this.viewContainerRef.createComponent(this.viewType) as ComponentRef<any>;
            //     componentRef.instance.viewContext = this.viewContext;
            //     componentRef.instance.context = context;
            //     firstRootNode.replaceWith(componentRef.instance.nativeElement);
            //     this.destroyView();
            //     this.componentRef = componentRef;
            // }
        }
    }

    removeView(previousIndex: number) {
        const previousView = this.childrenViews.splice(previousIndex, 1)[0];
        // previousView.destroy();
        const previousViewType = this.viewTypes.splice(previousIndex, 1)[0];
        const previousContext = this.childrenContexts.splice(previousIndex, 1)[0];
    }

    handleContainerItemChange(index: number, parentElement: HTMLElement) {
        const view = this.childrenViews[index];
        const rootNodes = this.getRootNodes(view);
        if (index === 0) {
            parentElement.prepend(...rootNodes);
        } else {
            const previousView = this.childrenViews[index - 1];
            const previousRootNodes = this.getRootNodes(previousView);
            let previousRootNode = previousRootNodes[previousRootNodes.length - 1];
            rootNodes.forEach(rootNode => {
                previousRootNode.insertAdjacentElement('afterend', rootNode);
                previousRootNode = rootNode;
            });
        }
    }

    private createEmbeddedViewOrComponent(viewType: ViewType, item: Descendant, parent: Ancestor, context: T) {
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
            const result: HTMLElement[] = [];
            ref.rootNodes.forEach(rootNode => {
                const isHTMLElement = rootNode instanceof HTMLElement;
                if (isHTMLElement && result.every(item => !item.contains(rootNode))) {
                    result.push(rootNode);
                }
                if (!isHTMLElement) {
                    rootNode.remove();
                }
            });
            return result;
        }
    }

    private createFragment() {
        const result = [];
        this.childrenViews.forEach((component, index) => {
            result.push(...this.getRootNodes(component));
        });
        return result;
    }
}

export function memoizedElementContext(viewContext: SlateViewContext, prev: SlateElementContext, next: SlateElementContext) {
    return (
        prev.element === next.element &&
        (!viewContext.isStrictDecorate || prev.decorate === next.decorate) &&
        prev.readonly === next.readonly &&
        isDecoratorRangeListEqual(prev.decorations, next.decorations) &&
        (prev.selection === next.selection || (!!prev.selection && !!next.selection && Range.equals(prev.selection, next.selection)))
    );
}

export function memoizedTextContext(prev: SlateTextContext, next: SlateTextContext) {
    return (
        next.parent === prev.parent &&
        next.isLast === prev.isLast &&
        next.text === prev.text &&
        isDecoratorRangeListEqual(next.decorations, prev.decorations)
    );
}

export function memoizedContext(
    viewContext: SlateViewContext,
    descendant: Descendant,
    prev: SlateElementContext | SlateTextContext,
    next: SlateElementContext | SlateTextContext
): boolean {
    if (Element.isElement(descendant)) {
        return memoizedElementContext(viewContext, prev as SlateElementContext, next as SlateElementContext);
    } else {
        return memoizedTextContext(prev as SlateTextContext, next as SlateTextContext);
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

export function createLoopManager(
    viewLevel: ViewLevel,
    viewContext: SlateViewContext,
    differs: IterableDiffers,
    viewContainerRef: ViewContainerRef,
    getHost: () => HTMLElement
) {
    return new ViewLoopManager(
        viewLevel,
        {
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
            getContext: (index: number, item: Descendant, parentContext: ParentContext, parent: Ancestor) =>
                getContext(index, item, parent, viewContext, parentContext as SlateChildrenContext),
            itemCallback: (index: number, item: Descendant, parent: Ancestor) => {
                NODE_TO_INDEX.set(item, index);
                NODE_TO_PARENT.set(item, parent);
            },
            trackBy: (index, node) => {
                return viewContext.trackBy(node) || AngularEditor.findKey(viewContext.editor, node);
            },
            getHost
        },
        differs
    );
}

// export function createLeafLoopManager(
//     viewLevel: ViewLevel,
//     viewContext: SlateViewContext,
//     differs: IterableDiffers,
//     viewContainerRef: ViewContainerRef,
//     getHost: () => HTMLElement
// ) {
//     return new ViewLoopManager(
//         viewLevel,
//         {
//             getViewType: (item: Descendant) => {
//                 return (viewContext.renderLeaf && viewContext.renderLeaf(item as Text)) || viewContext.defaultLeaf;
//             },
//             viewContext,
//             viewContainerRef,
//             getContext: (index: number, item: Descendant, parentContext: ParentContext) => {
//                 const context = parentContext as SlateTextContext;
//                 return {
//                     leaf: item,
//                     text: context.text,
//                     parent: context.parent,
//                     index,
//                     isLast: context.isLast && index === this.leaves.length - 1
//                 };
//             },
//             itemCallback: (index: number, item: Descendant) => {},
//             trackBy: (index, node) => {
//                 return index;
//             }
//         },
//         differs
//     );
// }

/**
 * string 的场景
 */
export class ViewManager {}
