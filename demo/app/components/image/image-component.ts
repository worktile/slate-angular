import { Component, ElementRef, Renderer2, ChangeDetectorRef, HostListener, Output, EventEmitter } from '@angular/core';
import { BaseElementComponent } from 'slate-angular';

@Component({
    selector: 'demo-element-image,[demoImage]',
    template: `<img [src]="element.url" alt="" contenteditable="false">`,
    host: {
        '[attr.contenteditable]': 'false',
        class: 'demo-element-image'
    }
})
export class DemoElementImageComponent extends BaseElementComponent {
}
