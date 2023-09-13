import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { ButtonElement } from '../../../../custom-types';
import { BaseElementComponent } from 'slate-angular';
import { SlateChildren } from '../../../../packages/src/components/children/children.component';

@Component({
    selector: 'span[demo-element-button]',
    template: `
        <span contenteditable="false" style="font-size: 0;">{{ inlineChromiumBugfix }}</span>
        <slate-children [children]="children" [context]="childrenContext" [viewContext]="viewContext"></slate-children>
        <span contenteditable="false" style="font-size: 0;">{{ inlineChromiumBugfix }}</span>
    `,
    host: {
        class: 'demo-element-button'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SlateChildren]
})
export class DemoElementEditableButtonComponent extends BaseElementComponent<ButtonElement> {
    // Put this at the start and end of an inline component to work around this Chromium bug:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
    inlineChromiumBugfix = '$' + String.fromCodePoint(160);

    @HostListener('click', ['$event'])
    click(event: MouseEvent) {
        event.preventDefault();
    }
}
