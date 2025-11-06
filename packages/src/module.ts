import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlateEditable } from './components/editable/editable.component';
import { SlateString } from './components/string/string.component';
import { SlateStringTemplate } from './components/string/template.component';
import { SlateChildren } from './components/children/children.component';
import { SlateChildrenOutlet } from './components/children/children-outlet.component';
import { SlateBlockCard } from './components/block-card/block-card.component';
import { SlateDefaultLeaf } from './components/leaf/default-leaf.component';
import { SlateLeaves } from './components/leaves/leaves.component';

@NgModule({
    imports: [
        CommonModule,
        SlateEditable,
        SlateString,
        SlateStringTemplate,
        SlateChildren,
        SlateBlockCard,
        SlateLeaves,
        SlateDefaultLeaf,
        SlateChildrenOutlet
    ],
    exports: [SlateEditable, SlateChildren, SlateChildrenOutlet, SlateLeaves, SlateString],
    providers: []
})
export class SlateModule {}
