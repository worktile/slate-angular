import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, ComponentRef, ElementRef, EmbeddedViewRef, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from "@angular/core";
import { SlaBlockCardComponent } from "../block-card/block-card.component";
import { ViewRefType } from '../../interfaces/view-node';

@Component({
    selector: 'sla-nest-entry, div[slaNestEntry]',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaNestEntryComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    context: any;

    @Input()
    viewOutlet: ViewRefType;

    @Input()
    isRemoveNativeElement: false;

    rootNode: HTMLElement;

    embeddedViewRef: EmbeddedViewRef<any>;

    componentRef: ComponentRef<any>;

    contextObject = { context: {} };

    blockCardComponentRef: ComponentRef<SlaBlockCardComponent>;

    constructor(
        private elementRef: ElementRef<any>,
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector
    ) {}

    ngOnInit() {
        this.contextObject.context = this.context;
        this.createView();
        if (this.isRemoveNativeElement) {
            this.elementRef.nativeElement.remove();
        }

        if (this.context.isBlockCard) {
            this.rootNode = this.createBlockCard();
        }
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges['context'] && !simpleChanges['context'].firstChange) {
            this.updateContext(simpleChanges['context'].currentValue);
        }
        if (simpleChanges['viewOutlet'] && !simpleChanges['viewOutlet'].firstChange) {
            this.createView();

            if (this.context.isBlockCard) {
                this.rootNode = this.createBlockCard();
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

    createView() {
        if (this.isTemplateRef(this.viewOutlet)) {
            const embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.viewOutlet as TemplateRef<any>, this.contextObject);

            if (this.rootNode) {
                this.rootNode.replaceWith(embeddedViewRef.rootNodes[0]);
            }
            this.destroyTemplate();
            this.destroyComponent();

            this.rootNode = embeddedViewRef.rootNodes[0];
            this.embeddedViewRef = embeddedViewRef;
        }

        if (this.isComponentType(this.viewOutlet)) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.viewOutlet as ComponentType<any>);
            const componentRef = this.viewContainerRef.createComponent(componentFactory);
            componentRef.instance.context = this.context;

            if (this.rootNode) {
                this.rootNode.replaceWith((componentRef.hostView as any).rootNodes[0]);
            }
            this.destroyTemplate();
            this.destroyComponent();

            this.rootNode = (componentRef.hostView as any).rootNodes[0];
            this.componentRef = componentRef;
        }
    }

    updateContext<T>(context: T): void {
        this.contextObject.context = context;

        if (this.componentRef) {
            this.componentRef.instance.context = context;
        }
    }

    createBlockCard() {
        if (this.blockCardComponentRef) {
            this.blockCardComponentRef.destroy();
            this.blockCardComponentRef = null;
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SlaBlockCardComponent);
        this.blockCardComponentRef = this.viewContainerRef.createComponent<SlaBlockCardComponent>(componentFactory, null, this.injector);
        this.blockCardComponentRef.instance.initializeCenter(this.rootNode, this.context.element);
        return this.blockCardComponentRef.instance.nativeElement;
    }

    ngOnDestroy() {}
}
