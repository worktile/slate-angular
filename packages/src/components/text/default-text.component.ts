import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Text } from 'slate';
import { BaseTextComponent } from '../../view/base';
import { SlateLeaves } from '../leaves/leaves.component';
import { ViewContainer3 } from '../../view/container';
import { SlateLeafContext } from '../../view/context';

@Component({
    selector: 'span[slateDefaultText]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'data-slate-node': 'text'
    },
    standalone: true,
    imports: [SlateLeaves]
})
export class SlateDefaultText extends BaseTextComponent implements OnInit, AfterViewInit {
    container3: ViewContainer3;
    leafContexts: SlateLeafContext[];
    leaves: Text[];

    constructor(public elementRef: ElementRef<HTMLElement>, public cdr: ChangeDetectorRef, public viewContainerRef: ViewContainerRef) {
        super(elementRef, cdr);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.leaves = Text.decorations(this.context.text, this.context.decorations);
        this.leafContexts = this.getLeafContexts();
        this.container3 = new ViewContainer3();
        this.container3.initialize(this.viewContext, this.leafContexts, this.viewContainerRef);
    }

    getLeafContexts() {
        return this.leaves.map((leaf, index) => {
            return {
                leaf,
                text: this.context.text,
                parent: this.context.parent,
                index,
                isLast: this.context.isLast && index === this.leaves.length - 1
            };
        });
    }

    ngAfterViewInit(): void {
        this.container3.build(this.elementRef.nativeElement);
    }
}
