import { Component } from '@angular/core';
import { createEditor, Descendant, Editor, Node } from 'slate';
import { SlatePlaceholder, withAngular } from 'slate-angular';
import { FormsModule } from '@angular/forms';
import { SlateEditable } from '../../../packages/src/components/editable/editable.component';

@Component({
    selector: 'demo-placeholder',
    template: `
        <div class="demo-rich-editor-wrapper">
            <slate-editable
                class="demo-slate-angular-editor"
                placeholder="hello world"
                [editor]="editor"
                [(ngModel)]="value"
            ></slate-editable>
        </div>
        <div class="demo-rich-editor-wrapper">
            <slate-editable
                class="demo-slate-angular-editor"
                [placeholderDecorate]="placeholderDecorate"
                [editor]="editorWithCustomDecoration"
                [(ngModel)]="otherValue"
            ></slate-editable>
        </div>
    `,
    imports: [SlateEditable, FormsModule]
})
export class DemoPlaceholderComponent {
    constructor() {}

    value = initialValue;

    otherValue = [
        {
            type: 'paragraph',
            children: [
                {
                    text: 'Press Enter to make new paragraph and will show placeholder'
                }
            ]
        }
    ];

    placeholderDecorate: (editor: Editor) => SlatePlaceholder[] = editor => {
        const cursorAnchor = editor.selection?.anchor;
        if (cursorAnchor) {
            const parent = Node.parent(editor, cursorAnchor.path);
            if (parent.children.length === 1 && Array.from(Node.texts(parent)).length === 1 && Node.string(parent) === '') {
                const start = Editor.start(editor, cursorAnchor);
                return [
                    {
                        placeholder: 'advance placeholder use with placeholderDecoration',
                        anchor: start,
                        focus: start
                    }
                ];
            } else {
                return [];
            }
        }
        return [];
    };

    editor = withAngular(createEditor());

    editorWithCustomDecoration = withAngular(createEditor());
}

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            {
                text: ''
            }
        ]
    }
];
