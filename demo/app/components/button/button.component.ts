import { Component, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, Output, Renderer2 } from "@angular/core";

@Component({
    selector: 'demo-button',
    template: '<ng-content></ng-content>',
    host: {
        'style': "cursor: pointer"
    }
})
export class DemoButtonComponent implements OnChanges {

    @Input() active = false;

    @Output() onMouseDown: EventEmitter<MouseEvent> = new EventEmitter();

    constructor(private elementRef: ElementRef, private renderer2: Renderer2) { }

    @HostListener('mousedown', ['$event'])
    mousedown(event: MouseEvent) {
        event.preventDefault();
        this.onMouseDown.emit(event);
    }

    ngOnChanges() {
        this.renderer2.setStyle(this.elementRef.nativeElement, 'color', this.active ? 'black' : '#ccc')
    }
}