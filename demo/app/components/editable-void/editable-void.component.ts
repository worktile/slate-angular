import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoRichtextComponent } from 'demo/app/richtext/richtext.component';
import { BaseElementComponent } from 'slate-angular';
import { EditableVoidElement } from 'custom-types';

@Component({
    selector: 'demo-editable-void',
    imports: [DemoRichtextComponent],
    templateUrl: './editable-void.component.html',
    styleUrls: ['./editable-void.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoElementEditableVoid extends BaseElementComponent<EditableVoidElement> {
    inputValue: string = '';

    setInputValue(event: Event) {
        this.inputValue = (event.target as HTMLInputElement).value;
    }
}
