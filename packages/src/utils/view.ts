import { TemplateRef } from '@angular/core';
import { ComponentType, ViewType } from '../types/view';
import { BaseFlavour } from '../view/base';

export function isTemplateRef<C>(value: ViewType): value is TemplateRef<C> {
    return value && value instanceof TemplateRef;
}

export function isComponentType<T>(value: ViewType): value is ComponentType<T> {
    return !isTemplateRef(value);
}

export function isFlavourType<T>(value: ViewType): value is ComponentType<T> {
    return value && (value as any).isFlavour === true;
}

export class FlavourRef {
    instance: BaseFlavour;

    destroy(): void {
        this.instance.onDestroy();
    }
}
