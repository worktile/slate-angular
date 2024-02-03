import { Component } from '@angular/core';
import { ImageElement } from '../../../../custom-types';
import { BaseElementComponent } from 'slate-angular';
import { SlateChildren } from '../../../../packages/src/components/children/children.component';

@Component({
    selector: 'demo-element-image',
    template: `<img [src]="element.url" alt="" [class.outline]="selection" /> `,
    host: {
        class: 'demo-element-image'
    },
    standalone: true,
    imports: [SlateChildren]
})
export class DemoElementImageComponent extends BaseElementComponent<ImageElement> {}
