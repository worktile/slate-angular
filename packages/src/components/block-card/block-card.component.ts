import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from "@angular/core";
import { Element } from 'slate';

@Component({
    selector: 'sla-block-card, [slaBlockCard]',
    templateUrl: 'block-card.component.html'
})
export class SlaBlockCardComponent implements OnInit {
    @ViewChild('centerContianer', { static: true })
    centerContianer: ElementRef;

    centerRootNodes: HTMLElement[];

    element: Element;

    get nativeElement() {
        return this.elementRef.nativeElement;
    }

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        const fragment = document.createDocumentFragment();
        fragment.append(...this.centerRootNodes);
        this.centerContianer.nativeElement.appendChild(fragment);
        this.nativeElement.classList.add(`sla-block-card-element`);
        this.nativeElement.classList.add(`sla-block-card-${this.element.type}`);
    }

    initializeCenter(rootNodes: HTMLElement[], element: Element) {
        this.centerRootNodes = rootNodes;
        this.element = element;
    }
}