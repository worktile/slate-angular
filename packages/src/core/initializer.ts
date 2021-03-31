import { ElementRef, } from '@angular/core';
import { Element, Node } from 'slate';
import { ELEMENT_TO_NODE, NODE_TO_ELEMENT, ELEMENT_TO_COMPONENT } from '../utils/weak-maps';
import { ComponentAttributes, SlaComponentBase } from './component.base';

export const Initializer = {
    initComponent(node: Node, hostElementRef: ElementRef, attributes: ComponentAttributes, component?: SlaComponentBase) {
        this.updateWeakMap(node, hostElementRef);
        const nativeElement: HTMLElement = hostElementRef.nativeElement;
        if (Element.isElement(node)) {
            nativeElement.classList.add(`sla-element-${node.type}`);
        }
        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                const value = attributes[key];
                nativeElement.setAttribute(key, value);
            }
        }
        if (component) {
            ELEMENT_TO_COMPONENT.set(node, component);
        }
    },
    updateWeakMap(node: Node, hostElementRef: ElementRef, component?: SlaComponentBase) {
        ELEMENT_TO_NODE.set(hostElementRef.nativeElement, node);
        NODE_TO_ELEMENT.set(node, hostElementRef.nativeElement);
        if (component) {
            ELEMENT_TO_COMPONENT.set(node, component);
        }
    },
    deleteWeakMap(node: Node, hostElementRef: ElementRef, component?: SlaComponentBase) {
        if (NODE_TO_ELEMENT.get(node) === hostElementRef.nativeElement) {
            NODE_TO_ELEMENT.delete(node);
        }
        if (component && ELEMENT_TO_COMPONENT.get(node) === component) {
            ELEMENT_TO_COMPONENT.delete(node);
        }
    }
};
