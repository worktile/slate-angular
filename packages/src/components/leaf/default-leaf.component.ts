
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PLACEHOLDER_SYMBOL } from "slate-angular";
import { BaseLeafComponent } from "../../view/base";

@Component({
    selector: 'span[slateDefaultLeaf]',
    template: `
        <ng-container *ngIf="context.leaf[placeholderSymbol]">
            <span contenteditable="false" data-slate-placeholder="true" slate-placeholder="true">{{context.leaf['placeholder']}}</span>
        </ng-container>
        <span slateString [context]="context" [viewContext]="viewContext"><span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-leaf': 'true'
    }
})
export class SlateDefaultLeafComponent extends BaseLeafComponent {
    public placeholderSymbol = PLACEHOLDER_SYMBOL
}