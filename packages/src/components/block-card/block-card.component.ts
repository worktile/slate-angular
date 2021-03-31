import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from "@angular/core";
import { Element } from 'slate';

@Component({
    selector: 'sla-block-card, [slaBlockCard]',
    templateUrl: 'block-card.component.html'
})
export class SlaBlockCardComponent implements OnInit {
    @ViewChild('centerContianer', { static: true })
    centerContianer: ElementRef;

    centerElement: HTMLElement;

    element: Element;

    get nativeElement() {
        return this.elementRef.nativeElement;
    }

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.centerContianer.nativeElement.appendChild(this.centerElement);
        this.nativeElement.classList.add(`sla-block-card-element`);
        this.nativeElement.classList.add(`sla-block-card-${this.element.type}`);
    }

    initializeCenter(rootNode: HTMLElement, element: Element) {
        this.centerElement = rootNode;
        this.element = element;
    }
}