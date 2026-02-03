import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';

@Component({
    selector: 'slate-children-outlet',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SlateChildrenOutlet {
    public elementRef = inject(ElementRef<HTMLElement>);
    getNativeElement() {
        return this.elementRef.nativeElement;
    }
}
