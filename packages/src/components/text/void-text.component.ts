
import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnInit
} from '@angular/core';
import { BaseTextComponent } from '../../view/base';
import { AngularEditor } from '../../plugins/angular-editor';

@Component({
    selector: 'span[slateVoidText]',
    template: `<slate-leaves [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"></slate-leaves>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.contenteditable]': 'isLeafBlock',
        'data-slate-spacer': "true",
        'class': 'slate-spacer',
        'data-slate-node': 'text'
    }
})
export class SlateVoidTextComponent extends BaseTextComponent implements OnInit {
    isLeafBlock;

    ngOnInit() {
        this.isLeafBlock = AngularEditor.isLeafBlock(this.viewContext.editor, this.context.parent);
        super.ngOnInit();
    }
}