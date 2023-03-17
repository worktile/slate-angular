import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ViewContainerItem } from '../../view/container-item';
import { SlateLeafContext } from '../../view/context';
import { BaseLeafComponent } from '../../view/base';
import { SlateDefaultLeafComponent } from './default-leaf.component';
import { ViewType } from '../../types/view';

@Component({
    selector: 'slate-leaf',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateLeafComponent extends ViewContainerItem<SlateLeafContext, BaseLeafComponent> implements OnInit, OnChanges {
    @Input() context: SlateLeafContext;

    ngOnInit() {
        this.createView();
    }

    getContext(): SlateLeafContext {
        return this.context;
    }

    getViewType(): ViewType {
        return (this.viewContext.renderLeaf && this.viewContext.renderLeaf(this.context.leaf)) || SlateDefaultLeafComponent;
    }

    memoizedContext(prev: SlateLeafContext, next: SlateLeafContext): boolean {
        return false;
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (!this.initialized) {
            return;
        }
        this.updateView();
    }
}
