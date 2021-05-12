import {
    Component,
    ChangeDetectionStrategy,
    OnInit
} from '@angular/core';
import { BaseTextComponent } from '../../view/base';

@Component({
    selector: 'span[slateDefaultText]',
    template: `<slate-leaves [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"></slate-leaves>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-node': 'text'
    }
})
export class SlateDefaultTextComponent extends BaseTextComponent {
}