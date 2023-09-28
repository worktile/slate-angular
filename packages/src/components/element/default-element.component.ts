import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ElementRef, ChangeDetectorRef, Inject, ViewContainerRef } from '@angular/core';
import { BaseElementComponent } from '../../view/base';
import { SlateChildren } from '../children/children.component';
import { ViewContainer2 } from '../../view/container';
import { SLATE_DEFAULT_ELEMENT_COMPONENT_TOKEN } from './default-element.component.token';
import { ComponentType } from '../../types/view';

@Component({
    selector: 'div[slateDefaultElement]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SlateChildren]
})
export class SlateDefaultElement extends BaseElementComponent implements OnInit, AfterViewInit {
    container2: ViewContainer2;
    // childrenComponent: (EmbeddedViewRef<any> | ComponentRef<any>)[] = [];

    constructor(
        public elementRef: ElementRef<HTMLElement>,
        public cdr: ChangeDetectorRef,
        @Inject(SLATE_DEFAULT_ELEMENT_COMPONENT_TOKEN)
        public defaultElementComponentType: ComponentType<BaseElementComponent>,
        public viewContainerRef: ViewContainerRef
    ) {
        super(elementRef, cdr);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.container2 = new ViewContainer2();
        this.container2.initialize(this.children, this.element, this.viewContext, this.context,this.defaultElementComponentType, this.viewContainerRef);
        // this.childrenComponent = this.children.map((descendant, index) => {
        //     NODE_TO_INDEX.set(descendant, index);
        //     NODE_TO_PARENT.set(descendant, this.element);
        //     return this.createView(index, descendant) as any;
        // }) as (EmbeddedViewRef<any> | ComponentRef<any>)[];
    }

    ngAfterViewInit(): void {
        this.container2.build(this.elementRef.nativeElement);
    }
}
