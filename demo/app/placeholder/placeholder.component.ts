import { Component } from "@angular/core";
import { createEditor, Descendant } from "slate";
import { withAngular } from "slate-angular";

@Component({
    selector: 'demo-placeholder',
    template: `
    <div class="demo-rich-editor-wrapper">
        <slate-editable  class="demo-slate-angular-editor" placeholder="hello world" [editor]="editor" [(ngModel)]="value"></slate-editable>
    </div>
    `
})
export class DemoPlaceholderComponent {
    constructor() { }

    value = initialValue;

    editor = withAngular(createEditor());
}

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            {
                text: '',
            },
        ],
    },
]
