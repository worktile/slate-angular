
import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnInit
} from '@angular/core';
import { SlateTextContext, SlateViewContext } from '../../interfaces/view-context';
import { AngularEditor } from '../../plugins/angular-editor';

@Component({
    selector: 'span[slateVoidText]',
    template: `<span slateText [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-node': 'text',
        '[attr.contenteditable]': 'isLeafBlock',
        'data-slate-spacer': "true"
    }
})
export class SlateVoidTextComponent implements OnInit {
    @Input() context: SlateTextContext;
    @Input() viewContext: SlateViewContext;
    isLeafBlock = false;

    ngOnInit() {
        this.isLeafBlock = AngularEditor.isLeafBlock(this.viewContext.editor, this.context.parent);
    }
}
