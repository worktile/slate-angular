import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'slate-block-card, [slateBlockCard]',
    templateUrl: 'block-card.component.html',
    standalone: true
})
export class SlateBlockCard implements OnInit {
    @ViewChild('centerContainer', { static: true })
    centerContainer: ElementRef;

    centerRootNodes: HTMLElement[];

    get nativeElement() {
        return this.elementRef.nativeElement;
    }

    get centerContainerElement() {
        return this.centerContainer.nativeElement as HTMLElement;
    }

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.nativeElement.classList.add(`slate-block-card`);
    }

    append() {
        this.centerRootNodes.forEach(
            rootNode => !this.centerContainerElement.contains(rootNode) && this.centerContainerElement.appendChild(rootNode)
        );
    }

    initializeCenter(rootNodes: HTMLElement[]) {
        this.centerRootNodes = rootNodes;
        this.append();
    }
}
