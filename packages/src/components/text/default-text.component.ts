import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseTextComponent } from '../../view/base';
import { SlateLeaves } from '../leaves/leaves.component';

@Component({
    selector: 'span[slateDefaultText]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-node': 'text'
    },
    imports: [SlateLeaves]
})
export class SlateDefaultText extends BaseTextComponent {}
