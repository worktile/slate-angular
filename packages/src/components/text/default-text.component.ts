import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseTextComponent } from '../../view/base';
import { SlateLeaves } from '../leaves/leaves.component';

@Component({
    selector: 'span[slateDefaultText]',
    template: `<slate-leaves [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"></slate-leaves>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-node': 'text'
    },
    standalone: true,
    imports: [SlateLeaves]
})
export class SlateDefaultText extends BaseTextComponent {}
