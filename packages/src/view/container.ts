import {
    AfterViewInit,
    ComponentRef,
    Directive,
    ElementRef,
    EmbeddedViewRef,
    Input,
    IterableChangeRecord,
    IterableDiffers,
    QueryList,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { Descendant, Element, Range } from 'slate';
import { SlateElementContext, SlateLeafContext, SlateTextContext, SlateViewContext } from './context';
import { ViewContainerItem } from './container-item';
import { SlateErrorCode } from '../types/error';
import { BaseElementComponent, BaseEmbeddedView } from '../view/base';
import { AngularEditor } from '../plugins/angular-editor';
import { ComponentType, ViewType } from '../types/view';
import { isComponentType, isTemplateRef } from '../utils/view';
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps';
// import { SlateVoidText } from '../components/text/void-text.component';
import { SlateDefaultText } from '../components/text/default-text.component';
import { SlateDefaultLeaf } from '../components/leaf/default-leaf.component';

/**
 * the special container for angular template
 * Add the rootNodes of each child component to the parentElement
 * Remove useless DOM elements, eg: comment...
 */
@Directive()
export abstract class ViewContainer<T extends ViewContainerItem> implements AfterViewInit {
    abstract childrenComponent: QueryList<T>;

    @Input() viewContext: SlateViewContext;

    constructor(protected elementRef: ElementRef<any>, protected differs: IterableDiffers) {}

    ngAfterViewInit() {
        const differ = this.differs.find(this.childrenComponent).create((index, item) => {
            return item;
        });
        // first diff
        differ.diff(this.childrenComponent);
        const parentElement: HTMLElement = this.elementRef.nativeElement.parentElement;
        if (this.childrenComponent.length > 0) {
            parentElement.insertBefore(this.createFragment(), this.elementRef.nativeElement);
            // this.elementRef.nativeElement.remove();
        }
        this.childrenComponent.changes.subscribe(value => {
            const iterableChanges = differ.diff(this.childrenComponent);
            if (iterableChanges) {
                iterableChanges.forEachOperation((record: IterableChangeRecord<T>, previousIndex: Number, currentIndex: number) => {
                    // removed
                    if (currentIndex === null) {
                        return;
                    }
                    // added or moved
                    this.handleContainerItemChange(record, parentElement);
                });
            }
        });
    }

    getPreviousRootNode(currentIndex) {
        if (currentIndex === 0) {
            return null;
        }
        const previousComponent = this.childrenComponent.find((item, index) => index === currentIndex - 1);
        let previousRootNode = previousComponent.rootNodes[previousComponent.rootNodes.length - 1];
        if (previousRootNode) {
            return previousRootNode;
        } else {
            return this.getPreviousRootNode(currentIndex - 1);
        }
    }

    createFragment() {
        const fragment = document.createDocumentFragment();
        this.childrenComponent.forEach((component, index) => {
            fragment.append(...component.rootNodes);
        });
        return fragment;
    }

    handleContainerItemChange(record: IterableChangeRecord<T>, parentElement: HTMLElement) {
        // first insert
        if (this.elementRef.nativeElement.parentElement && this.elementRef.nativeElement.parentElement === parentElement) {
            const fragment = document.createDocumentFragment();
            fragment.append(...record.item.rootNodes);
            parentElement.insertBefore(fragment, this.elementRef.nativeElement);
            // this.elementRef.nativeElement.remove();
            return;
        }
        // insert at start location
        if (record.currentIndex === 0) {
            const fragment = document.createDocumentFragment();
            fragment.append(...record.item.rootNodes);
            parentElement.prepend(fragment);
        } else {
            // insert afterend of previous component end
            let previousRootNode = this.getPreviousRootNode(record.currentIndex);
            if (previousRootNode) {
                record.item.rootNodes.forEach(rootNode => {
                    previousRootNode.insertAdjacentElement('afterend', rootNode);
                    previousRootNode = rootNode;
                });
            } else {
                this.viewContext.editor.onError({
                    code: SlateErrorCode.NotFoundPreviousRootNodeError,
                    name: 'not found previous rootNode',
                    nativeError: null
                });
            }
        }
        // Solve the block-card DOMElement loss when moving nodes
        record.item.appendBlockCardElement();
    }
}

export class ViewContainer2 {
    childrenComponents: (EmbeddedViewRef<any> | ComponentRef<any>)[] = [];
    children: Descendant[];
    parent: Element;
    viewContext: SlateViewContext;
    defaultElementComponentType: ComponentType<BaseElementComponent>;
    viewContainerRef: ViewContainerRef;
    context: SlateTextContext | SlateLeafContext | SlateElementContext;

    initialize(
        children: Descendant[],
        parent: Element,
        viewContext: SlateViewContext,
        context: SlateTextContext | SlateLeafContext | SlateElementContext,
        defaultElementComponentType: ComponentType<BaseElementComponent>,
        viewContainerRef: ViewContainerRef
    ) {
        this.children = children;
        this.parent = parent;
        this.viewContext = viewContext;
        this.defaultElementComponentType = defaultElementComponentType;
        this.viewContainerRef = viewContainerRef;
        this.context = context;
        this.initializeView();
    }

    build(nativeElement: HTMLElement) {
        if (this.childrenComponents.length > 0) {
            nativeElement.append(...this.createFragment());
        }
    }

    private initializeView() {
        this.childrenComponents = this.children.map((descendant, index) => {
            NODE_TO_INDEX.set(descendant, index);
            NODE_TO_PARENT.set(descendant, this.parent);
            return this.createEmbeddedViewOrComponent(descendant, index) as any;
        }) as (EmbeddedViewRef<any> | ComponentRef<any>)[];
    }

    private createEmbeddedViewOrComponent(descendant: Descendant, index: number) {
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

    private getViewType(descendant: Descendant): ViewType {
        if (Element.isElement(descendant)) {
            return (this.viewContext.renderElement && this.viewContext.renderElement(descendant)) || this.defaultElementComponentType;
        } else {
            // const isVoid = this.viewContext.editor.isVoid(this.parent as Element);
            return (this.viewContext.renderText && this.viewContext.renderText(descendant)) || SlateDefaultText;
        }
    }

    private getCommonContext(index: number, descendant: Descendant): { selection: Range; decorations: Range[] } {
        return { selection: null, decorations: [] };
    }

    private getContext(index: number, descendant: Descendant): SlateElementContext | SlateTextContext {
        if (Element.isElement(descendant)) {
            const context = this.context as SlateElementContext;
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
                decorate: context.decorate,
                readonly: context.readonly
            };
            if (isInline) {
                elementContext.attributes['data-slate-inline'] = true;
            }
            if (isVoid) {
                elementContext.attributes['data-slate-void'] = true;
                // elementContext.attributes.contenteditable = false;
            }
            return elementContext;
        } else {
            const computedContext = this.getCommonContext(index, descendant);
            const isLeafBlock = AngularEditor.isLeafBlock(this.viewContext.editor, this.parent);
            const textContext: SlateTextContext = {
                decorations: computedContext.decorations,
                isLast: isLeafBlock && index === this.parent.children.length - 1,
                parent: this.parent,
                text: descendant
            };
            return textContext;
        }
    }

    private getRootNodes(ref: (EmbeddedViewRef<any> | ComponentRef<any>)): HTMLElement[] {
        if (ref instanceof ComponentRef) {
            return [ref.instance.nativeElement];
        } else {
            return [ref.rootNodes[0]];
        }
        return [];
    }

    private createFragment() {
        // const fragment = document.createDocumentFragment();
        const res = [];
        this.childrenComponents.forEach((component, index) => {
            res.push(...this.getRootNodes(component));
        });
        return res;
    }
}

export class ViewContainer3 {
    childrenComponents: (EmbeddedViewRef<any> | ComponentRef<any>)[] = [];
    parent: Element;
    viewContext: SlateViewContext;
    defaultElementComponentType: ComponentType<BaseElementComponent>;
    viewContainerRef: ViewContainerRef;
    contexts: SlateLeafContext[];

    initialize(
        viewContext: SlateViewContext,
        contexts: SlateLeafContext[],
        viewContainerRef: ViewContainerRef
    ) {
        this.viewContext = viewContext;
        this.viewContainerRef = viewContainerRef;
        this.contexts = contexts;
        this.initializeView();
    }

    build(nativeElement: HTMLElement) {
        if (this.childrenComponents.length > 0) {
            nativeElement.append(...this.createFragment());
        }
    }

    private initializeView() {
        this.childrenComponents = this.contexts.map((context, index) => {
            return this.createEmbeddedViewOrComponent(context, index) as any;
        }) as (EmbeddedViewRef<any> | ComponentRef<any>)[];
    }

    private createEmbeddedViewOrComponent(context: SlateLeafContext, index: number) {
        const viewType = this.getViewType(context);
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

    getViewType(context: SlateLeafContext): ViewType {
        return (this.viewContext.renderLeaf && this.viewContext.renderLeaf(context.leaf)) || SlateDefaultLeaf;
    }

    private getRootNodes(ref: (EmbeddedViewRef<any> | ComponentRef<any>)): HTMLElement[] {
        if (ref instanceof ComponentRef) {
            return [ref.instance.nativeElement];
        } else {
            return [ref.rootNodes[0]];
        }
        return [];
    }

    private createFragment() {
        // const fragment = document.createDocumentFragment();
        const res = [];
        this.childrenComponents.forEach((component, index) => {
            res.push(...this.getRootNodes(component));
        });
        return res;
    }
}
