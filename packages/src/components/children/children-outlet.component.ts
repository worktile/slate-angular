import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';

@Component({
    selector: 'slate-children-outlet',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SlateChildrenOutlet {
    constructor(private elementRef: ElementRef<HTMLElement>) {}
    getNativeElement() {
        return this.elementRef.nativeElement;
    }
}
