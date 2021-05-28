import { Component, OnInit } from '@angular/core';
import { withAngular } from 'slate-angular';
import { createEditor, Transforms, Editor } from 'slate';
import { DemoElementImageComponent } from '../components/image/image-component';

@Component({
    selector: 'demo-images',
    templateUrl: 'images.component.html'
})
export class DemoImagesComponent implements OnInit {
    value = initialValue;

    editor = withImage(withAngular(createEditor()));

    constructor() {}

    renderElement() {
        return (element: any) => {
            if (element.type === 'image') {
                return DemoElementImageComponent;
            }
            return null;
        };
    }

    ngOnInit() {}

    isImgUrl(imgUrl: string) {
        return new Promise((resolve, reject) => {
            const imgObj = new Image();
            imgObj.src = imgUrl;
            imgObj.onload = () => {
                resolve(true);
            }
            imgObj.onerror = () => {
                reject(false)
            }
        }).catch(error => { });
    }

    createImageNode(imgUrl: string) {
        const imageNode = {
            type: 'image',
            url: imgUrl,
            children: [
                {
                    'text': ''
                }
            ]
        }
        Transforms.insertNodes(this.editor, imageNode as any);
    }

    addImages() {
        const imgUrl = window.prompt('Enter the URL of the image:');
        if (imgUrl) {
            this.isImgUrl(imgUrl).then(value => {
                if (value) {
                    this.createImageNode(imgUrl);
                } else {
                    window.alert('URL is not an image');
                }
            })
        }
    }

    valueChange(event) {
    }
}
const initialValue = [
    {
        "type": "paragraph",
        "children": [
            {
                "text": "In addition to nodes that contain editable text, you can also create other types of nodes, like images or videos."
            }
        ],
        "key": "HdSTK"
    },
    {
        "type": "image",
        "url": "https://source.unsplash.com/kFrdX5IeQzI",
        "children": [
            {
                "text": ""
            }
        ],
        "key": "EwcCn",
        "voids": true
    },
    {
        "type": "paragraph",
        "children": [
            {
                "text": "This example shows images in action. It features two ways to add images. You can either add an image via the toolbar icon above, or if you want in on a little secret, copy an image URL to your keyboard and paste it anywhere in the editor!"
            }
        ],
        "key": "ecJaY"
    },
    {
        "type": "paragraph",
        "children": [
            {
                "text": ""
            }
        ],
        "key": "zRTHT"
    }
];

const withImage = (editor: Editor) => {
    const { isVoid } = editor;

    editor.isVoid = (element) => {
        return element.type === 'image' || isVoid(element);
    };

    return editor;
}