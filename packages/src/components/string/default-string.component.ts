import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SlateStringContext } from '../../view/context';
import { BaseComponent } from '../../view/base';
import { BeforeContextChange } from '../../view/before-context-change';
import { DOMElement } from '../../utils/dom';

@Component({
    selector: 'span[slateDefaultString]',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateDefaultStringComponent
    extends BaseComponent<SlateStringContext>
    implements OnInit, BeforeContextChange<SlateStringContext>
{
    type: 'string' | 'LineBreakEmptyString';
    previousType: 'string' | 'LineBreakEmptyString' | undefined;

    zeroWidthText?: Text;
    brElement?: DOMElement;

    constructor(public elementRef: ElementRef<any>, public cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    beforeContextChange(value: SlateStringContext) {
        if (this.type) {
            this.previousType = this.type;
        }
        this.type = value.text.length > 0 ? 'string' : 'LineBreakEmptyString';
    }

    onContextChange() {
        if (this.previousType === undefined) {
            if (this.type === 'string') {
                this.createStringTemplate();
            } else {
                this.createLineBreakEmptyStringTemplate();
            }
        } else {
            if (this.previousType === 'string' && this.type === 'string') {
                // Avoid breaking some browser default behaviors, such as spellCheck, android composition input state
                if (this.nativeElement.textContent !== this.context.text) {
                    this.nativeElement.textContent = this.context.text;
                }
            }
            if (this.previousType === 'LineBreakEmptyString' && this.type === 'string') {
                this.brElement.remove();
                this.zeroWidthText.remove();
                this.nativeElement.removeAttribute('data-slate-zero-width');
                this.nativeElement.removeAttribute('data-slate-length');
                this.nativeElement.setAttribute('data-slate-string', 'true');
            }
            if (this.previousType === 'string' && this.type === 'LineBreakEmptyString') {
                this.nativeElement.textContent = '';
                this.nativeElement.removeAttribute('data-slate-string');
                this.createLineBreakEmptyStringTemplate();
            }
        }
    }

    createLineBreakEmptyStringTemplate() {
        this.zeroWidthText = document.createTextNode(`\uFEFF`);
        this.brElement = document.createElement('br');
        this.nativeElement.append(this.zeroWidthText, this.brElement);
        this.nativeElement.setAttribute('editable-text', '');
        this.nativeElement.setAttribute('data-slate-zero-width', 'n');
        this.nativeElement.setAttribute('data-slate-length', `${this.context.elementStringLength}`);
    }

    createStringTemplate() {
        this.nativeElement.setAttribute('editable-text', '');
        this.nativeElement.setAttribute('data-slate-string', 'true');
        this.nativeElement.textContent = this.context.text;
    }

    ngOnInit(): void {}
}
