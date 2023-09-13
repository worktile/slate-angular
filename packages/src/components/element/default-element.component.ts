import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseElementComponent } from '../../view/base';
import { SlateChildrenComponent } from '../children/children.component';

@Component({
    selector: 'div[slateDefaultElement]',
    template: `<slate-children [children]="children" [context]="childrenContext" [viewContext]="viewContext"></slate-children>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SlateChildrenComponent]
})
export class SlateDefaultElementComponent extends BaseElementComponent {}
