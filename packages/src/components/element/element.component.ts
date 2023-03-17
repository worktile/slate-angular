import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseElementComponent } from '../../view/base';

@Component({
    selector: '[slateElement]',
    template:
        '<slate-children [children]="children" [context]="childrenContext" [viewContext]="viewContext"></slate-children><ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateElementComponent extends BaseElementComponent {}
