import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { createEditor, Element, Node } from 'slate';
import { AngularEditor } from '../plugins/angular-editor';
import { SlateEditable } from '../components/editable/editable.component';
import { withAngular } from '../plugins/with-angular';

@Component({
    selector: 'image-editable',
    template: ` <slate-editable [editor]="editor" [ngModel]="value"></slate-editable> `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImageEditableComponent implements OnInit {
    editor = withImage(withAngular(createEditor()));

    value = [
        {
            type: 'image',
            url: 'https://source.unsplash.com/kFrdX5IeQzI',
            children: [
                {
                    text: ''
                }
            ]
        }
    ];

    @ViewChild(SlateEditable, { static: true })
    editableComponent!: SlateEditable;

    ngOnInit() {}

    constructor() {}
}

const withImage = (editor: AngularEditor) => {
    const { isBlockCard, isVoid } = editor;
    editor.isBlockCard = (node: Node) => {
        if (Element.isElement(node) && (node as any).type === 'image') {
            return true;
        }
        return isBlockCard(node);
    };
    editor.isVoid = (node: Element) => {
        if (Element.isElement(node) && (node as any).type === 'image') {
            return true;
        }
        return isVoid(node);
    };
    return editor;
};
