import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseTextComponent } from '../../view/base';
import { SlateLeavesComponent } from '../leaves/leaves.component';

@Component({
    selector: 'span[slateDefaultText]',
    template: `<slate-leaves [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"></slate-leaves>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-node': 'text'
    },
    standalone: true,
    imports: [SlateLeavesComponent]
})
export class SlateDefaultTextComponent extends BaseTextComponent {}
