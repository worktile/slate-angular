import { Component, ViewChild } from '@angular/core';
import { createEditor, Element } from 'slate';
import { SlateEditable } from '../components/editable/editable.component';
import { withAngular } from '../plugins/with-angular';
import { createDefaultDocument } from './create-document';
@Component({
    selector: 'basic-editable',
    template: ` <slate-editable [editor]="editor" [(ngModel)]="value" (ngModelChange)="ngModelChange()"></slate-editable> `
})
export class BasicEditableComponent {
    editor = withAngular(createEditor());

    value: Element[] = createDefaultDocument() as Element[];

    @ViewChild(SlateEditable, { static: true })
    editableComponent: SlateEditable;

    ngModelChange() {}

    constructor() {}
}
