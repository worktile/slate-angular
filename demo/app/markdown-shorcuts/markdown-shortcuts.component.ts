import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Editor, Range, Point, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withAngular } from 'packages/src/public-api';

@Component({
    selector: 'demo-markdown-shortcuts',
    templateUrl: 'markdown-shortcuts.component.html'
})
export class DemoMarkdownShortcutsComponent implements OnInit {
    constructor() {}

    value = initialValue;

    editor = withShortcuts(withHistory(withAngular(createEditor())));

    @ViewChild('elementTemplate', { read: TemplateRef, static: true })
    elementTemplate: TemplateRef<any>;

    ngOnInit() {}

    renderElement() {
        return (element: any) => {
            return this.elementTemplate;
        };
    }

    valueChange(event) {}
}
const initialValue = [
    {
        type: 'paragraph',
        children: [
            {
                text:
                    // tslint:disable-next-line:max-line-length
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
            const block = Editor.above(editor, {
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
                    const list = { type: 'bulleted-list', children: [] };
                    Transforms.wrapNodes(editor, list, {
                        match: n => n.type === 'list-item'
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
            const match = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n)
            });

            if (match) {
                const [block, path] = match;
                const start = Editor.start(editor, path);

                if (block.type !== 'paragraph' && Point.equals(selection.anchor, start)) {
                    Transforms.setNodes(editor, { type: 'paragraph' });

                    if (block.type === 'list-item') {
                        Transforms.unwrapNodes(editor, {
                            match: n => n.type === 'bulleted-list'
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
