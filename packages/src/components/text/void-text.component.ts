import { Component, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { BaseTextComponent } from '../../view/base';
import { AngularEditor } from '../../plugins/angular-editor';
import { SlateLeaves } from '../leaves/leaves.component';

@Component({
    selector: 'span[slateVoidText]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.contenteditable]': 'isLeafBlock',
        'data-slate-spacer': 'true',
        class: 'slate-spacer',
        'data-slate-node': 'text'
    },
    standalone: true,
    imports: [SlateLeaves]
})
export class SlateVoidText extends BaseTextComponent implements OnInit, OnChanges {
    isLeafBlock: boolean;

    ngOnInit() {
        this.isLeafBlock = AngularEditor.isLeafBlock(this.viewContext.editor, this.context.parent);
        super.ngOnInit();
    }

    ngOnChanges() {
        if (!this.initialized) {
            return;
        }
        this.isLeafBlock = AngularEditor.isLeafBlock(this.viewContext.editor, this.context.parent);
    }
}
