import { Component, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { BaseTextComponent } from '../../view/base';
import { AngularEditor } from '../../plugins/angular-editor';
import { SlateLeaves } from '../leaves/leaves.component';

@Component({
    selector: 'span[slateVoidText]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-spacer': 'true',
        class: 'slate-spacer',
        'data-slate-node': 'text'
    },
    imports: [SlateLeaves]
})
export class SlateVoidText extends BaseTextComponent implements OnInit, OnChanges {
    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges() {
        if (!this.initialized) {
            return;
        }
    }
}
