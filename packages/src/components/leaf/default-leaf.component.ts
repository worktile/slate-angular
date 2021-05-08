
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BaseLeafComponent } from "../../view/base";

@Component({
    selector: 'span[slateDefaultLeaf]',
    template: `<span slateString [context]="context" [viewContext]="viewContext"><span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-leaf': 'true'
    }
})
export class SlateDefaultLeafComponent extends BaseLeafComponent {
}