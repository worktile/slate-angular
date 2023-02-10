import { ComponentRef, Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { SlateBlockCardComponent } from "../components/block-card/block-card.component";
import { AngularEditor } from "../public-api";
import { ViewType } from "../types/view";
import { isComponentType, isDOMElement, isTemplateRef } from "../utils";
import { BaseComponent, BaseEmbeddedView } from "./base";
import { SlateElementContext, SlateLeafContext, SlateStringContext, SlateTextContext, SlateViewContext } from "./context";

/**
 * Dynamically create/update components or templates
 * Provide rootNodes for the view container
 * If the dynamically created component uses onpush mode, then it must call markForCheck when setting the context
 */
@Directive()
export abstract class ViewContainerItem<T = SlateElementContext | SlateTextContext | SlateLeafContext | SlateStringContext, K extends BaseComponent<T> = BaseComponent<T>> {
    initialized = false;
    embeddedViewRef: EmbeddedViewRef<BaseEmbeddedView<T>>;
    embeddedViewContext: BaseEmbeddedView<T>;
    blockCardComponentRef: ComponentRef<SlateBlockCardComponent>;
    componentRef: ComponentRef<K>;
    viewType: ViewType;

    @Input() viewContext: SlateViewContext;

    get rootNodes() {
        return this.getRootNodes();
    }

    getRootNodes(): HTMLElement[] {
        if (this.embeddedViewRef) {
            return this.embeddedViewRef.rootNodes.filter((rootNode) => isDOMElement(rootNode));
        }
        if (this.componentRef) {
            return [this.componentRef.instance.nativeElement];
        }
        return [];
    }

    constructor(
        protected viewContainerRef: ViewContainerRef
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
            const embeddedViewRef = this.viewContainerRef.createEmbeddedView<BaseEmbeddedView<T>>(this.viewType as TemplateRef<BaseEmbeddedView<T, AngularEditor>>, this.embeddedViewContext);
            this.embeddedViewRef = embeddedViewRef;
        }
        if (isComponentType(this.viewType)) {
            const componentRef = this.viewContainerRef.createComponent(this.viewType) as ComponentRef<any>;
            componentRef.instance.viewContext = this.viewContext;
            componentRef.instance.context = context;
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
                const embeddedViewRef = this.viewContainerRef.createEmbeddedView<BaseEmbeddedView<T>>(this.viewType as TemplateRef<BaseEmbeddedView<T, AngularEditor>>,  this.embeddedViewContext);
                firstRootNode.replaceWith(...embeddedViewRef.rootNodes.filter((rootNode) => isDOMElement(rootNode)));
                this.destroyView();
                this.embeddedViewRef = embeddedViewRef;
            }
            if (isComponentType(this.viewType)) {
                const componentRef = this.viewContainerRef.createComponent(this.viewType) as ComponentRef<any>;
                componentRef.instance.context = context;
                componentRef.instance.viewContext = this.viewContext;
                firstRootNode.replaceWith(componentRef.instance.nativeElement);
                this.destroyView();
                this.componentRef = componentRef;
            }
        }
    }

    appendBlockCardElement() {
        if (this.blockCardComponentRef) {
            this.blockCardComponentRef.instance.append();
        }
    }
}