import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { ButtonElement } from '../../../../custom-types';
import { BaseElementComponent } from 'slate-angular';
import { SlateChildrenOutlet } from '../../../../packages/src/components/children/children-outlet.component';

@Component({
    selector: 'span[demo-element-button]',
    template: `
        <span contenteditable="false" style="font-size: 0;">{{ inlineChromiumBugfix }}</span>
        <slate-children-outlet></slate-children-outlet>
        <span contenteditable="false" style="font-size: 0;">{{ inlineChromiumBugfix }}</span>
    `,
    host: {
        class: 'demo-element-button'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SlateChildrenOutlet]
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
