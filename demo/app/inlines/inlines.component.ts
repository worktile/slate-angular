import { Component } from '@angular/core';
import { Editor, Transforms, createEditor, Element as SlateElement, Range, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { withAngular } from 'slate-angular';
import { LinkElement, ButtonElement } from 'custom-types';
import isUrl from 'is-url';
import { isKeyHotkey } from 'is-hotkey';
import { DemoElementEditableButtonComponent } from '../components/editable-button/editable-button.component';
import { DemoElementLinkComponent } from '../components/link/link.component';
import { FormsModule } from '@angular/forms';
import { SlateEditable } from '../../../packages/src/components/editable/editable.component';
import { DemoButtonComponent } from '../components/button/button.component';


interface ToolbarItem {
    icon: string;
    active: () => boolean;
    action: (event: Event) => void;
}

@Component({
    selector: 'demo-inlines',
    templateUrl: 'inlines.component.html',
    standalone: true,
    imports: [DemoButtonComponent, SlateEditable, FormsModule]
})
export class DemoInlinesComponent {
    value = initialValue;

    editor = withInlines(withHistory(withAngular(createEditor())));

    toolbarItems: Array<ToolbarItem> = [
        {
            icon: 'link',
            active: () => isLinkActive(this.editor),
            action: event => {
                event.preventDefault();
                const url = window.prompt('Enter the URL of the link:');
                if (!url) return;
                insertLink(this.editor, url);
            }
        },
        {
            icon: 'link_off',
            active: () => isLinkActive(this.editor),
            action: () => {
                if (isLinkActive(this.editor)) {
                    unwrapLink(this.editor);
                }
            }
        },
        {
            icon: 'smart_button',
            active: () => true,
            action: event => {
                event.preventDefault();
                if (isButtonActive(this.editor)) {
                    unwrapButton(this.editor);
                } else {
                    insertButton(this.editor);
                }
            }
        }
    ];

    renderElement = (element: SlateElement) => {
        if (element.type === 'button') {
            return DemoElementEditableButtonComponent;
        } else if (element.type === 'link') {
            return DemoElementLinkComponent;
        }
    };

    onKeydown = (event: KeyboardEvent) => {
        const { selection } = this.editor;

        // Default left/right behavior is unit:'character'.
        // This fails to distinguish between two cursor positions, such as
        // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
        // Here we modify the behavior to unit:'offset'.
        // This lets the user step into and out of the inline without stepping over characters.
        // You may wish to customize this further to only use unit:'offset' in specific cases.
        if (selection && Range.isCollapsed(selection)) {
            const nativeEvent = event;
            if (isKeyHotkey('left', nativeEvent)) {
                event.preventDefault();
                Transforms.move(this.editor, { unit: 'offset', reverse: true });
                return;
            }
            if (isKeyHotkey('right', nativeEvent)) {
                event.preventDefault();
                Transforms.move(this.editor, { unit: 'offset' });
                return;
            }
        }
    };

    valueChange(value: Element[]) {}
}

const withInlines = (editor: Editor) => {
    const { insertData, insertText, isInline } = editor;

    editor.isInline = element => ['link', 'button'].includes(element.type) || isInline(element);

    editor.insertText = text => {
        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertText(text);
        }
    };

    editor.insertData = data => {
        const text = data.getData('text/plain');

        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertData(data);
        }
    };

    return editor;
};

const insertLink = (editor, url) => {
    if (editor.selection) {
        wrapLink(editor, url);
    }
};

const insertButton = (editor: Editor) => {
    if (editor.selection) {
        wrapButton(editor);
    }
};

const isLinkActive = (editor: Editor) => {
    const [link] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
    });
    return !!link;
};

const isButtonActive = (editor: Editor) => {
    const [button] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'button'
    });
    return !!button;
};

const unwrapLink = (editor: Editor) => {
    Transforms.unwrapNodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
    });
};

const unwrapButton = (editor: Editor) => {
    Transforms.unwrapNodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'button'
    });
};

const wrapLink = (editor, url: string) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor);
    }

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link: LinkElement = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : []
    };

    if (isCollapsed) {
        Transforms.insertNodes(editor, link);
    } else {
        Transforms.wrapNodes(editor, link, { split: true });
        Transforms.collapse(editor, { edge: 'end' });
    }
};

const wrapButton = (editor: Editor) => {
    if (isButtonActive(editor)) {
        unwrapButton(editor);
    }

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const button: ButtonElement = {
        type: 'button',
        children: isCollapsed ? [{ text: 'Edit me!' }] : []
    };

    if (isCollapsed) {
        Transforms.insertNodes(editor, button);
    } else {
        Transforms.wrapNodes(editor, button, { split: true });
        Transforms.collapse(editor, { edge: 'end' });
    }
};

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            {
                text: 'In addition to block nodes, you can create inline nodes. Here is a '
            },
            {
                type: 'link',
                url: 'https://en.wikipedia.org/wiki/Hypertext',
                children: [{ text: 'hyperlink' }]
            },
            {
                text: ', and here is a more unusual inline: an '
            },
            {
                type: 'button',
                children: [{ text: 'editable button' }]
            },
            {
                text: '!'
            }
        ]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'There are two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected. '
            },
            // The following is an example of an inline at the end of a block.
            // This is an edge case that can cause issues.
            {
                type: 'link',
                url: 'https://twitter.com/JustMissEmma/status/1448679899531726852',
                children: [{ text: 'Finally, here is our favorite dog video.' }]
            },
            { text: '' }
        ]
    }
];
