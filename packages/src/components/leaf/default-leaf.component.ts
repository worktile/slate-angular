
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SlateLeafComponentBase } from "../../interfaces/view-base";

@Component({
    selector: 'span[slateDefaultLeaf]',
    template: `<span slateString [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"><span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-leaf': 'true'
    }
})
export class SlateDefaultLeafComponent extends SlateLeafComponentBase {
}