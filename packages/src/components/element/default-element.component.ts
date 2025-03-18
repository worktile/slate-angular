import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseElementComponent } from '../../view/base';
import { SlateChildren } from '../children/children.component';

@Component({
    selector: 'div[slateDefaultElement]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SlateChildren]
})
export class SlateDefaultElement extends BaseElementComponent {}
