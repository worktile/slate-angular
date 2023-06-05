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
import { SlateLeafContext, SlateTextContext, SlateViewContext } from '../../view/context';
import { ViewContainer } from '../../view/container';
import { SlateLeafComponent } from '../leaf/leaf.component';
import { isDecoratorRangeListEqual } from '../../utils/range-list';

@Component({
    selector: 'slate-leaves',
    template: `<slate-leaf
        [context]="context"
        [viewContext]="viewContext"
        [viewContext]="viewContext"
        *ngFor="let context of leafContexts; trackBy: trackBy"
    ></slate-leaf>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateLeavesComponent extends ViewContainer<SlateLeafComponent> implements OnInit, AfterViewInit, OnChanges {
    initialized = false;
    leafContexts: SlateLeafContext[];
    leaves: Text[];

    @Input() context: SlateTextContext;

    @ViewChildren(SlateLeafComponent, { read: SlateLeafComponent })
    childrenComponent: QueryList<SlateLeafComponent>;

    ngOnInit() {
        this.leaves = Text.decorations(this.context.text, this.context.decorations);
        this.leafContexts = this.getLeafContexts();
        this.initialized = true;
    }

    getLeafContexts() {
        return this.leaves.map((leaf, index) => {
            return {
                leaf,
                text: this.context.text,
                parent: this.context.parent,
                index,
                isLast: this.context.isLast && index === this.leaves.length - 1
            };
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (!this.initialized) {
            return;
        }
        const context = simpleChanges['context'];
        const previousValue: SlateTextContext = context.previousValue;
        const currentValue: SlateTextContext = context.currentValue;
        if (previousValue.text !== currentValue.text || !isDecoratorRangeListEqual(previousValue.decorations, currentValue.decorations)) {
            this.leaves = Text.decorations(this.context.text, this.context.decorations);
        }
        this.leafContexts = this.getLeafContexts();
    }

    trackBy(index, item) {
        return index;
    }
}
