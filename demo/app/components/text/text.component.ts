import { ChangeDetectorRef, Component, ElementRef, Renderer2 } from "@angular/core";
import { BaseTextComponent } from "slate-angular";

export enum MarkTypes {
    bold = 'bold',
    italic = 'italic',
    underline = 'underlined',
    strike = 'strike',
    code = 'code-line'
}

@Component({
    selector: 'span[markText]',
    template: `<slate-leaves [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"></slate-leaves>`,
    host: {
        'data-slate-node': 'text'
    }
})
export class DemoMarkTextComponent extends BaseTextComponent {
    constructor(public elementRef: ElementRef, public renderer2: Renderer2, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }
    
    applyTextMark() {
        if (this.text[MarkTypes.bold]) {
            this.renderer2.setStyle(this.elementRef.nativeElement, 'font-weight', 'bold');
        } else {
            this.renderer2.removeStyle(this.elementRef.nativeElement, 'font-weight');
        }
        if (this.text[MarkTypes.italic]) {
            this.renderer2.setStyle(this.elementRef.nativeElement, 'font-style', 'italic');
        } else {
            this.renderer2.removeStyle(this.elementRef.nativeElement, 'font-style');
        }
        if (this.text[MarkTypes.code]) {
            this.renderer2.addClass(this.elementRef.nativeElement, 'code-line');
        } else {
            this.renderer2.removeClass(this.elementRef.nativeElement, 'code-line');
        }
        if (this.text.underlined) {
            this.renderer2.setStyle(this.elementRef.nativeElement, 'text-decoration', 'underline');
        } else {
            this.renderer2.removeStyle(this.elementRef.nativeElement, 'text-decoration');
        }
    }

    onContextChange() {
        super.onContextChange();
        this.applyTextMark();
    }
}