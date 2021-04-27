import { ChangeDetectorRef, Component, ElementRef, Renderer2 } from "@angular/core";
import { SlateTextComponentBase } from "slate-angular";

@Component({
    selector: 'span[markText]',
    template: `<slate-leaves [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"></slate-leaves>`,
    host: {
        'data-slate-node': 'text'
    }
})
export class DemoMarkTextComponent extends SlateTextComponentBase {
    constructor(public elementRef: ElementRef, public renderer2: Renderer2, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }
    ngOnInit() {
        super.ngOnInit();
        if (this.context.text.bold) {
            this.renderer2.setStyle(this.elementRef.nativeElement, 'font-weight', 'bold');
        }
        if (this.context.text.italic) {
            this.renderer2.setStyle(this.elementRef.nativeElement, 'font-style', 'italic');
        }
        if (this.context.text.code) {
            this.renderer2.addClass(this.elementRef.nativeElement, 'code-line');
        }
    }
}