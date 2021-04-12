import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, ComponentRef, ElementRef, EmbeddedViewRef, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from "@angular/core";
import { SlaBlockCardComponent } from "../block-card/block-card.component";
import { ViewRefType } from '../../interfaces/view-node';

@Component({
    selector: 'sla-nest-entry, div[slaNestEntry]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaNestEntryComponent implements OnInit, OnChanges {
    embeddedViewRef: EmbeddedViewRef<any>;

    componentRef: ComponentRef<any>;

    blockCardComponentRef: ComponentRef<SlaBlockCardComponent>;

    contextObject = { context: {} };

    @Input()
    context: any;

    @Input()
    viewOutlet: ViewRefType;

    @Input()
    isRemoveNativeElement: false;

    get rootNodes(): HTMLElement[] {
        if (this.blockCardComponentRef) {
            return [this.blockCardComponentRef.instance.nativeElement];
        }
        if (this.embeddedViewRef) {
            return this.embeddedViewRef.rootNodes.filter((rootNode) => this.isHTMLElement(rootNode));
        }
        // fix the case for dynamic creat component in plugin component
        // rootNodes contianer dom for dynamic creat component
        if (this.componentRef.instance) {
            return [(this.componentRef.hostView as any).rootNodes[0]];
        }
    }

    isHTMLElement(node: Node) {
        return node.nodeType === 1;
    }

    constructor(
        private elementRef: ElementRef<any>,
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector
    ) { }

    ngOnInit() {
        this.contextObject.context = this.context;
        this.createView();
        if (this.context.isBlockCard) {
            this.createBlockCard();
        }
        if (this.isRemoveNativeElement) {
            this.elementRef.nativeElement.remove();
        }
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges['context'] && !simpleChanges['context'].firstChange) {
            this.updateContext(simpleChanges['context'].currentValue);
        }
        if (simpleChanges['viewOutlet'] && !simpleChanges['viewOutlet'].firstChange) {
            let nextElement = this.rootNodes[this.rootNodes.length - 1].nextElementSibling;
            const parentElement = this.rootNodes[this.rootNodes.length - 1].parentElement;
            this.destroyTemplate();
            this.destroyComponent();
            this.destroyBlockCard();
            this.createView();
            if (this.context.isBlockCard) {
                this.createBlockCard();
            }
            if (nextElement) {
                const fragment = document.createDocumentFragment();
                fragment.append(...this.rootNodes);
                parentElement.insertBefore(fragment, nextElement);
            } else {
                parentElement.append(...this.rootNodes);
            }
        }
    }

    isTemplateRef(viewRef: ViewRefType): boolean {
        return viewRef && viewRef instanceof TemplateRef;
    }

    isComponentType(viewRef: ViewRefType): boolean {
        return viewRef && !(viewRef instanceof TemplateRef);
    }

    destroyComponent() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    destroyTemplate() {
        if (this.embeddedViewRef) {
            this.embeddedViewRef.destroy();
            this.embeddedViewRef = null;
        }
    }

    destroyBlockCard() {
        if (this.blockCardComponentRef) {
            this.blockCardComponentRef.destroy();
            this.blockCardComponentRef = null;
        }
    }

    createView() {
        if (this.isTemplateRef(this.viewOutlet)) {
            const embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.viewOutlet as TemplateRef<any>, this.contextObject);
            this.embeddedViewRef = embeddedViewRef;
        }
        if (this.isComponentType(this.viewOutlet)) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.viewOutlet as ComponentType<any>);
            const componentRef = this.viewContainerRef.createComponent(componentFactory);
            componentRef.instance.context = this.context;
            this.componentRef = componentRef;
        }
    }

    createBlockCard() {
        const rootNodes = this.rootNodes;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SlaBlockCardComponent);
        this.blockCardComponentRef = this.viewContainerRef.createComponent<SlaBlockCardComponent>(componentFactory, null, this.injector);
        this.blockCardComponentRef.instance.initializeCenter(rootNodes, this.context.element);
    }

    updateContext<T>(context: T): void {
        this.contextObject.context = context;
        if (this.componentRef) {
            this.componentRef.instance.context = context;
        }
    }
}
