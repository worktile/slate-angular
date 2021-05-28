import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Editor, Range, Point, Transforms, createEditor, Element } from 'slate';
import { withHistory } from 'slate-history';
import { withAngular } from 'slate-angular';
import { BulletedListElement } from '../../custom-types';

@Component({
    selector: 'demo-markdown-shortcuts',
    templateUrl: 'markdown-shortcuts.component.html'
})
export class DemoMarkdownShortcutsComponent implements OnInit {
    constructor() { }

    value = initialValue;

    editor = withShortcuts(withHistory(withAngular(createEditor())));

    @ViewChild('blockquoteTemplate', { read: TemplateRef, static: true })
    blockquoteTemplate: TemplateRef<any>;
    @ViewChild('liTemplate', { read: TemplateRef, static: true })
    liTemplate: TemplateRef<any>;
    @ViewChild('ulTemplate', { read: TemplateRef, static: true })
    ulTemplate: TemplateRef<any>;
    @ViewChild('heading_1', { read: TemplateRef, static: true })
    headingOneTemplate: TemplateRef<any>;
    @ViewChild('heading_2', { read: TemplateRef, static: true })
    headingTwoTemplate: TemplateRef<any>;
    @ViewChild('heading_3', { read: TemplateRef, static: true })
    headingThreeTemplate: TemplateRef<any>;
    @ViewChild('heading_4', { read: TemplateRef, static: true })
    headingFourTemplate: TemplateRef<any>;
    @ViewChild('heading_5', { read: TemplateRef, static: true })
    headingFiveTemplate: TemplateRef<any>;
    @ViewChild('heading_6', { read: TemplateRef, static: true })
    headingSixTemplate: TemplateRef<any>;

    ngOnInit() { }

    renderElement() {
        return (element: Element) => {
            if (element.type === 'heading-one') {
                return this.headingOneTemplate;
            }
            if (element.type === 'heading-two') {
                return this.headingTwoTemplate;
            }
            if (element.type === 'heading-three') {
                return this.headingThreeTemplate;
            }
            if (element.type === 'heading-four') {
                return this.headingFourTemplate;
            }
            if (element.type === 'heading-five') {
                return this.headingFiveTemplate;
            }
            if (element.type === 'heading-six') {
                return this.headingSixTemplate;
            }
            if (element.type === 'block-quote') {
                return this.blockquoteTemplate;
            }
            if (element.type === 'list-item') {
                return this.liTemplate;
            }
            if (element.type === 'bulleted-list') {
                return this.ulTemplate;
            }
        };
    }

    valueChange(event) { }
}
const initialValue = [
    {
        type: 'paragraph',
        children: [
            {
                text:
                    'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:'
            }
        ]
    },
    {
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'Order when you start a line with "## " you get a level-two heading, like this:'
            }
        ]
    },
    {
        type: 'heading-two',
        children: [{ text: 'Try it out!' }]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.'
            }
        ]
    }
];

const SHORTCUTS = {
    '*': 'list-item',
    '-': 'list-item',
    '+': 'list-item',
    '>': 'block-quote',
    '#': 'heading-one',
    '##': 'heading-two',
    '###': 'heading-three',
    '####': 'heading-four',
    '#####': 'heading-five',
    '######': 'heading-six'
};
const withShortcuts = editor => {
    const { deleteBackward, insertText } = editor;

    editor.insertText = text => {
        const { selection } = editor;

        if (text === ' ' && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection;
            const block = Editor.above<Element>(editor, {
                match: n => Editor.isBlock(editor, n)
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const range = { anchor, focus: start };
            const beforeText = Editor.string(editor, range);
            const type = SHORTCUTS[beforeText];

            if (type) {
                Transforms.select(editor, range);
                Transforms.delete(editor);
                Transforms.setNodes(editor, { type }, { match: n => Editor.isBlock(editor, n) });

                if (type === 'list-item') {
                    const list: BulletedListElement = { type: 'bulleted-list', children: [] };
                    Transforms.wrapNodes<Element>(editor, list, {
                        match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'list-item'
                    });
                }

                return;
            }
        }

        insertText(text);
    };

    editor.deleteBackward = (...args) => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above<Element>(editor, {
                match: n => Editor.isBlock(editor, n)
            });

            if (match) {
                const [block, path] = match;
                const start = Editor.start(editor, path);

                if (block.type !== 'paragraph' && Point.equals(selection.anchor, start)) {
                    Transforms.setNodes(editor, { type: 'paragraph' });

                    if (block.type === 'list-item') {
                        Transforms.unwrapNodes(editor, {
                            match: n => Element.isElement(n) && n.type === 'bulleted-list',
                            split: true
                        });
                    }

                    return;
                }
            }

            deleteBackward(...args);
        }
    };

    return editor;
};
