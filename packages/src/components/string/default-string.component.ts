import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ElementRef,
    ChangeDetectorRef
} from '@angular/core';
import { SlateStringContext } from '../../view/context';
import { BaseComponent } from '../../view/base';

@Component({
    selector: 'span[slateDefaultString]',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateDefaultStringComponent extends BaseComponent<SlateStringContext> implements OnInit {
    constructor(public elementRef: ElementRef<any>, public cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    onContextChange(): void {
        // Avoid breaking some browser default behaviors, such as spellCheck, android composition input state
        if (this.nativeElement.innerText !== this.context.text) {
            this.nativeElement.innerText = this.context.text;
        }
    }

    ngOnInit(): void {
        this.nativeElement.setAttribute('editable-text', '');
        this.nativeElement.setAttribute('data-slate-string', 'true');
    }
}
