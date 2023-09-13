import { Component, OnInit, ViewChild } from '@angular/core';
import { createEditor, Editor, Element, Node } from 'slate';
import { SlateEditable } from '../components/editable/editable.component';
import { withAngular } from '../plugins/with-angular';

@Component({
    selector: 'image-editable',
    template: ` <slate-editable [editor]="editor" [ngModel]="value"></slate-editable> `
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
    editableComponent: SlateEditable;

    ngOnInit() {}

    constructor() {}
}

const withImage = (editor: Editor) => {
    const { isBlockCard, isVoid } = editor;
    editor.isBlockCard = (node: Element) => {
        if (Element.isElement(node) && node.type === 'image') {
            return true;
        }
        return isBlockCard(node);
    };
    editor.isVoid = (node: Element) => {
        if (Element.isElement(node) && node.type === 'image') {
            return true;
        }
        return isVoid(node);
    };
    return editor;
};
