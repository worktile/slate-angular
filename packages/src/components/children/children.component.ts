import { ChangeDetectionStrategy, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SlateDescendantComponent } from '../descendant/descendant.component';
import { Descendant } from 'slate';
import { AngularEditor } from '../../plugins/angular-editor';
import { SlateChildrenContext, SlateViewContext } from '../../view/context';
import { ViewContainer } from '../../view/container';
import { NgFor } from '@angular/common';

@Component({
    selector: 'slate-children',
    template: `<slate-descendant
        [descendant]="descendant"
        [context]="context"
        [viewContext]="viewContext"
        [viewContext]="viewContext"
        [index]="index"
        *ngFor="let descendant of children; let index = index; trackBy: trackBy"
    ></slate-descendant>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgFor, SlateDescendantComponent]
})
export class SlateChildrenComponent extends ViewContainer<SlateDescendantComponent> implements OnInit {
    @Input() children: Descendant[];

    @Input() context: SlateChildrenContext;

    @Input() viewContext: SlateViewContext;

    @ViewChildren(SlateDescendantComponent, { read: SlateDescendantComponent })
    childrenComponent: QueryList<SlateDescendantComponent>;

    ngOnInit() {}

    trackBy = (index, node) => {
        return this.viewContext.trackBy(node) || AngularEditor.findKey(this.viewContext.editor, node);
    };
}
