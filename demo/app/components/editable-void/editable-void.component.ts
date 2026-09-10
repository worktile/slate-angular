import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';

import { DemoRichtextComponent } from 'demo/app/richtext/richtext.component';
import { BaseElementComponent } from 'slate-angular';
import { EditableVoidElement } from 'custom-types';

// editable void elements whose name input should be focused once rendered (e.g. newly inserted from the toolbar)
export const AUTO_FOCUS_EDITABLE_VOIDS = new WeakSet<EditableVoidElement>();

@Component({
    selector: 'demo-editable-void',
    imports: [DemoRichtextComponent],
    templateUrl: './editable-void.component.html',
    styleUrls: ['./editable-void.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoElementEditableVoid extends BaseElementComponent<EditableVoidElement> implements AfterViewInit {
    inputValue: string = '';

    nameInput = viewChild.required<ElementRef<HTMLInputElement>>('nameInput');

    ngAfterViewInit() {
        if (AUTO_FOCUS_EDITABLE_VOIDS.has(this.element)) {
            AUTO_FOCUS_EDITABLE_VOIDS.delete(this.element);
            // focus after the editor finishes rendering, the same way as a popup/inline input in a real plugin
            setTimeout(() => this.nameInput().nativeElement.focus());
        }
    }

    setInputValue(event: Event) {
        this.inputValue = (event.target as HTMLInputElement).value;
    }
}
