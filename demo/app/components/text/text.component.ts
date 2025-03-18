import { Component, inject, Renderer2 } from '@angular/core';
import { BaseTextComponent } from 'slate-angular';

export enum MarkTypes {
    bold = 'bold',
    italic = 'italic',
    underline = 'underlined',
    strike = 'strike',
    code = 'code-line'
}

@Component({
    selector: 'span[textMark]',
    template: ``,
    host: {
        'data-slate-node': 'text'
    }
})
export class DemoTextMarkComponent extends BaseTextComponent {
    attributes = [];

    public renderer2 = inject(Renderer2);

    applyTextMark() {
        this.attributes.forEach(attr => {
            this.renderer2.removeAttribute(this.elementRef.nativeElement, attr);
        });
        this.attributes = [];
        for (const key in this.text) {
            if (Object.prototype.hasOwnProperty.call(this.text, key) && key !== 'text' && !!this.text[key]) {
                const attr = `slate-${key}`;
                this.renderer2.setAttribute(this.elementRef.nativeElement, attr, 'true');
                this.attributes.push(attr);
            }
        }
    }

    onContextChange() {
        super.onContextChange();
        this.applyTextMark();
    }
}
