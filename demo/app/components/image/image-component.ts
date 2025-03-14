import { Component } from '@angular/core';
import { ImageElement } from '../../../../custom-types';
import { BaseElementComponent } from 'slate-angular';

@Component({
    selector: 'demo-element-image',
    template: `<img [src]="element.url" alt="" [class.outline]="selection" /> `,
    host: {
        class: 'demo-element-image'
    }
})
export class DemoElementImageComponent extends BaseElementComponent<ImageElement> {}
