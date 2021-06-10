import { AfterViewInit, Directive, ElementRef, Input, IterableChangeRecord, IterableDiffers, QueryList } from "@angular/core";
import { SlateViewContext } from "./context";
import { ViewContainerItem } from "./container-item";

/**
 * the sepcial container for angular template
 * Add the rootNodes of each child component to the parentElement
 * Remove useless DOM elements, eg: comment...
 */
@Directive()
export abstract class ViewContainer<T extends ViewContainerItem> implements AfterViewInit {
    abstract childrenComponent: QueryList<T>;

    @Input() viewContext: SlateViewContext;

    constructor(protected elementRef: ElementRef<any>,
        protected differs: IterableDiffers) {
    }

    ngAfterViewInit() {
        const differ = this.differs.find(this.childrenComponent).create((index, item) => {
            return item;
        });
        // first diff
        differ.diff(this.childrenComponent);
        const parentElement: HTMLElement = this.elementRef.nativeElement.parentElement;
        let firstChildComponent = this.childrenComponent.first;
        if (this.childrenComponent.length > 0) {
            parentElement.insertBefore(this.createFragment(), this.elementRef.nativeElement);
            this.elementRef.nativeElement.remove();
        }
        this.childrenComponent.changes.subscribe((value) => {
            const iterableChanges = differ.diff(this.childrenComponent);
            if (iterableChanges) {
                iterableChanges.forEachAddedItem((record: IterableChangeRecord<T>) => {
                    // first insert
                    if (this.elementRef.nativeElement.parentElement && this.elementRef.nativeElement.parentElement === parentElement) {
                        const fragment = document.createDocumentFragment();
                        fragment.append(...record.item.rootNodes);
                        parentElement.insertBefore(fragment, this.elementRef.nativeElement);
                        this.elementRef.nativeElement.remove();
                        return;
                    }
                    // insert at start location
                    if (record.currentIndex === 0 && firstChildComponent) {
                        const fragment = document.createDocumentFragment();
                        fragment.append(...record.item.rootNodes);
                        // compatibility: rootNode is removed in the test environment
                        if (firstChildComponent.rootNodes[0] && firstChildComponent.rootNodes[0].parentElement) {
                            parentElement.insertBefore(fragment, firstChildComponent.rootNodes[0]);
                        } else {
                            parentElement.appendChild(fragment);
                        }
                    } else {
                        // insert afterend of previous component end
                        const previousComponent = this.childrenComponent.find((item, index) => index === record.currentIndex - 1);
                        let previousRootNode = previousComponent.rootNodes[previousComponent.rootNodes.length - 1];
                        record.item.rootNodes.forEach((rootNode) => {
                            previousRootNode.insertAdjacentElement('afterend', rootNode);
                            previousRootNode = rootNode;
                        });
                    }
                });
            }
            firstChildComponent = this.childrenComponent.first;
        });
    }

    createFragment() {
        const fragment = document.createDocumentFragment();
        this.childrenComponent.forEach((component, index) => {
            fragment.append(...component.rootNodes);
        })
        return fragment;
    }
}