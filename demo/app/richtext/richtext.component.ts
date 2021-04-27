import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { createEditor, Text as SlateText, Editor, Element } from 'slate';
import { withHistory } from 'slate-history';
import { withAngular } from 'slate-angular';
import { DemoMarkTextComponent } from '../components/text/text.component';

const SLATE_DEV_MODE_KEY = 'slate-dev';

@Component({
    selector: 'demo-richtext',
    templateUrl: 'richtext.component.html'
})
export class DemoRichtextComponent implements OnInit {
    value = initialValue;

    markTypes = ['bold', 'italic', 'code'];

    @ViewChild('heading', { read: TemplateRef, static: true })
    headingTemplate: TemplateRef<any>;

    @ViewChild('blockquote', { read: TemplateRef, static: true })
    blockquoteTemplate: TemplateRef<any>;

    editor = withHistory(withAngular(createEditor()));

    ngOnInit(): void {
        if (!localStorage.getItem(SLATE_DEV_MODE_KEY)) {
            console.log(`open dev mode use code：window.localStorage.setItem('${SLATE_DEV_MODE_KEY}', true);`);
        }
    }

    valueChange(event) {
        if (localStorage.getItem(SLATE_DEV_MODE_KEY)) {
            console.log(`anchor: ${JSON.stringify(this.editor.selection?.anchor)}\nfocus:  ${JSON.stringify(this.editor.selection?.focus)}`);
            console.log('operations: ', this.editor.operations);
        }
    }

    renderElement = (element: Element) => {
        if ((element.type as string).startsWith('heading')) {
            return this.headingTemplate;
        }
        if (element.type === 'block-quote') {
            return this.blockquoteTemplate;
        }
        return null;
    }

    renderText = (text: SlateText) => {
        if (text.bold || text.italic || text.code) {
            return DemoMarkTextComponent;
        }
    }

    isActive(type: string) {
        const marks = Editor.marks(this.editor);
        return marks ? marks[type] : false;
    }

    toggleMark(event: MouseEvent, type: string) {
        event.preventDefault();
        if (this.isActive(type)) {
            Editor.removeMark(this.editor, type);
        } else {
            Editor.addMark(this.editor, type, 'true');
        }
    }
}
const initialValue = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is editable ' },
            { text: 'rich', bold: true },
            { text: ' text, ' },
            { text: 'much', bold: true, italic: true },
            { text: ' better than a ' },
            { text: '<textarea>', code: true },
            { text: '!' }
        ]
    },
    {
        type: 'heading-one',
        children: [{ text: 'This is h1 ' }]
    },
    {
        type: 'heading-three',
        children: [{ text: 'This is h3 ' }]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: `Since it's rich text, you can do things like turn a selection of text `
            },
            { text: 'bold', bold: true },
            {
                text: ', or add a semantically rendered block quote in the middle of the page, like this:'
            }
        ]
    },
    {
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }]
    },
    {
        type: 'paragraph',
        children: [{ text: 'Try it out for yourself!' }]
    },
    {
        type: 'paragraph',
        children: [{ text: '' }]
    }
];
