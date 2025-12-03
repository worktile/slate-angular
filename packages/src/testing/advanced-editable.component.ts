import { Component, OnInit, ViewChild } from '@angular/core';
import { createEditor, Element, NodeEntry, Text } from 'slate';
import { SlateEditable } from '../components/editable/editable.component';
import { withAngular } from '../plugins/with-angular';
import { createDefaultDocument } from './create-document';
import { AngularEditor } from '../plugins/angular-editor';
import { DOMRange } from 'slate-dom';
import { TestingLeafFlavour } from './leaf.flavour';

@Component({
    selector: 'basic-editable',
    template: `
        <slate-editable
            [editor]="editor"
            [ngModel]="value"
            [decorate]="decorate"
            [renderLeaf]="renderLeaf"
            [placeholder]="placeholder"
            [trackBy]="trackBy"
            [scrollSelectionIntoView]="scrollSelectionIntoView"
        ></slate-editable>
    `,
    standalone: false
})
export class AdvancedEditableComponent implements OnInit {
    editor = withAngular(createEditor());

    value: any = createDefaultDocument();

    decorate = (nodeEntry: NodeEntry) => [];

    trackBy = (element: Element) => null;

    placeholder: string;

    @ViewChild(SlateEditable, { static: true })
    editableComponent: SlateEditable;

    generateDecorate(keywords: string) {
        this.decorate = ([node, path]) => {
            const ranges = [];

            if (keywords && Text.isText(node)) {
                const { text } = node;
                const parts = text.split(keywords);
                let offset = 0;

                parts.forEach((part, i) => {
                    if (i !== 0) {
                        ranges.push({
                            anchor: { path, offset: offset - keywords.length },
                            focus: { path, offset },
                            highlight: true
                        });
                    }

                    offset = offset + part.length + keywords.length;
                });
            }

            return ranges;
        };
    }

    renderLeaf = (text: Text) => {
        if (text['highlight']) {
            return TestingLeafFlavour;
        }
        return null;
    };

    scrollSelectionIntoView = (editor: AngularEditor, domRange: DOMRange) => {};

    ngOnInit() {}

    constructor() {}
}
