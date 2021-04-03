import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, IterableChangeRecord, IterableDiffer, IterableDiffers, OnDestroy, OnInit, QueryList, ViewChildren } from "@angular/core";
import { SlaNestEntryComponent } from "./nest-entry.component";

@Component({
    selector: 'sla-nest-children-entry, div[slaNestChildrenEntry]',
    template: '<sla-nest-entry [viewOutlet]="item.viewRef" *ngFor="let item of children; trackBy: trackBy" [context]="item.context"></sla-nest-entry>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaNestChildrenEntryComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input()
    children: any;

    @ViewChildren(SlaNestEntryComponent, { read: SlaNestEntryComponent })
    childrenComponent: QueryList<SlaNestEntryComponent>;

    lastChildrenComponent: SlaNestEntryComponent[];

    differ: IterableDiffer<SlaNestEntryComponent>;

    constructor(
        private elementRef: ElementRef<any>,
        private differs: IterableDiffers) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const parentElement: HTMLElement = this.elementRef.nativeElement.parentElement;
        parentElement.insertBefore(this.createChildrenFragment(), this.elementRef.nativeElement)
        this.elementRef.nativeElement.remove();
        this.differ = this.differs.find(this.childrenComponent).create((index, item) => {
            return item;
        });
        this.differ.diff(this.childrenComponent as any);
        this.childrenComponent.changes.subscribe((value) => {
            const iterableChanges = this.differ.diff(this.childrenComponent as any);
            if (iterableChanges) {
                iterableChanges.forEachAddedItem((record: IterableChangeRecord<SlaNestEntryComponent>) => {
                    const previousComponent = this.childrenComponent.find((item, index) => index === record.currentIndex - 1);
                    if (previousComponent) {
                        let previousRootNode = previousComponent.rootNodes[previousComponent.rootNodes.length - 1];
                        record.item.rootNodes.forEach((rootNode) => {
                            previousRootNode.insertAdjacentElement('afterend', rootNode);
                            previousRootNode = rootNode;
                        });
                    } else {
                        const fragment = document.createDocumentFragment();
                        fragment.append(...record.item.rootNodes);
                        parentElement.insertBefore(fragment, parentElement.children.item(0));
                    }
                });
            }
        });
    }

    createChildrenFragment() {
        const fragment = document.createDocumentFragment();
        this.childrenComponent.forEach((nest, index) => {
            fragment.append(...nest.rootNodes);
        })
        return fragment;
    }

    trackBy(index, item) {
        return item['key'] ? item['key'] : index;
    }

    ngOnDestroy() {
    }
}
