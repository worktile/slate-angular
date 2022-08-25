import { ChangeDetectionStrategy, Component, HostBinding, HostListener } from '@angular/core';
import { LinkElement } from 'custom-types';
import { BaseElementComponent } from 'slate-angular';

@Component({
    selector: 'a[demo-element-link]',
    template: `
        <span contenteditable="false" style="font-size: 0;">{{ inlineChromiumBugfix }}</span>
        <slate-children [children]="children" [context]="childrenContext" [viewContext]="viewContext"></slate-children>
        <span contenteditable="false" style="font-size: 0;">{{ inlineChromiumBugfix }}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoElementLinkComponent extends BaseElementComponent<LinkElement> {
    // Put this at the start and end of an inline component to work around this Chromium bug:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
    inlineChromiumBugfix = '$' + String.fromCodePoint(160);

    @HostBinding('class.demo-element-link-active')
    get active() {
        return this.isCollapsed;
    }

    @HostBinding("attr.href")
    get herf() {
        return this.element.url;
    }

    @HostListener('click', ['$event'])
    click(event: MouseEvent) {
        event.preventDefault();
    }
}
