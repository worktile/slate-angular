import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseElementComponent } from '../../view/base';
import { SlateChildrenComponent } from '../children/children.component';

@Component({
    selector: '[slateElement]',
    template: '<slate-children [children]="children" [context]="childrenContext" [viewContext]="viewContext"></slate-children><ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SlateChildrenComponent]
})
export class SlateElementComponent extends BaseElementComponent {}
