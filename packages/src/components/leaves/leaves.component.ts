import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    QueryList,
    SimpleChanges,
    ViewChildren
} from '@angular/core';
import { Text } from 'slate';
import { SlateLeafContext, SlateTextContext } from '../../view/context';
import { ViewContainer } from '../../view/container';

@Component({
    selector: 'slate-leaves',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: []
})
export class SlateLeaves extends ViewContainer<any> {
    initialized = false;
    leafContexts: SlateLeafContext[];
    leaves: Text[];

    @Input() context: SlateTextContext;
}
