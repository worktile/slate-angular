import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlateEditable } from './components/editable/editable.component';
import { SlateChildrenOutlet } from './components/children/children-outlet.component';

@NgModule({
    imports: [CommonModule, SlateEditable, SlateChildrenOutlet],
    exports: [SlateEditable, SlateChildrenOutlet],
    providers: []
})
export class SlateModule {}
