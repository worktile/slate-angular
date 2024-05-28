import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseElementComponent } from '../../view/base';

@Component({
    selector: 'div[slateDefaultElement]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SlateDefaultElement extends BaseElementComponent {}
