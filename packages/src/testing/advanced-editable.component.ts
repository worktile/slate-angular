import { Component, OnInit, ViewChild } from "@angular/core";
import { createEditor, NodeEntry, Text } from "slate";
import { SlateEditableComponent } from "../components/editable/editable.component";
import { withAngular } from "../plugins/with-angular";
import { createDefaultDocument } from "./create-document";
import { TestingLeafComponent } from "./leaf.component";

@Component({
    selector: 'basic-editable',
    template: `
        <slate-editable 
            [editor]="editor"
            [ngModel]="value"
            [decorate]="decorate"
            [renderLeaf]="renderLeaf"
            ></slate-editable>
    `
})
export class AdvancedEditableComponent implements OnInit {
    editor = withAngular(createEditor());

    value = createDefaultDocument();

    decorate = (nodeEntry: NodeEntry) => [];

    @ViewChild(SlateEditableComponent, { static: true })
    editableComponent: SlateEditableComponent;

    generateDcoreate(keywords: string) {
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
                            highlight: true,
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
            return TestingLeafComponent;
        }
        return null;
    }

    ngOnInit() {
    }

    constructor() {
    }
}
