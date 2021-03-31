import {
    OnInit,
    Component,
    ElementRef,
    Renderer2,
    SkipSelf,
    Optional,
    DoCheck,
    TemplateRef,
    Input,
    OnDestroy
} from '@angular/core';
import { SlaComponentBase, ViewElementContext } from 'slate-angular';

@Component({
    selector: 'demo-element-image',
    templateUrl: 'image-component.html'
})
export class DemoElementImageComponent extends SlaComponentBase implements OnInit, OnDestroy {
    @Input()
    set context(value: ViewElementContext) {
        this.setContext(value);
    }

    constructor(
        public elementRef: ElementRef
    ) {
        super(elementRef);
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.destroy();
    }
}
