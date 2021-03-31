import {
    Component,
    OnInit,
    ElementRef,
    Input,
    ChangeDetectionStrategy,
    OnChanges,
    SimpleChanges,
    OnDestroy
} from '@angular/core';
import { SlaComponentBase } from '../../core/component.base';
import { ViewElementContext } from '../../interfaces/view-node';

@Component({
    selector: 'sla-element,[slaElement]',
    templateUrl: 'element.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaElementComponent extends SlaComponentBase implements OnInit, OnDestroy, OnChanges {
    placeholder: string;

    @Input()
    set context(value: ViewElementContext) {
        this.setContext(value);
    }

    constructor(public elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnInit() {
        this.init();
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
    }

    ngOnDestroy() {
        this.destroy();
    }
}
