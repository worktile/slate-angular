import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, NgZone } from '@angular/core';
import faker from 'faker';
import { createEditor } from 'slate';
import { withAngular } from 'slate-angular';
import { take } from 'rxjs/operators';

@Component({
    selector: 'demo-huge-document',
    templateUrl: 'huge-document.component.html'
})
export class DemoHugeDocumentComponent implements OnInit, AfterViewInit {
    mode: 'default' | 'component' = 'component';

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
    const HEADINGS = 200;
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
