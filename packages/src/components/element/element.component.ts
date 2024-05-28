import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseElementComponent } from '../../view/base';

@Component({
    selector: '[slateElement]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SlateElement extends BaseElementComponent {}
