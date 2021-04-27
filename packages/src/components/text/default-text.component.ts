import {
    Component,
    ChangeDetectionStrategy,
    OnInit
} from '@angular/core';
import { SlateTextComponentBase } from '../../interfaces/view-base';

@Component({
    selector: 'span[slateText]',
    template: `<slate-leaves [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"></slate-leaves>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-node': 'text'
    }
})
export class SlateDefaultTextComponent extends SlateTextComponentBase {
}