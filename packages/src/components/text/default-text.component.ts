import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseTextComponent } from '../../view/base';
@Component({
    selector: 'span[slateDefaultText]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-node': 'text'
    }
})
export class SlateDefaultText extends BaseTextComponent {}
