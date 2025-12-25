import { Ancestor, Descendant, Range, Editor, Element, Path } from 'slate';
import { ComponentRef, EmbeddedViewRef, IterableDiffer, IterableDiffers, ViewContainerRef } from '@angular/core';
import { ViewType } from '../../types/view';
import { SlateChildrenContext, SlateElementContext, SlateTextContext, SlateViewContext } from '../context';
import { AngularEditor } from '../../plugins/angular-editor';
import { SlateErrorCode } from '../../types/error';
import { EDITOR_TO_AFTER_VIEW_INIT_QUEUE } from '../../utils/weak-maps';
import { isDecoratorRangeListEqual } from '../../utils/range-list';
import { createEmbeddedViewOrComponentOrFlavour, getRootNodes, mount, mountOnItemChange, updateContext } from './utils';
import { NODE_TO_INDEX, NODE_TO_PARENT } from 'slate-dom';
import { DefaultElementFlavour } from '../../components/element.flavour';
import { DefaultTextFlavour, VoidTextFlavour } from '../../components/text/default-text.flavour';
import { BlockCardRef, FlavourRef } from '../flavour/ref';
import { SlateBlockCard } from '../../components/block-card/block-card';

export class ListRender {
    private children: Descendant[] = [];
    private views: (EmbeddedViewRef<any> | ComponentRef<any> | FlavourRef)[] = [];
    private blockCards: (BlockCardRef | null)[] = [];
    private contexts: (SlateTextContext | SlateElementContext)[] = [];
    private viewTypes: ViewType[] = [];
    private differ: IterableDiffer<any> | null = null;
    public initialized = false;
    private preRenderingHTMLElement: HTMLElement[][] = [];

    constructor(
        private viewContext: SlateViewContext,
        private viewContainerRef: ViewContainerRef,
        private getOutletParent: () => HTMLElement,
        private getOutletElement: () => HTMLElement | null
    ) {}

    public initialize(children: Descendant[], parent: Ancestor, childrenContext: SlateChildrenContext, preRenderingCount = 0) {
        this.initialized = true;
        this.children = children;
        const isRoot = parent === this.viewContext.editor;
        const firstIndex = isRoot ? this.viewContext.editor.children.indexOf(children[0]) : 0;
        const parentPath = AngularEditor.findPath(this.viewContext.editor, parent);
        children.forEach((descendant, _index) => {
            NODE_TO_INDEX.set(descendant, firstIndex + _index);
            NODE_TO_PARENT.set(descendant, parent);
            const context = getContext(firstIndex + _index, descendant, parentPath, childrenContext, this.viewContext);
            const viewType = getViewType(descendant, parent, this.viewContext);
            const view = createEmbeddedViewOrComponentOrFlavour(viewType, context, this.viewContext, this.viewContainerRef);
            const blockCard = createBlockCard(descendant, view, this.viewContext);
            this.views.push(view);
            this.contexts.push(context);
            this.viewTypes.push(viewType);
            this.blockCards.push(blockCard);
        });
        mount(this.views, this.blockCards, this.getOutletParent(), this.getOutletElement());
        const newDiffers = this.viewContext.editor.injector.get(IterableDiffers);
        this.differ = newDiffers.find(children).create(trackBy(this.viewContext));
        this.differ.diff(children);
        if (parent === this.viewContext.editor) {
            executeAfterViewInit(this.viewContext.editor);
        }
    }

