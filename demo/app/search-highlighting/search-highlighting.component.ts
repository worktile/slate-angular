import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createEditor, NodeEntry, Range, Text } from 'slate';
import { withAngular } from 'slate-angular';
import { SlateEditable } from '../../../packages/src/components/editable/editable.component';
import { MarkTypes, RichTextFlavour } from '../flavours/richtext.flavour';
import { DemoLeafComponent } from './hightlighting-leaf.flavour';

@Component({
    selector: 'demo-search-highlight',
    templateUrl: './search-highlighting.component.html',
    styleUrls: ['./search-highlighting.component.scss'],
    imports: [FormsModule, SlateEditable]
})
export class DemoSearchHighlightingComponent implements OnInit {
    keywords = '';

    value = initialValue;

    editor = withAngular(createEditor());

    decorate: (nodeEntry: NodeEntry) => Range[];

    public cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.generateDecorate();
    }

    keywordsChange(event) {
        this.generateDecorate();
        this.cdr.markForCheck();
    }

    generateDecorate() {
        this.decorate = ([node, path]) => {
            const ranges = [];

            if (this.keywords && Text.isText(node)) {
                const { text } = node;
                const parts = text.split(this.keywords);
                let offset = 0;

                parts.forEach((part, i) => {
                    if (i !== 0) {
                        ranges.push({
                            anchor: {
                                path,
                                offset: offset - this.keywords.length
                            },
                            focus: { path, offset },
                            highlight: true
                        });
                    }

                    offset = offset + part.length + this.keywords.length;
                });
            }

            return ranges;
        };
    }

    renderText = (text: Text) => {
        if (text[MarkTypes.bold] || text[MarkTypes.italic] || text[MarkTypes.code] || text[MarkTypes.underline]) {
            return RichTextFlavour;
        }
    };

    renderLeaf = (text: Text) => {
        if (text['highlight']) {
            return DemoLeafComponent;
        }
        return null;
    };
}

const initialValue = [
    {
        children: [
            {
                text: 'This is editable text that you can search. As you search, it looks for matching strings of text, and adds '
            },
            { text: 'decorations', bold: true },
            { text: ' to them in realtime.' }
        ]
    },
    {
        children: [
            {
                text: 'Try it out for yourself by typing in the search box above!'
            }
        ]
    }
];
