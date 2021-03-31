import {
    OnInit,
    Component,
    Input,
    ElementRef,
    ViewChild,
    ChangeDetectionStrategy,
    Renderer2,
    OnChanges,
    SimpleChanges,
    OnDestroy,
    TemplateRef,
} from '@angular/core';
import { Text as SlateText, Element as SlateElement, Range } from 'slate';
import { ViewNodeService } from '../../services/view-node.service';
import { Initializer } from '../../core/initializer';
import { ViewRefType } from '../../interfaces/view-node';
import { AngularEditor } from '../../plugins/angular-editor';

@Component({
    selector: 'sla-text,[slaText]',
    templateUrl: 'text.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaTextComponent implements OnInit, OnChanges, OnDestroy {
    @Input() text: SlateText;
    @Input() parent: SlateElement;
    @Input() index: number;
    @Input() isLast: boolean;
    @Input() renderLeaf?: (text: SlateText) => TemplateRef<any>;
    @Input() decorations: Range[];
    @Input() editor: AngularEditor;
    @Input()
    renderMark: (text: SlateText) => { rootDOM: HTMLElement; deepestDOM: HTMLElement };

    @ViewChild('leaf', { read: ElementRef, static: true })
    leafElement: ElementRef;

    @ViewChild('stringComponentTemplate', { static: true })
    stringComponentTemplate: TemplateRef<any>;

    lastRootDOM: HTMLElement;

    leafViews: { viewRef: ViewRefType; context: any }[];

    constructor(public elementRef: ElementRef, public renderer2: Renderer2) { }

    ngOnInit() {
        this.render();
        Initializer.initComponent(this.text, this.elementRef, { 'data-slate-node': 'text' });
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        const decorationsSimpleChange = simpleChanges.decorations;
        const parentSimpleChange = simpleChanges.parent;
        if ((parentSimpleChange && !parentSimpleChange.firstChange) || (decorationsSimpleChange && !decorationsSimpleChange.firstChange)) {
            this.render();
            const textSimpleChange = simpleChanges.text;
            if (textSimpleChange) {
                Initializer.updateWeakMap(this.text, this.elementRef);
            }
        }
    }

    render() {
        if (this.renderMark) {
            const { rootDOM, deepestDOM } = this.renderMark(this.text);
            if (deepestDOM) {
                deepestDOM.appendChild(this.leafElement.nativeElement);
            } else {
                this.elementRef.nativeElement.appendChild(this.leafElement.nativeElement);
            }
            if (this.lastRootDOM) {
                this.lastRootDOM.remove();
            }
            if (rootDOM) {
                this.lastRootDOM = rootDOM;
                this.elementRef.nativeElement.appendChild(rootDOM);
            }
        }
        const leaves = SlateText.decorations(this.text, this.decorations);
        this.leafViews = [];
        leaves.forEach((leaf, i) => {
            let templateRef = this.renderLeaf && this.renderLeaf(leaf);
            if (!templateRef) {
                templateRef = this.stringComponentTemplate;
            }
            this.leafViews.push({
                viewRef: templateRef,
                context: { isLast: this.isLast && i === leaves.length - 1, parent: this.parent, text: this.text, leaf, editor: this.editor }
            });
        });
    }

    ngOnDestroy() {
        Initializer.deleteWeakMap(this.text, this.elementRef);
    }
}
