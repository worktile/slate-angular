import { LeafPosition, Text } from 'slate';
import { ComponentRef, EmbeddedViewRef, IterableDiffer, IterableDiffers, ViewContainerRef } from '@angular/core';
import { ViewType } from '../../types/view';
import { SlateLeafContext, SlateTextContext, SlateViewContext } from '../context';
import { createEmbeddedViewOrComponentOrFlavour, getRootNodes, mount, mountOnItemChange, updateContext } from './utils';
import { FlavourRef } from '../flavour/ref';
import { DefaultLeafFlavour } from '../../components/leaf/leaf.flavour';

export class LeavesRender {
    private decoratedLeaves: { leaf: Text; position?: LeafPosition }[];
    private views: (EmbeddedViewRef<any> | ComponentRef<any> | FlavourRef)[] = [];
    private contexts: SlateLeafContext[] = [];
    private viewTypes: ViewType[] = [];
    private differ: IterableDiffer<any>;

    constructor(
        private viewContext: SlateViewContext,
        private viewContainerRef: ViewContainerRef,
        private getOutletParent: () => HTMLElement,
        private getOutletElement: () => HTMLElement
    ) {}

    public initialize(context: SlateTextContext) {
        const { decoratedLeaves, contexts } = this.getLeaves(context);
        this.decoratedLeaves = decoratedLeaves;
        this.contexts = contexts;
        this.decoratedLeaves.forEach((leaf, index) => {
            const context = getContext(index, this.contexts);
            const viewType = getViewType(context, this.viewContext);
            const view = createEmbeddedViewOrComponentOrFlavour(viewType, context, this.viewContext, this.viewContainerRef);
            this.views.push(view);
            this.contexts.push(context);
            this.viewTypes.push(viewType);
        });
        mount(this.views, null, this.getOutletParent(), this.getOutletElement());
        const newDiffers = this.viewContext.editor.injector.get(IterableDiffers);
        this.differ = newDiffers.find(this.decoratedLeaves).create(trackBy(this.viewContext));
        this.differ.diff(this.decoratedLeaves);
    }

    public update(context: SlateTextContext) {
        const { decoratedLeaves, contexts } = this.getLeaves(context);
        const outletParent = this.getOutletParent();
        const diffResult = this.differ.diff(decoratedLeaves);
        if (diffResult) {
            let firstRootNode = getRootNodes(this.views[0])[0];
            const newContexts = [];
            const newViewTypes = [];
            const newViews = [];
            diffResult.forEachItem(record => {
                let context = getContext(record.currentIndex, contexts);
                const viewType = getViewType(context, this.viewContext);
                newViewTypes.push(viewType);
                let view: EmbeddedViewRef<any> | ComponentRef<any> | FlavourRef;
                if (record.previousIndex === null) {
                    view = createEmbeddedViewOrComponentOrFlavour(viewType, context, this.viewContext, this.viewContainerRef);
                    newContexts.push(context);
                    newViews.push(view);
                    mountOnItemChange(record.currentIndex, record.item, newViews, null, outletParent, firstRootNode, this.viewContext);
                } else {
                    const previousView = this.views[record.previousIndex];
                    const previousViewType = this.viewTypes[record.previousIndex];
                    if (previousViewType !== viewType) {
                        view = createEmbeddedViewOrComponentOrFlavour(viewType, context, this.viewContext, this.viewContainerRef);
                        const firstRootNode = getRootNodes(previousView, null)[0];
                        const newRootNodes = getRootNodes(view, null);
                        firstRootNode.replaceWith(...newRootNodes);
                        previousView.destroy();
                    } else {
                        view = previousView;
                        updateContext(previousView, context, this.viewContext);
                    }
                    newContexts.push(context);
                    newViews.push(view);
                }
            });
            diffResult.forEachRemovedItem(record => {
                const view = this.views[record.previousIndex];
                view.destroy();
            });
            diffResult.forEachMovedItem(record => {
                mountOnItemChange(record.currentIndex, record.item, newViews, null, outletParent, firstRootNode, this.viewContext);
            });
            this.viewTypes = newViewTypes;
            this.views = newViews;
            this.contexts = newContexts;
            this.decoratedLeaves = decoratedLeaves;
        }
    }

    private getLeaves(context: SlateTextContext) {
        const decoratedLeaves = Text.decorations(context.text, context.decorations);
        const contexts: SlateLeafContext[] = decoratedLeaves.map((decoratedLeaf, index) => {
            return {
                leaf: decoratedLeaf.leaf,
                leafPosition: decoratedLeaf.position,
                text: context.text,
                parent: context.parent,
                index,
                isLast: context.isLast && index === decoratedLeaves.length - 1
            };
        });
        return { decoratedLeaves, contexts };
    }
}

export function getContext(index: number, leafContexts: SlateLeafContext[]): SlateLeafContext {
    return leafContexts[index];
}

export function getViewType(leafContext: SlateLeafContext, viewContext: SlateViewContext) {
    return (viewContext.renderLeaf && viewContext.renderLeaf(leafContext.leaf)) || DefaultLeafFlavour;
}

export function trackBy(viewContext: SlateViewContext) {
    return (index, node) => {
        return index;
    };
}
