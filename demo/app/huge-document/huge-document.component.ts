import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, NgZone } from '@angular/core';
import faker from 'faker';
import { createEditor } from 'slate';
import { withAngular } from 'slate-angular';
import { take } from 'rxjs/operators';
import { SlateElement } from '../../../packages/src/components/element/element.component';
import { FormsModule } from '@angular/forms';
import { SlateEditable } from '../../../packages/src/components/editable/editable.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'demo-huge-document',
    templateUrl: 'huge-document.component.html',
    standalone: true,
    imports: [NgIf, SlateEditable, FormsModule, NgFor, SlateElement]
})
export class DemoHugeDocumentComponent implements OnInit, AfterViewInit {
    mode: 'default' | 'component' = 'default';

    value = buildInitialValue();

    componentValue = [
        {
            type: 'paragraph',
            children: [{ text: faker.lorem.paragraph() }]
        }
    ];

    editor = withAngular(createEditor());

    @ViewChild('elementTemplate', { read: TemplateRef, static: true })
    elementTemplate: TemplateRef<any>;

    constructor(private ngZone: NgZone) {}

    ngOnInit() {
        console.time();
    }

    ngAfterViewInit(): void {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            console.timeEnd();
        });
    }

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

export const buildInitialValue = () => {
    const HEADINGS = 2000;
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
    return initialValue;
};
