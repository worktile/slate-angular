import { Descendant } from 'slate';
import { ComponentRef, EmbeddedViewRef, ViewContainerRef } from '@angular/core';
import { ViewType } from '../../types/view';
import { isComponentType, isTemplateRef } from '../../utils/view';
import { SlateElementContext, SlateLeafContext, SlateTextContext, SlateViewContext } from '../context';
import { SlateBlockCard } from '../../components/block-card/block-card.component';

export function createEmbeddedViewOrComponent(
    viewType: ViewType,
    context: any,
    viewContext: SlateViewContext,
    viewContainerRef: ViewContainerRef
) {
    if (isTemplateRef(viewType)) {
        const embeddedViewContext = {
            context,
            viewContext
        };
        const embeddedViewRef = viewContainerRef.createEmbeddedView<any>(viewType, embeddedViewContext);
        embeddedViewRef.detectChanges();
        return embeddedViewRef;
    }
    if (isComponentType(viewType)) {
        const componentRef = viewContainerRef.createComponent(viewType, {
            injector: viewContainerRef.injector
        }) as ComponentRef<any>;
        componentRef.instance.viewContext = viewContext;
        componentRef.instance.context = context;
        componentRef.changeDetectorRef.detectChanges();
        return componentRef;
    }
}

export function renderView(view: EmbeddedViewRef<any> | ComponentRef<any>) {
    if (view instanceof ComponentRef) {
        view.changeDetectorRef.detectChanges();
    } else {
        view.detectChanges();
    }
}

export function updateContext(
    view: EmbeddedViewRef<any> | ComponentRef<any>,
    newContext: SlateElementContext | SlateTextContext | SlateLeafContext,
    viewContext: SlateViewContext
) {
    if (view instanceof ComponentRef) {
        view.instance.context = newContext;
    } else {
        const embeddedViewContext = {
            context: newContext,
            viewContext
        };
        view.context = embeddedViewContext;
        view.detectChanges();
    }
}

export function mount(
    views: (EmbeddedViewRef<any> | ComponentRef<any>)[],
    blockCards: (ComponentRef<SlateBlockCard> | null)[] | null,
    outletElement: HTMLElement
) {
    if (views.length > 0) {
        const result = [];
        views.forEach((view, index) => {
            const blockCard = blockCards ? blockCards[index] : undefined;
            result.push(...getRootNodes(view, blockCard));
        });
        outletElement.prepend(...result);
    }
}

export function getRootNodes(ref: EmbeddedViewRef<any> | ComponentRef<any>, blockCard?: ComponentRef<SlateBlockCard>): HTMLElement[] {
    if (blockCard) {
        return [blockCard.instance.nativeElement];
    }
    if (ref instanceof ComponentRef) {
        ((ref.hostView as any).rootNodes as (HTMLElement | any)[]).forEach(ele => {
            if (!(ele instanceof HTMLElement)) {
                ele.remove();
            }
        });
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

export function mountOnItemChange(
    index: number,
    item: Descendant,
    views: (EmbeddedViewRef<any> | ComponentRef<any>)[],
    blockCards: (ComponentRef<SlateBlockCard> | null)[] | null,
    outletElement: HTMLElement,
    viewContext: SlateViewContext
) {
    const view = views[index];
    let rootNodes = getRootNodes(view);
    if (blockCards) {
        const isBlockCard = viewContext.editor.isBlockCard(item);
        if (isBlockCard) {
            const blockCard = blockCards[index];
            rootNodes = [blockCard.instance.nativeElement];
        }
    }
    if (index === 0) {
        outletElement.prepend(...rootNodes);
    } else {
        const previousView = views[index - 1];
        const blockCard = blockCards ? blockCards[index - 1] : null;
        const previousRootNodes = getRootNodes(previousView, blockCard);
        let previousRootNode = previousRootNodes[previousRootNodes.length - 1];
        rootNodes.forEach(rootNode => {
            previousRootNode.insertAdjacentElement('afterend', rootNode);
            previousRootNode = rootNode;
        });
    }
}
