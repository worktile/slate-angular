import { AfterViewInit, Directive, ElementRef, Input, IterableChangeRecord, IterableDiffers, QueryList } from '@angular/core';
import { SlateViewContext } from './context';
import { ViewContainerItem } from './container-item';
import { SlateErrorCode } from '../types/error';

/**
 * the special container for angular template
 * Add the rootNodes of each child component to the parentElement
 * Remove useless DOM elements, eg: comment...
 */
@Directive()
export abstract class ViewContainer<T extends ViewContainerItem> implements AfterViewInit {
    abstract childrenComponent: QueryList<T>;

    @Input() viewContext: SlateViewContext;

    constructor(protected elementRef: ElementRef<any>, protected differs: IterableDiffers) {}

    ngAfterViewInit() {
    }

    getPreviousRootNode(currentIndex) {
        if (currentIndex === 0) {
            return null;
        }
        const previousComponent = this.childrenComponent.find((item, index) => index === currentIndex - 1);
        let previousRootNode = previousComponent.rootNodes[previousComponent.rootNodes.length - 1];
        if (previousRootNode) {
            return previousRootNode;
        } else {
            return this.getPreviousRootNode(currentIndex - 1);
        }
    }

    createFragment() {
        const fragment = document.createDocumentFragment();
        this.childrenComponent.forEach((component, index) => {
            fragment.append(...component.rootNodes);
        });
        return fragment;
    }

    handleContainerItemChange(record: IterableChangeRecord<T>, parentElement: HTMLElement) {
        // first insert
        if (this.elementRef.nativeElement.parentElement && this.elementRef.nativeElement.parentElement === parentElement) {
            const fragment = document.createDocumentFragment();
            fragment.append(...record.item.rootNodes);
            parentElement.insertBefore(fragment, this.elementRef.nativeElement);
            this.elementRef.nativeElement.remove();
            return;
        }
        // insert at start location
        if (record.currentIndex === 0) {
            const fragment = document.createDocumentFragment();
            fragment.append(...record.item.rootNodes);
            parentElement.prepend(fragment);
        } else {
            // insert afterend of previous component end
            let previousRootNode = this.getPreviousRootNode(record.currentIndex);
            if (previousRootNode) {
                record.item.rootNodes.forEach(rootNode => {
                    previousRootNode.insertAdjacentElement('afterend', rootNode);
                    previousRootNode = rootNode;
                });
            } else {
                this.viewContext.editor.onError({
                    code: SlateErrorCode.NotFoundPreviousRootNodeError,
                    name: 'not found previous rootNode',
                    nativeError: null
                });
            }
        }
        // Solve the block-card DOMElement loss when moving nodes
        record.item.appendBlockCardElement();
    }
}
