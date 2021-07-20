import { Component } from "@angular/core";
import { createEditor, Descendant } from "slate";
import { withAngular } from "slate-angular";

@Component({
    selector: 'demo-readonly',
    template: `
    <div class="demo-rich-editor-wrapper">
        <slate-editable [readonly]="true" class="demo-slate-angular-editor" [editor]="editor" [(ngModel)]="value"></slate-editable>
    </div>
    `
})
export class DemoReadonlyComponent {
    constructor() { }

    value = initialValue;

    editor = withAngular(createEditor());
}

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            {
                text:
                    'This example shows what happens when the Editor is set to readOnly, it is not editable',
            },
        ],
    },
]