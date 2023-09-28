import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BaseLeafComponent } from '../../view/base';
import { SlateString } from '../string/string.component';

@Component({
    selector: 'span[slateDefaultLeaf]',
    template: `<span slateString [context]="context" [viewContext]="viewContext"></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-leaf': 'true'
    },
    standalone: true,
    imports: [SlateString]
})
export class SlateDefaultLeaf extends BaseLeafComponent implements OnDestroy {
    onContextChange(): void {
        super.onContextChange();
        this.renderPlaceholder();
    }
    ngOnDestroy(): void {
        // Because the placeholder span is not in the current component, it is destroyed along with the current component
        this.destroyPlaceholder();
    }
}
