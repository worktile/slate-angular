import { Component, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { BaseLeafComponent } from 'slate-angular';
import { SlateString } from '../../../packages/src/components/string/string.component';

@Component({
    selector: 'span[demoLeaf]',
    template: ` <span slateString [context]="context" [viewContext]="viewContext"><span></span></span> `,
    standalone: true,
    imports: [SlateString]
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
