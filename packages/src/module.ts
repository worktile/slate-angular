import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlateEditable } from './components/editable/editable.component';
import { SlateChildrenOutlet } from './components/children/children-outlet.component';
import { SlateBlockCard } from './components/block-card/block-card.component';
import { SlateString } from './components/string/string.component';

@NgModule({
    imports: [CommonModule, SlateEditable, SlateBlockCard, SlateChildrenOutlet, SlateString],
    exports: [SlateEditable, SlateChildrenOutlet, SlateString],
    providers: []
})
export class SlateModule {}
