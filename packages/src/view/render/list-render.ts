import { Ancestor, Descendant, Range, Editor, Element, Path } from 'slate';
import { ComponentRef, EmbeddedViewRef, IterableDiffer, IterableDiffers, ViewContainerRef } from '@angular/core';
import { ViewType } from '../../types/view';
import { SlateChildrenContext, SlateElementContext, SlateTextContext, SlateViewContext } from '../context';
import { AngularEditor } from '../../plugins/angular-editor';
import { SlateErrorCode } from '../../types/error';
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../../utils/weak-maps';
import { isDecoratorRangeListEqual } from '../../utils/range-list';
import { SlateBlockCard } from '../../components/block-card/block-card.component';
import { createEmbeddedViewOrComponent, getRootNodes, mount, mountOnItemChange, renderView, updateContext } from './utils';

export class ListRender {
    private children: Descendant[];
    private views: (EmbeddedViewRef<any> | ComponentRef<any>)[] = [];
    private blockCards: (ComponentRef<SlateBlockCard> | null)[] = [];
    private contexts: (SlateTextContext | SlateElementContext)[] = [];
    private viewTypes: ViewType[] = [];
    private differ: IterableDiffer<any> | null = null;
    public initialized = false;

    constructor(
        private viewContext: SlateViewContext,
        private viewContainerRef: ViewContainerRef,
        private getOutletParent: () => HTMLElement,
        private getOutletElement: () => HTMLElement | null
    ) {}

    public initialize(children: Descendant[], parent: Ancestor, childrenContext: SlateChildrenContext) {
        this.initialized = true;
        this.children = children;
        const parentPath = AngularEditor.findPath(this.viewContext.editor, parent);
        children.forEach((descendant, index) => {
            NODE_TO_INDEX.set(descendant, index);
            NODE_TO_PARENT.set(descendant, parent);
            const context = getContext(index, descendant, parentPath, childrenContext, this.viewContext);
            const viewType = getViewType(descendant, parent, this.viewContext);
            const view = createEmbeddedViewOrComponent(viewType, context, this.viewContext, this.viewContainerRef);
            const blockCard = createBlockCard(descendant, view, this.viewContainerRef, this.viewContext);
            this.views.push(view);
            this.contexts.push(context);
            this.viewTypes.push(viewType);
            this.blockCards.push(blockCard);
        });
        mount(this.views, this.blockCards, this.getOutletParent(), this.getOutletElement());
        const newDiffers = this.viewContainerRef.injector.get(IterableDiffers);
        this.differ = newDiffers.find(children).create(trackBy(this.viewContext));
        this.differ.diff(children);
    }

    public update(children: Descendant[], parent: Ancestor, childrenContext: SlateChildrenContext) {
        if (!this.initialized) {
            this.initialize(children, parent, childrenContext);
            return;
        }
        if (!this.differ) {
            throw new Error('Exception: Can not find differ ');
        }
        const outletParent = this.getOutletParent();
        const diffResult = this.differ.diff(children);
        const parentPath = AngularEditor.findPath(this.viewContext.editor, parent);
        if (diffResult) {
            let firstRootNode = getRootNodes(this.views[0], this.blockCards[0])[0];
            const newContexts = [];
            const newViewTypes = [];
            const newViews = [];
            const newBlockCards: (ComponentRef<SlateBlockCard> | null)[] = [];
            diffResult.forEachItem(record => {
                NODE_TO_INDEX.set(record.item, record.currentIndex);
                NODE_TO_PARENT.set(record.item, parent);
                let context = getContext(record.currentIndex, record.item, parentPath, childrenContext, this.viewContext);
                const viewType = getViewType(record.item, parent, this.viewContext);
                newViewTypes.push(viewType);
                let view: EmbeddedViewRef<any> | ComponentRef<any>;
                let blockCard: ComponentRef<SlateBlockCard> | null;
                if (record.previousIndex === null) {
                    view = createEmbeddedViewOrComponent(viewType, context, this.viewContext, this.viewContainerRef);
                    blockCard = createBlockCard(record.item, view, this.viewContainerRef, this.viewContext);
                    newContexts.push(context);
                    newViews.push(view);
                    newBlockCards.push(blockCard);
                    mountOnItemChange(
                        record.currentIndex,
                        record.item,
                        newViews,
                        newBlockCards,
                        outletParent,
                        firstRootNode,
                        this.viewContext
                    );
                } else {
                    const previousView = this.views[record.previousIndex];
                    const previousViewType = this.viewTypes[record.previousIndex];
                    const previousContext = this.contexts[record.previousIndex];
                    const previousBlockCard = this.blockCards[record.previousIndex];
                    if (previousViewType !== viewType) {
                        view = createEmbeddedViewOrComponent(viewType, context, this.viewContext, this.viewContainerRef);
                        blockCard = createBlockCard(record.item, view, this.viewContainerRef, this.viewContext);
                        const firstRootNode = getRootNodes(previousView, previousBlockCard)[0];
                        const newRootNodes = getRootNodes(view, blockCard);
                        firstRootNode.replaceWith(...newRootNodes);
                        previousView.destroy();
                        previousBlockCard?.destroy();
                    } else {
                        view = previousView;
                        blockCard = previousBlockCard;
                        if (memoizedContext(this.viewContext, record.item, previousContext as any, context as any)) {
                            context = previousContext;
                        } else {
                            updateContext(previousView, context, this.viewContext);
                        }
                    }
                    newContexts.push(context);
                    newViews.push(view);
                    newBlockCards.push(blockCard);
                }
            });
            diffResult.forEachOperation(record => {
                // removed
                if (record.currentIndex === null) {
                    const view = this.views[record.previousIndex];
                    const blockCard = this.blockCards[record.previousIndex];
                    view.destroy();
                    blockCard?.destroy();
                }
                // moved
                if (record.previousIndex !== null && record.currentIndex !== null) {
                    mountOnItemChange(
                        record.currentIndex,
                        record.item,
                        newViews,
                        newBlockCards,
                        outletParent,
                        firstRootNode,
                        this.viewContext
                    );
                    // Solve the block-card DOMElement loss when moving nodes
                    newBlockCards[record.currentIndex]?.instance.append();
                }
            });
            this.viewTypes = newViewTypes;
            this.views = newViews;
            this.contexts = newContexts;
            this.children = children;
            this.blockCards = newBlockCards;
        } else {
            const newContexts = [];
            this.children.forEach((child, index) => {
                let context = getContext(index, child, parentPath, childrenContext, this.viewContext);
                const previousContext = this.contexts[index];
                if (memoizedContext(this.viewContext, child, previousContext as any, context as any)) {
                    context = previousContext;
                } else {
                    updateContext(this.views[index], context, this.viewContext);
                }
                newContexts.push(context);
            });
            this.contexts = newContexts;
        }
    }

