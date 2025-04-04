import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseElementComponent } from '../../view/base';

@Component({
    selector: '[slateElement]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateElement extends BaseElementComponent {}
