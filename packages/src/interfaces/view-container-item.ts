import { ComponentFactoryResolver, ComponentRef, Directive, EmbeddedViewRef, Input, ViewContainerRef } from "@angular/core";
import { isComponentType, isDOMElement, isTemplateRef } from "../utils";
import { SlateComponentBase, SlateViewBase, ViewType } from "./view-base";
import { SlateElementContext, SlateLeafContext, SlateStringContext, SlateTextContext, SlateViewContext } from "./view-context";

/**
 * Dynamically create/update components or templates
 * Provide rootNodes for the view container
 * If the dynamically created component uses onpush mode, then it must call markForCheck when setting the context
 */
export abstract class SlateViewContainerItem<T = SlateElementContext | SlateTextContext | SlateLeafContext | SlateStringContext, K extends SlateComponentBase<T> = SlateComponentBase<T>> {
    initialized = false;
    embeddedViewRef: EmbeddedViewRef<SlateViewBase<T>>;
    embeddedViewContext: SlateViewBase<T>;
    componentRef: ComponentRef<K>;
    viewType: ViewType;

    @Input() viewContext: SlateViewContext;

    get rootNodes(): HTMLElement[] {
        if (this.embeddedViewRef) {
            return this.embeddedViewRef.rootNodes.filter((rootNode) => isDOMElement(rootNode));
        }
        if (this.componentRef) {
            return [this.componentRef.instance.nativeElement];
        }
        return [];
    }

    constructor(
        protected viewContainerRef: ViewContainerRef,
        protected componentFactoryResolver: ComponentFactoryResolver
    ) { }

    destroyView() {
        if (this.embeddedViewRef) {
            this.embeddedViewRef.destroy();
            this.embeddedViewRef = null;
        }
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    abstract getContext(): T;

    abstract getViewType(): ViewType;

    abstract memoizedContext(prev: T, next: T): boolean;

    createView() {
        this.initialized = true;
        this.viewType = this.getViewType();
        const context = this.getContext();
        if (isTemplateRef(this.viewType)) {
            this.embeddedViewContext = { context, viewContext: this.viewContext };
            const embeddedViewRef = this.viewContainerRef.createEmbeddedView<SlateViewBase<T>>(this.viewType, this.embeddedViewContext);
            this.embeddedViewRef = embeddedViewRef;
        }
        if (isComponentType(this.viewType)) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory<K>(this.viewType);
            const componentRef = this.viewContainerRef.createComponent(componentFactory);
            componentRef.instance.context = context;
            componentRef.instance.viewContext = this.viewContext;
            this.componentRef = componentRef;
        }
    }

    updateView() {
        const viewType = this.getViewType();
        const context = this.getContext();
        if (this.viewType === viewType) {
            if (this.componentRef) {
                if (this.memoizedContext(this.componentRef.instance.context, context)) {
                    return;
                }
                this.componentRef.instance.context = context;
            }
            if (this.embeddedViewRef) {
                if (this.memoizedContext(this.embeddedViewContext.context, context)) {
                    return;
                }
                this.embeddedViewContext.context = context;
            }
        } else {
            this.viewType = viewType;
            const firstRootNode = this.rootNodes[0];
            if (isTemplateRef(this.viewType)) {
                this.embeddedViewContext = { context, viewContext: this.viewContext };
                const embeddedViewRef = this.viewContainerRef.createEmbeddedView<SlateViewBase<T>>(this.viewType, this.embeddedViewContext);
                firstRootNode.replaceWith(...embeddedViewRef.rootNodes.filter((rootNode) => isDOMElement(rootNode)));
                this.destroyView();
                this.embeddedViewRef = embeddedViewRef;
            }
            if (isComponentType(this.viewType)) {
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory<K>(this.viewType);
                const componentRef = this.viewContainerRef.createComponent(componentFactory);
                componentRef.instance.context = context;
                componentRef.instance.viewContext = this.viewContext;
                firstRootNode.replaceWith(componentRef.instance.nativeElement);
                this.destroyView();
                this.componentRef = componentRef;
            }
        }
    }
}