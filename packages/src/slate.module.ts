import { NgModule, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlaEditableComponent } from './components/editable/editable.component';
import { SlaTextComponent } from './components/text/text.component';
import { SlaElementComponent } from './components/element/element.component';
import { SlaStringComponent } from './components/string/string.component';
import { SlaTemplateComponent } from './components/template/template.component';
import { SlaNestEntryComponent } from './components/nest/nest-entry.component';
import { SlaNestChildrenEntryComponent } from './components/nest/nest-children-entry.component';
import { SlaBlockCardComponent } from './components/block-card/block-card.component';

@NgModule({
    declarations: [
        SlaEditableComponent,
        SlaElementComponent,
        SlaTextComponent,
        SlaStringComponent,
        SlaTemplateComponent,
        SlaNestEntryComponent,
        SlaNestChildrenEntryComponent,
        SlaBlockCardComponent
    ],
    imports: [CommonModule],
    entryComponents: [SlaBlockCardComponent],
    exports: [SlaEditableComponent, SlaStringComponent, SlaTextComponent, SlaElementComponent, SlaNestEntryComponent, SlaNestChildrenEntryComponent, SlaBlockCardComponent]
})
export class SlateModule {}