    public destroy() {
        this.children.forEach((element: Element, index: number) => {
            if (this.views[index]) {
                this.views[index].destroy();
            }
            if (this.blockCards[index]) {
                this.blockCards[index].destroy();
            }
        });
        this.views = [];
        this.blockCards = [];
        this.contexts = [];
        this.viewTypes = [];
        this.initialized = false;
        this.differ = null;
    }
}

export function getContext(
    index: number,
    item: Descendant,
    parentPath: Path,
    childrenContext: SlateChildrenContext,
    viewContext: SlateViewContext
): SlateElementContext | SlateTextContext {
    if (Element.isElement(item)) {
        const computedContext = getCommonContext(index, item, parentPath, viewContext, childrenContext);
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
        const computedContext = getCommonContext(index, item, parentPath, viewContext, childrenContext);
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
    parentPath: Path,
    viewContext: SlateViewContext,
    childrenContext: SlateChildrenContext
): { selection: Range; decorations: Range[] } {
    const p = parentPath.concat(index);
    try {
        const ds = childrenContext.decorate([item, p]);
        // [list-render] performance optimization: reduce the number of calls to the `Editor.range(viewContext.editor, p)` method
        if (childrenContext.selection || childrenContext.decorations.length > 0) {
            const range = Editor.range(viewContext.editor, p);
            const sel = childrenContext.selection && Range.intersection(range, childrenContext.selection);
            for (const dec of childrenContext.decorations) {
                const d = Range.intersection(dec, range);
                if (d) {
                    ds.push(d);
                }
            }
            return { selection: sel, decorations: ds };
        } else {
            return { selection: null, decorations: ds };
        }
    } catch (error) {
        this.options.viewContext.editor.onError({
            code: SlateErrorCode.GetStartPointError,
            nativeError: error
        });
        return { selection: null, decorations: [] };
    }
}

export function getViewType(item: Descendant, parent: Ancestor, viewContext: SlateViewContext) {
    if (Element.isElement(item)) {
        return (viewContext.renderElement && viewContext.renderElement(item)) || viewContext.defaultElement;
    } else {
        const isVoid = viewContext.editor.isVoid(parent as Element);
        return isVoid ? viewContext.defaultVoidText : (viewContext.renderText && viewContext.renderText(item)) || viewContext.defaultText;
    }
}

export function createBlockCard(
    item: Descendant,
    view: EmbeddedViewRef<any> | ComponentRef<any>,
    viewContainerRef: ViewContainerRef,
    viewContext: SlateViewContext
) {
    const isBlockCard = viewContext.editor.isBlockCard(item);
    if (isBlockCard) {
        const rootNodes = getRootNodes(view);
        const blockCardComponentRef = viewContainerRef.createComponent<SlateBlockCard>(SlateBlockCard, {
            injector: viewContainerRef.injector
        });
        blockCardComponentRef.instance.initializeCenter(rootNodes);
        return blockCardComponentRef;
    } else {
        return null;
    }
}

export function trackBy(viewContext: SlateViewContext) {
    return (index, node) => {
        return viewContext.trackBy(node) || AngularEditor.findKey(viewContext.editor, node);
    };
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
