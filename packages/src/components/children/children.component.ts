import { ChangeDetectionStrategy, Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { SlateNodeComponent } from "../node/node.component";
import { Descendant } from 'slate';
import { AngularEditor } from "../../plugins/angular-editor";
import { SlateChildrenContext, SlateViewContext } from "../../interfaces/view-context";
import { SlateViewContainer } from "../../interfaces/view-container";

@Component({
    selector: 'slate-children',
    template: `<slate-node 
                    [node]="node"
                    [context]="context" [viewContext]="viewContext"
                    [viewContext]="viewContext"
                    [index]="index"
                    *ngFor="let node of children;let index = index; trackBy: trackBy"></slate-node>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateChildrenComponent extends SlateViewContainer<SlateNodeComponent> implements OnInit {
    @Input() children: Descendant[];

    @Input() context: SlateChildrenContext;

    @Input() viewContext: SlateViewContext;

    @ViewChildren(SlateNodeComponent, { read: SlateNodeComponent })
    childrenComponent: QueryList<SlateNodeComponent>;

    ngOnInit() {
    }

    trackBy = (index, node) => {
        return AngularEditor.findKey(this.viewContext.editor, node);
    }
}
