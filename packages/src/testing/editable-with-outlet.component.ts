import { Component, ViewChild } from '@angular/core';
import { createEditor, Element } from 'slate';
import { SlateEditable } from '../components/editable/editable.component';
import { withAngular } from '../plugins/with-angular';
import { SlateChildrenOutlet } from '../components/children/children-outlet.component';
import { BaseElementComponent } from '../view/base';

const customType = 'custom-with-outlet';

@Component({
    selector: 'editable-with-outlet',
    template: `<slate-editable
        [editor]="editor"
        [(ngModel)]="value"
        (ngModelChange)="ngModelChange()"
        [renderElement]="renderElement()"
    ></slate-editable> `,
    standalone: false
})
export class EditableWithOutletComponent {
    editor = withAngular(createEditor());

    value: Element[] = createDefaultDocument() as Element[];

    @ViewChild(SlateEditable, { static: true })
    editableComponent: SlateEditable;

    renderElement() {
        return (element: Element) => {
            if ((element.type as any) === customType) {
                return TestElementWithOutletComponent;
            }
            return null;
        };
    }

    ngModelChange() {}

    constructor() {}
}

export function createDefaultDocument() {
    return [
        {
            type: customType,
            children: [
                {
                    type: 'paragraph',
                    children: [{ text: 'This is editable text!' }]
                }
            ]
        }
    ];
}

@Component({
    selector: 'div[test-element-with-outlet]',
    template: `
        <div>before</div>
        <slate-children-outlet></slate-children-outlet>
        <div>after</div>
    `,
    host: {
        class: 'test-element-with-outlet'
    },
    imports: [SlateChildrenOutlet]
})
export class TestElementWithOutletComponent extends BaseElementComponent<any> {}
