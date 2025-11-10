import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlateEditable } from './components/editable/editable.component';
import { SlateChildrenOutlet } from './components/children/children-outlet.component';
import { SlateBlockCard } from './components/block-card/block-card.component';

@NgModule({
    imports: [CommonModule, SlateEditable, SlateBlockCard, SlateChildrenOutlet],
    exports: [SlateEditable, SlateChildrenOutlet],
    providers: []
})
export class SlateModule {}
