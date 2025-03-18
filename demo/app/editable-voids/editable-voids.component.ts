import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Descendant, Editor, Element as SlateElement, Text, Transforms, createEditor } from 'slate';
import { SlateEditable, withAngular } from 'slate-angular';
import { withHistory } from 'slate-history';
import { DemoButtonComponent } from '../components/button/button.component';

import { EditableVoidElement } from 'custom-types';
import { DemoElementEditableVoid } from '../components/editable-void/editable-void.component';

interface ToolbarItem {
    icon: string;
    active: () => boolean;
    action: (event: Event) => void;
}

@Component({
    selector: 'demo-editable-voids',
    templateUrl: './editable-voids.component.html',
    styleUrls: ['./editable-voids.component.scss'],
    imports: [SlateEditable, FormsModule, DemoButtonComponent]
})
export class DemoEditableVoidsComponent {
    value = initialValue;

    editor = withEditableVoids(withHistory(withAngular(createEditor())));

    toolbarItems: Array<ToolbarItem> = [
        {
            icon: 'add',
            active: () => true,
            action: event => {
                event.preventDefault();
                const text: Text = { text: '' };
                const voidNode: EditableVoidElement = {
                    type: 'editable-void',
                    children: [text]
                };
                Transforms.insertNodes(this.editor, voidNode);
            }
        }
    ];

    renderElement = (element: SlateElement) => {
        if (element.type === 'editable-void') {
            return DemoElementEditableVoid;
        }
        return null;
    };
}

const withEditableVoids = (editor: Editor) => {
    const { isVoid } = editor;

    editor.isVoid = element => {
        return element.type === 'editable-void' || isVoid(element);
    };

    return editor;
};

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            {
                text: 'In addition to nodes that contain editable text, you can insert void nodes, which can also contain editable elements, inputs, or an entire other Slate editor.'
            }
        ]
    },
    {
        type: 'editable-void',
        children: [{ text: '' }]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: ''
            }
        ]
    }
];
