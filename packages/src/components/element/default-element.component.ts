import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseElementComponent } from '../../view/base';
import { SlateChildren } from '../children/children.component';

@Component({
    selector: 'div[slateDefaultElement]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SlateChildren]
})
export class SlateDefaultElement extends BaseElementComponent {}
