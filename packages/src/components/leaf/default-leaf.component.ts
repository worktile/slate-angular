import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BaseLeafComponent } from '../../view/base';
import { SlateStringComponent } from '../string/string.component';

@Component({
    selector: 'span[slateDefaultLeaf]',
    template: `<span slateString [context]="context" [viewContext]="viewContext"><span></span></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-leaf': 'true'
    },
    standalone: true,
    imports: [SlateStringComponent]
})
export class SlateDefaultLeafComponent extends BaseLeafComponent implements OnDestroy {
    onContextChange(): void {
        super.onContextChange();
        this.renderPlaceholder();
    }
    ngOnDestroy(): void {
        // Because the placeholder span is not in the current component, it is destroyed along with the current component
        this.destroyPlaceholder();
    }
}
