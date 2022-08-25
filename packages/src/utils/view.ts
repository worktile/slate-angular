import { TemplateRef } from "@angular/core";
import { ComponentType, ViewType } from "../types/view";

export function isTemplateRef<C>(value: ViewType): value is TemplateRef<C> {
  return value && value instanceof TemplateRef;
}

export function isComponentType<T>(value: ViewType): value is ComponentType<T> {
  return !isTemplateRef(value);
}
