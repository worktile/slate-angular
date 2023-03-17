import { Component, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { BaseLeafComponent } from 'slate-angular';

@Component({
    selector: 'span[demoLeaf]',
    template: ` <span slateString [context]="context" [viewContext]="viewContext"><span></span></span> `
})
export class DemoLeafComponent extends BaseLeafComponent {
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
