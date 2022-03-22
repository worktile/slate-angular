import { Component, ViewChild } from "@angular/core";
import { createEditor, Element } from "slate";
import { SlateEditableComponent } from "../components/editable/editable.component";
import { withAngular } from "../plugins/with-angular";
import { createDefaultDocument } from "./create-document";

@Component({
    selector: 'basic-editable',
    template: `
        <slate-editable 
            [editor]="editor"
            [(ngModel)]="value"
            (ngModelChange)="ngModelChange()"></slate-editable>
    `
})
export class BasicEditableComponent {
    editor = withAngular(createEditor());

    value: Element[] = createDefaultDocument() as Element[];

    @ViewChild(SlateEditableComponent, { static: true })
    editableComponent: SlateEditableComponent;

    ngModelChange() {
    }

    constructor() {
    }
}
