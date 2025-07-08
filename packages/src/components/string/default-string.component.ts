import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../view/base';
import { SlateStringContext } from '../../view/context';
import { BeforeContextChange } from '../../view/context-change';
import { DOMElement } from 'slate-dom';

@Component({
    selector: 'span[slateDefaultString]',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SlateDefaultString extends BaseComponent<SlateStringContext> implements OnInit, BeforeContextChange<SlateStringContext> {
    textNode?: Text;
    brNode?: DOMElement;

    beforeContextChange(value: SlateStringContext) {
        if (this.context) {
            if (this.context.type === 'lineBreakEmptyString') {
                if (value.type === 'string') {
                    this.removeLineBreakEmptyStringDOM();
                } else {
                    this.textNode?.remove();
                    this.brNode?.remove();
                }
            }
            if (this.context.type === 'string') {
                if (value.type === 'lineBreakEmptyString') {
                    this.removeStringDOM();
                }
            }
        }
    }

    onContextChange() {
        if (this.context.type === 'string') {
            this.createStringDOM();
        } else if (this.context.type === 'lineBreakEmptyString') {
            this.createLineBreakEmptyStringDOM();
        }
    }

    createLineBreakEmptyStringDOM() {
        this.nativeElement.setAttribute('data-slate-zero-width', 'n');
        this.nativeElement.setAttribute('data-slate-length', `${this.context.elementStringLength}`);
        this.textNode = document.createTextNode(`\uFEFF`);
        this.brNode = document.createElement('br');
        this.nativeElement.append(this.textNode, this.brNode);
    }

    removeLineBreakEmptyStringDOM() {
        this.brNode?.remove();
        // remove zero width character
        const zeroWidthCharacterIndex = this.textNode?.textContent.indexOf(`\uFEFF`);
        this.textNode?.deleteData(zeroWidthCharacterIndex, 1);
        this.nativeElement.removeAttribute('data-slate-zero-width');
        this.nativeElement.removeAttribute('data-slate-length');
    }

    createStringDOM() {
        this.nativeElement.setAttribute('data-slate-string', 'true');
        this.updateStringDOM();
    }

    updateStringDOM() {
        // Avoid breaking some browser default behaviors, such as spellCheck, android composition input state
        if (this.nativeElement.textContent !== this.context.text) {
            this.nativeElement.textContent = this.context.text;
        }
    }

    removeStringDOM() {
        this.nativeElement.removeAttribute('data-slate-string');
        this.nativeElement.textContent = '';
    }

    ngOnInit(): void {
        this.nativeElement.setAttribute('editable-text', '');
    }
}
