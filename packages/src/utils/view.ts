import { ComponentType } from "@angular/cdk/portal";
import { TemplateRef } from "@angular/core";
import { ViewType } from "../interfaces/view-base";

export function isTemplateRef<C>(value: ViewType): value is TemplateRef<C> {
    return value && value instanceof TemplateRef;
}

export function isComponentType<T>(value: ViewType): value is ComponentType<T> {
    return !isTemplateRef(value);
}