import { Component, inject, Renderer2 } from '@angular/core';
import { BaseLeafComponent } from 'slate-angular';

@Component({
    selector: 'span[testingLeaf]',
    template: ` <span slateString [context]="context" [viewContext]="viewContext"><span></span></span> `,
    host: {
        class: 'testing-leaf'
    },
    standalone: false
})
export class TestingLeafComponent extends BaseLeafComponent {
    private renderer = inject(Renderer2);

    onContextChange() {
        super.onContextChange();
        this.changeStyle();
    }

    changeStyle() {
        const backgroundColor = this.leaf['highlight'] ? '#ffeeba' : null;
        this.renderer.setStyle(this.nativeElement, 'backgroundColor', backgroundColor);
    }
}
