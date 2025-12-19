import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SlateLeafContext, SlateViewContext } from '../../view/context';

@Component({
    selector: 'span[slateString]',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SlateString {
    @Input() context: SlateLeafContext;
    @Input() viewContext: SlateViewContext;

    ngOnInit(): void {}
}