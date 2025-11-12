import { Component, inject, Renderer2 } from '@angular/core';
import { BaseLeafComponent } from 'slate-angular';

@Component({
    selector: 'span[demoLeaf]',
    template: ``,
    imports: []
})
export class DemoLeafComponent extends BaseLeafComponent {
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
