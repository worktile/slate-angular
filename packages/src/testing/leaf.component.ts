import { Component, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { BaseLeafComponent } from 'slate-angular';

@Component({
    selector: 'span[testingLeaf]',
    template: ` <span slateString [context]="context" [viewContext]="viewContext"><span></span></span> `,
    host: {
        class: 'testing-leaf'
    }
})
export class TestingLeafComponent extends BaseLeafComponent {
    constructor(public elementRef: ElementRef, public cdr: ChangeDetectorRef, private renderer: Renderer2) {
        super(elementRef, cdr);
    }

    onContextChange() {
        super.onContextChange();
        this.changeStyle();
    }

    changeStyle() {
        const backgroundColor = this.leaf['highlight'] ? '#ffeeba' : null;
        this.renderer.setStyle(this.nativeElement, 'backgroundColor', backgroundColor);
    }
}
