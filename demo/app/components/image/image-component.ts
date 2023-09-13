import { Component } from '@angular/core';
import { ImageElement } from '../../../../custom-types';
import { BaseElementComponent } from 'slate-angular';
import { SlateChildrenComponent } from '../../../../packages/src/components/children/children.component';

@Component({
    selector: 'demo-element-image',
    template: `<slate-children [children]="children" [context]="childrenContext" [viewContext]="viewContext"></slate-children>
        <img [src]="element.url" alt="" [class.outline]="selection" /> `,
    host: {
        class: 'demo-element-image'
    },
    standalone: true,
    imports: [SlateChildrenComponent]
})
export class DemoElementImageComponent extends BaseElementComponent<ImageElement> {}
