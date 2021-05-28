import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { createEditor, Text, Editor, Element, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { withAngular } from 'slate-angular';
import { DemoMarkTextComponent, MarkTypes } from '../components/text/text.component';
import isHotkey from 'is-hotkey';

const SLATE_DEV_MODE_KEY = 'slate-dev';

const HOTKEYS = {
    'mod+b': MarkTypes.bold,
    'mod+i': MarkTypes.italic,
    'mod+u': MarkTypes.underline,
    'mod+`': MarkTypes.strike,
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

@Component({
    selector: 'demo-richtext',
    templateUrl: 'richtext.component.html'
})
export class DemoRichtextComponent implements OnInit {
    value = initialValue;

    toggleBlock = (format) => {
        const isActive = this.isBlockActive(format)
        const isList = LIST_TYPES.includes(format)

        Transforms.unwrapNodes(this.editor, {
            match: n =>
                LIST_TYPES.includes(Element.isElement(n) && n.type),
            split: true,
        })
        const newProperties: Partial<Element> = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
        Transforms.setNodes(this.editor, newProperties)

        if (!isActive && isList) {
            const block = { type: format, children: [] }
            Transforms.wrapNodes(this.editor, block)
        }
    }

    toggleMark = (format) => {
        const isActive = this.isMarkActive(format)

        if (isActive) {
            Editor.removeMark(this.editor, format)
        } else {
            Editor.addMark(this.editor, format, true)
        }
    }

    isBlockActive = (format) => {
        const [match] = Editor.nodes(this.editor, {
            match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === format,
        })

        return !!match
    }

    isMarkActive = (format) => {
        const marks = Editor.marks(this.editor)
        return marks ? marks[format] === true : false
    }

    toolbarItems = [
        {
            format: MarkTypes.bold,
            icon: 'format_bold',
            active: this.isMarkActive,
            action: this.toggleMark
        },
        {
            format: MarkTypes.italic,
            icon: 'format_italic',
            active: this.isMarkActive,
            action: this.toggleMark
        },
        {
            format: MarkTypes.underline,
            icon: 'format_underlined',
            active: this.isMarkActive,
            action: this.toggleMark
        },
        {
            format: MarkTypes.code,
            icon: 'code',
            active: this.isMarkActive,
            action: this.toggleMark
        },
        {
            format: 'heading-one',
            icon: 'looks_one',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
        {
            format: 'heading-two',
            icon: 'looks_two',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
        {
            format: 'block-quote',
            icon: 'format_quote',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
        {
            format: 'numbered-list',
            icon: 'format_list_numbered',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
        {
            format: 'bulleted-list',
            icon: 'format_list_bulleted',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
    ];

    @ViewChild('heading_1', { read: TemplateRef, static: true })
    headingOneTemplate: TemplateRef<any>;

    @ViewChild('heading_2', { read: TemplateRef, static: true })
    headingTwoTemplate: TemplateRef<any>;

    @ViewChild('heading_3', { read: TemplateRef, static: true })
    headingThreeTemplate: TemplateRef<any>;

    @ViewChild('blockquote', { read: TemplateRef, static: true })
    blockquoteTemplate: TemplateRef<any>;

    @ViewChild('ul', { read: TemplateRef, static: true })
    ulTemplate: TemplateRef<any>;

    @ViewChild('ol', { read: TemplateRef, static: true })
    olTemplate: TemplateRef<any>;

    @ViewChild('li', { read: TemplateRef, static: true })
    liTemplate: TemplateRef<any>;

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

    renderElement = (element: Element & { type: string }) => {
        if (element.type === 'heading-one') {
            return this.headingOneTemplate;
        }
        if (element.type === 'heading-two') {
            return this.headingTwoTemplate;
        }
        if (element.type === 'heading-three') {
            return this.headingThreeTemplate;
        }
        if (element.type === 'block-quote') {
            return this.blockquoteTemplate;
        }
        if (element.type === 'numbered-list') {
            return this.olTemplate;
        }
        if (element.type === 'bulleted-list') {
            return this.ulTemplate;
        }
        if (element.type === 'list-item') {
            return this.liTemplate;
        }
        return null;
    }

    renderText = (text: Text) => {
        if (text[MarkTypes.bold] || text[MarkTypes.italic] || text[MarkTypes.code] || text[MarkTypes.underline]) {
            return DemoMarkTextComponent;
        }
    }

    slaKeyDown = (event: KeyboardEvent) => {
        for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                this.toggleMark(mark);
            }
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
            { text: '<textarea>', 'code-line': true },
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