    public update(children: Descendant[], parent: Ancestor, childrenContext: SlateChildrenContext, preRenderingCount = 0) {
        if (!this.initialized || this.children.length === 0) {
            this.initialize(children, parent, childrenContext, preRenderingCount);
            return;
        }
        if (!this.differ) {
            throw new Error('Exception: Can not find differ ');
        }
        const outletParent = this.getOutletParent();
        if (this.preRenderingHTMLElement.length > 0) {
            const preRenderingElement = [...this.preRenderingHTMLElement];
            preRenderingElement.forEach((rootNodes, index) => {
                rootNodes.forEach(rootNode => {
                    rootNode.style.position = '';
                    rootNode.style.top = '';
                });
            });
            this.preRenderingHTMLElement = [];
        }
        const diffResult = this.differ.diff(children);
        const parentPath = AngularEditor.findPath(this.viewContext.editor, parent);
        const isRoot = parent === this.viewContext.editor;
        const firstIndex = isRoot ? this.viewContext.editor.children.indexOf(children[0]) : 0;
        if (diffResult) {
            let firstRootNode = getRootNodes(this.views[0], this.blockCards[0])[0];
            const newContexts = [];
            const newViewTypes = [];
            const newViews = [];
            const newBlockCards: (BlockCardRef | null)[] = [];
            diffResult.forEachItem(record => {
                const currentIndex = firstIndex + record.currentIndex;
                NODE_TO_INDEX.set(record.item, currentIndex);
                NODE_TO_PARENT.set(record.item, parent);
                let context = getContext(currentIndex, record.item, parentPath, childrenContext, this.viewContext);
                const viewType = getViewType(record.item, parent, this.viewContext);
                newViewTypes.push(viewType);
                let view: EmbeddedViewRef<any> | ComponentRef<any> | FlavourRef;
                let blockCard: BlockCardRef | null;
                if (record.previousIndex === null) {
                    view = createEmbeddedViewOrComponentOrFlavour(viewType, context, this.viewContext, this.viewContainerRef);
                    blockCard = createBlockCard(record.item, view, this.viewContext);
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
                        view = createEmbeddedViewOrComponentOrFlavour(viewType, context, this.viewContext, this.viewContainerRef);
                        blockCard = createBlockCard(record.item, view, this.viewContext);
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
            if (parent === this.viewContext.editor) {
                executeAfterViewInit(this.viewContext.editor);
            }
        } else {
            const newContexts = [];
            this.children.forEach((child, _index) => {
                NODE_TO_INDEX.set(child, firstIndex + _index);
                NODE_TO_PARENT.set(child, parent);
                let context = getContext(firstIndex + _index, child, parentPath, childrenContext, this.viewContext);
                const previousContext = this.contexts[_index];
                if (memoizedContext(this.viewContext, child, previousContext as any, context as any)) {
                    context = previousContext;
                } else {
                    updateContext(this.views[_index], context, this.viewContext);
                }
                newContexts.push(context);
            });
            this.contexts = newContexts;
        }
        if (preRenderingCount > 0) {
            for (let i = 0; i < preRenderingCount; i++) {
                const rootNodes = [...getRootNodes(this.views[i], this.blockCards[i])];
                rootNodes.forEach(rootNode => {
                    rootNode.style.top = '-100%';
                    rootNode.style.position = 'absolute';
                });
                this.preRenderingHTMLElement.push(rootNodes);
            }
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
        this.children = [];
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
        }
        // add contentEditable for block element only to avoid chinese input be broken
        if (isVoid && !isInline) {
            elementContext.contentEditable = false;
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
        viewContext.editor.onError({
            code: SlateErrorCode.GetStartPointError,
            nativeError: error
        });
        return { selection: null, decorations: [] };
    }
}

export function getViewType(item: Descendant, parent: Ancestor, viewContext: SlateViewContext) {
    if (Element.isElement(item)) {
        return (viewContext.renderElement && viewContext.renderElement(item)) || DefaultElementFlavour;
    } else {
        const isVoid = viewContext.editor.isVoid(parent as Element);
        return isVoid ? VoidTextFlavour : (viewContext.renderText && viewContext.renderText(item)) || DefaultTextFlavour;
    }
}

export function createBlockCard(
    item: Descendant,
    view: EmbeddedViewRef<any> | ComponentRef<any> | FlavourRef,
    viewContext: SlateViewContext
) {
    const isBlockCard = viewContext.editor.isBlockCard(item);
    if (isBlockCard) {
        const rootNodes = getRootNodes(view);
        const blockCardRef = new BlockCardRef();
        blockCardRef.instance = new SlateBlockCard();
        blockCardRef.instance.onInit();
        blockCardRef.instance.initializeCenter(rootNodes);
        return blockCardRef;
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

export function addAfterViewInitQueue(editor: Editor, afterViewInitCallback: () => void) {
    const queue = getAfterViewInitQueue(editor);
    queue.push(afterViewInitCallback);
    EDITOR_TO_AFTER_VIEW_INIT_QUEUE.set(editor, queue);
}

export function getAfterViewInitQueue(editor: Editor) {
    return EDITOR_TO_AFTER_VIEW_INIT_QUEUE.get(editor) || [];
}

export function clearAfterViewInitQueue(editor: Editor) {
    EDITOR_TO_AFTER_VIEW_INIT_QUEUE.set(editor, []);
}

export function executeAfterViewInit(editor: Editor) {
    const queue = getAfterViewInitQueue(editor);
    queue.forEach(callback => callback());
    clearAfterViewInitQueue(editor);
}
