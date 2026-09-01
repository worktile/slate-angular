import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    OnChanges,
    Output,
    Renderer2,
    ChangeDetectionStrategy
} from '@angular/core';

@Component({
    selector: 'demo-button',
    template: '<ng-content></ng-content>',
    host: {
        style: 'cursor: pointer'
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class DemoButtonComponent implements OnChanges {
    @Input() active = false;

    @Output() onMouseDown: EventEmitter<MouseEvent> = new EventEmitter();

    public elementRef = inject(ElementRef);
    public renderer2 = inject(Renderer2);

    @HostListener('mousedown', ['$event'])
    mousedown(event: MouseEvent) {
        event.preventDefault();
        this.onMouseDown.emit(event);
    }

    ngOnChanges() {
        this.renderer2.setStyle(this.elementRef.nativeElement, 'color', this.active ? 'black' : '#ccc');
    }
}
