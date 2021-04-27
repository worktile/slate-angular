import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SlateElementComponentBase } from '../../interfaces/view-base';

@Component({
    selector: 'div[slateDefaultElement]',
    template: `<slate-children [children]="children" [context]="childrenContext" [viewContext]="viewContext"></slate-children>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateDefaultElementComponent extends SlateElementComponentBase {
}