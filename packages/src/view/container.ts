import { Directive, ElementRef, Input, IterableDiffers } from '@angular/core';
import { SlateViewContext } from './context';
import { ViewContainerItem } from './container-item';

/**
 * @deprecated
 * the special container for angular template
 * Add the rootNodes of each child component to the parentElement
 * Remove useless DOM elements, eg: comment...
 */
@Directive()
export abstract class ViewContainer<T extends ViewContainerItem> {
    @Input() viewContext: SlateViewContext;

    constructor(
        protected elementRef: ElementRef<any>,
        protected differs: IterableDiffers
    ) {}
}
