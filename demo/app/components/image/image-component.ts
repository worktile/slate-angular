import { Component } from '@angular/core';
import { BaseElementComponent } from 'slate-angular';

@Component({
    selector: 'demo-element-image',
    template: `<slate-children [children]="children" [context]="childrenContext" [viewContext]="viewContext"></slate-children>
              <img [src]="element.url" alt="" [class.outline]="selection"> `,
    host: {
        class: 'demo-element-image'
    }
})
export class DemoElementImageComponent extends BaseElementComponent {
}
