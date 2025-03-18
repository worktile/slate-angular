import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Descendant, Editor, createEditor, Element as SlateElement } from 'slate';
import { SlateEditable, withAngular } from 'slate-angular';
import { DemoElementVideoComponent } from '../components/video/video.component';

@Component({
    selector: 'demo-embeds',
    templateUrl: './embeds.component.html',
    styleUrls: ['./embeds.component.scss'],
    imports: [SlateEditable, FormsModule]
})
export class DemoEmbedsComponent {
    value = initialValue;

    editor = withEmbed(withAngular(createEditor()));

    renderElement = (element: SlateElement) => {
        if (element.type === 'video') {
            return DemoElementVideoComponent;
        }
        return null;
    };
}

const withEmbed = (editor: Editor) => {
    const { isVoid } = editor;

    editor.isVoid = element => element.type === 'video' || isVoid(element);

    return editor;
};

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            {
                text: 'In addition to simple image nodes, you can actually create complex embedded nodes. For example, this one contains an input element that lets you change the video being rendered!'
            }
        ]
    },
    {
        type: 'video',
        url: 'https://player.vimeo.com/video/26689853',
        children: [{ text: '' }]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'Try it out! This editor is built to handle Vimeo embeds, but you could handle any type.'
            }
        ]
    }
];
