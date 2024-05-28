import { Component, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { BaseTextComponent } from '../../view/base';

@Component({
    selector: 'span[slateVoidText]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-spacer': 'true',
        class: 'slate-spacer',
        'data-slate-node': 'text'
    },
    standalone: true
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
