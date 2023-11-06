import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Descendant } from 'slate';
import { SlateChildrenContext, SlateViewContext } from '../../view/context';
import { ViewContainer } from '../../view/container';
import { NgFor } from '@angular/common';

@Component({
    selector: 'slate-children',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgFor]
})
export class SlateChildren extends ViewContainer<any> {
    @Input() children: Descendant[];

    @Input() context: SlateChildrenContext;

    @Input() viewContext: SlateViewContext;
}
