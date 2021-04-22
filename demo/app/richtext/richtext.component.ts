import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { createEditor, Text as SlateText, Editor, Operation } from 'slate';
import { withHistory } from 'slate-history';
import { withAngular } from 'packages/src/public-api';

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

    editor = withHistory(withAngular(createEditor()));

    ngOnInit(): void {
        if (!localStorage.getItem(SLATE_DEV_MODE_KEY)) {
            console.log(`open dev mode use code：window.localStorage.setItem('${SLATE_DEV_MODE_KEY}', true);`);
        }
    }

    valueChange(event) {
        if (localStorage.getItem(SLATE_DEV_MODE_KEY)) {
            console.log(`anchor: ${JSON.stringify(this.editor.selection?.anchor)}\nfocus:  ${JSON.stringify(this.editor.selection?.focus)}`);
        }
    }

    renderElement = (element: any) => {
        if (element.type.startsWith('heading')) {
            return this.headingTemplate;
        }
        return null;
    }

    renderMark = (text: SlateText) => {
        let rootDOM;
        let deepestDOM;
        if (text.bold) {
            const strong = document.createElement('strong');
            rootDOM = strong;
            deepestDOM = strong;
        }
        if (text.italic) {
            const em = document.createElement('em');
            if (rootDOM) {
                em.appendChild(rootDOM);
            }
            if (!deepestDOM) {
                deepestDOM = rootDOM || em;
            }
            rootDOM = em;
        }
        if (text.code) {
            const code = document.createElement('code');
            if (rootDOM) {
                code.appendChild(rootDOM);
            }
            if (!deepestDOM) {
                deepestDOM = rootDOM || code;
            }
            rootDOM = code;
        }
        return { rootDOM, deepestDOM };
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
    }
];
