import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import faker from 'faker';
import { createEditor } from 'slate';
import { withAngular } from 'packages/src/public-api';

@Component({
    selector: 'demo-huge-document',
    templateUrl: 'huge-document.component.html'
})
export class DemoHugeDocumentComponent implements OnInit {
    value = initialValue;

    editor = withAngular(createEditor());

    @ViewChild('elementTemplate', { read: TemplateRef, static: true })
    elementTemplate: TemplateRef<any>;

    ngOnInit() {}

    renderElement() {
        return (element: any) => {
            if (element.type === 'heading-one') {
                return this.elementTemplate;
            }
            return null;
        };
    }

    valueChange(event) {}
}

const HEADINGS = 100;
const PARAGRAPHS = 7;
const initialValue = [];

for (let h = 0; h < HEADINGS; h++) {
    initialValue.push({
        type: 'heading-one',
        children: [{ text: faker.lorem.sentence() }]
    });

    for (let p = 0; p < PARAGRAPHS; p++) {
        initialValue.push({
            type: 'paragraph',
            children: [{ text: faker.lorem.paragraph() }]
        });
    }
}
