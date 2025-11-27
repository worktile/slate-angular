import { Descendant } from 'slate';
import { ComponentRef, EmbeddedViewRef, ViewContainerRef } from '@angular/core';
import { ViewType } from '../../types/view';
import { isComponentType, isFlavourType, isTemplateRef } from '../../utils/view';
import { SlateElementContext, SlateLeafContext, SlateTextContext, SlateViewContext } from '../context';
import { BlockCardRef, FlavourRef } from '../flavour/ref';

export function createEmbeddedViewOrComponentOrFlavour(
    viewType: ViewType,
    context: any,
    viewContext: SlateViewContext,
    viewContainerRef: ViewContainerRef
) {
    if (isFlavourType(viewType)) {
        const flavourRef = new FlavourRef();
        flavourRef.instance = new (viewType as any)();
        flavourRef.instance.context = context;
        flavourRef.instance.viewContext = viewContext;
        flavourRef.instance.viewContainerRef = viewContainerRef;
        flavourRef.instance.onInit();
        return flavourRef;
    }
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

export function updateContext(
    view: EmbeddedViewRef<any> | ComponentRef<any> | FlavourRef,
    newContext: SlateElementContext | SlateTextContext | SlateLeafContext,
    viewContext: SlateViewContext
) {
    if (view instanceof FlavourRef) {
        view.instance.context = newContext;
        return;
    }
    if (view instanceof ComponentRef) {
        view.instance.context = newContext;
    } else {
        view.context.context = newContext;
        view.context.viewContext = viewContext;
        view.detectChanges();
    }
}

export function mount(
    views: (EmbeddedViewRef<any> | ComponentRef<any> | FlavourRef)[],
    blockCards: (BlockCardRef | null)[] | null,
    outletParent: HTMLElement,
    outletElement: HTMLElement | null
) {
    if (views.length > 0) {
        const fragment = document.createDocumentFragment();
        views.forEach((view, index) => {
            const blockCard = blockCards ? blockCards[index] : undefined;
            fragment.append(...getRootNodes(view, blockCard));
        });
        if (outletElement) {
            outletElement.parentElement.insertBefore(fragment, outletElement);
            outletElement.remove();
        } else {
            outletParent.prepend(fragment);
        }
    }
}

export function getRootNodes(ref: EmbeddedViewRef<any> | ComponentRef<any> | FlavourRef, blockCard?: BlockCardRef): HTMLElement[] {
    if (blockCard) {
        return [blockCard.instance.nativeElement];
    }
    if (ref instanceof FlavourRef) {
        return [ref.instance.nativeElement];
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
            const isSlateNodeOfLeaf =
                isHTMLElement && (rootNode.hasAttribute('data-slate-node') || rootNode.hasAttribute('data-slate-leaf'));
            if (isSlateNodeOfLeaf && result.every(item => !item.contains(rootNode))) {
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
    blockCards: (BlockCardRef | null)[] | null,
    outletParent: HTMLElement,
    firstRootNode: HTMLElement | null,
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
        if (firstRootNode) {
            rootNodes.forEach(rootNode => {
                firstRootNode.insertAdjacentElement('beforebegin', rootNode);
            });
        } else {
            outletParent.prepend(...rootNodes);
        }
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
