import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    ElementRef,
    ChangeDetectorRef,
    IterableDiffers,
    AfterViewInit,
    Inject,
    ViewContainerRef,
    TemplateRef,
    ComponentRef,
    EmbeddedViewRef
} from '@angular/core';
import { BaseElementComponent, BaseEmbeddedView } from '../../view/base';
import { SlateChildren } from '../children/children.component';
import { AngularEditor } from '../../plugins/angular-editor';
import { Descendant, Editor, Element, Range } from 'slate';
import { ComponentType, ViewType } from '../../types/view';
import { SlateVoidText } from '../text/void-text.component';
import { SLATE_DEFAULT_ELEMENT_COMPONENT_TOKEN } from './default-element.component.token';
import { SlateDefaultText } from '../text/default-text.component';
import { SlateErrorCode } from '../../types/error';
import { SlateElementContext, SlateTextContext } from '../../view/context';
import { isComponentType, isTemplateRef } from '../../utils/view';
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../../utils/weak-maps';
import { ViewContainer2 } from '../../view/container';

@Component({
    selector: '[slateElement]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SlateChildren]
})
export class SlateElement extends BaseElementComponent implements OnInit, AfterViewInit {
    container2: ViewContainer2;
    // childrenComponent: (EmbeddedViewRef<any> | ComponentRef<any>)[] = [];

    constructor(
        public elementRef: ElementRef<HTMLElement>,
        public cdr: ChangeDetectorRef,
        protected differs: IterableDiffers,
        @Inject(SLATE_DEFAULT_ELEMENT_COMPONENT_TOKEN)
        public defaultElementComponentType: ComponentType<BaseElementComponent>,
        public viewContainerRef: ViewContainerRef
    ) {
        super(elementRef, cdr);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.container2 = new ViewContainer2();
        this.container2.initialize(this.children, this.element, this.viewContext, this.context,this.defaultElementComponentType, this.viewContainerRef);
        // this.childrenComponent = this.children.map((descendant, index) => {
        //     NODE_TO_INDEX.set(descendant, index);
        //     NODE_TO_PARENT.set(descendant, this.element);
        //     return this.createView(index, descendant) as any;
        // }) as (EmbeddedViewRef<any> | ComponentRef<any>)[];
    }

    ngAfterViewInit(): void {
        this.container2.build(this.elementRef.nativeElement);
    }

    getCommonContext(index: number, descendant: Descendant): { selection: Range; decorations: Range[] } {
        return { selection: null, decorations: [] };
        try {
            const path = AngularEditor.findPath(this.viewContext.editor, this.element);
        const p = path.concat(index);
            const range = Editor.range(this.viewContext.editor, p);
            const sel = this.context.selection && Range.intersection(range, this.context.selection);
            const ds = this.context.decorate([descendant, p]);
            for (const dec of this.context.decorations) {
                const d = Range.intersection(dec, range);
                if (d) {
                    ds.push(d);
                }
            }
            return { selection: sel, decorations: ds };
        } catch (error) {
            this.viewContext.editor.onError({
                code: SlateErrorCode.GetStartPointError,
                nativeError: error
            });
            return { selection: null, decorations: [] };
        }
    }

    getContext(index: number, descendant: Descendant): SlateElementContext | SlateTextContext {
        if (Element.isElement(descendant)) {
            const computedContext = this.getCommonContext(index, descendant);
            const key = AngularEditor.findKey(this.viewContext.editor, descendant);
            const isInline = this.viewContext.editor.isInline(descendant);
            const isVoid = this.viewContext.editor.isVoid(descendant);
            const elementContext: SlateElementContext = {
                element: descendant,
                ...computedContext,
                attributes: {
                    'data-slate-node': 'element',
                    'data-slate-key': key.id
                },
                decorate: this.context.decorate,
                readonly: this.context.readonly
            };
            if (isInline) {
                elementContext.attributes['data-slate-inline'] = true;
            }
            if (isVoid) {
                elementContext.attributes['data-slate-void'] = true;
                elementContext.attributes.contenteditable = false;
            }
            return elementContext;
        } else {
            const computedContext = this.getCommonContext(index, descendant);
            const isLeafBlock = AngularEditor.isLeafBlock(this.viewContext.editor, this.element);
            const textContext: SlateTextContext = {
                decorations: computedContext.decorations,
                isLast: isLeafBlock && index === this.element.children.length - 1,
                parent: this.element as Element,
                text: descendant
            };
            return textContext;
        }
    }

    getViewType(descendant: Descendant): ViewType {
        if (Element.isElement(descendant)) {
            return (this.viewContext.renderElement && this.viewContext.renderElement(descendant)) || this.defaultElementComponentType;
        } else {
            const isVoid = this.viewContext.editor.isVoid(this.element as Element);
            return isVoid
                ? SlateVoidText
                : (this.viewContext.renderText && this.viewContext.renderText(descendant)) || SlateDefaultText;
        }
    }

    createView(index: number, descendant: Descendant) {
        // this.initialized = true;
        const viewType = this.getViewType(descendant);
        const context = this.getContext(index, descendant);
        if (isTemplateRef(viewType)) {
            const embeddedViewContext = {
                context,
                viewContext: this.viewContext
            };
            const embeddedViewRef = this.viewContainerRef.createEmbeddedView<BaseEmbeddedView<any>>(
                viewType as TemplateRef<BaseEmbeddedView<any, AngularEditor>>,
                embeddedViewContext
            );
            // this.embeddedViewRef = embeddedViewRef;
            return embeddedViewRef;
        }
        if (isComponentType(viewType)) {
            const componentRef = this.viewContainerRef.createComponent(viewType) as ComponentRef<any>;
            componentRef.instance.viewContext = this.viewContext;
            componentRef.instance.context = context;
            return componentRef;
        }
    }

    getRootNodes(ref: (EmbeddedViewRef<any> | ComponentRef<any>)): HTMLElement[] {
        if (ref instanceof ComponentRef) {
            return [ref.instance.nativeElement];
        } else {
            return [ref.rootNodes[0]];
        }
        return [];
    }

    createFragment() {
        // const fragment = document.createDocumentFragment();
        const res = [];
        // this.childrenComponent.forEach((component, index) => {
        //     res.push(...this.getRootNodes(component));
        // });
        return res;
    }
}
