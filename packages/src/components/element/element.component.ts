import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseElementComponent } from '../../view/base';
import { SlateChildren } from '../children/children.component';

@Component({
    selector: '[slateElement]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SlateChildren]
})
export class SlateElement extends BaseElementComponent {}
