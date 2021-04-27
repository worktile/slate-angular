import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Element } from 'slate';

@Component({
    selector: 'slate-block-card, [slateBlockCard]',
    templateUrl: 'block-card.component.html'
})
export class SlateBlockCardComponent implements OnInit {
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
        this.nativeElement.classList.add(`slate-block-card`);
    }

    initializeCenter(rootNodes: HTMLElement[], element: Element) {
        this.centerRootNodes = rootNodes;
        this.element = element;
    }
}