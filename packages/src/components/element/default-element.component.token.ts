import { InjectionToken } from "@angular/core";
import { ComponentType } from "../../types/view";
import { BaseElementComponent } from "../../view/base";

export const SLATE_DEFAULT_ELEMENT_COMPONENT_TOKEN = new InjectionToken<ComponentType<BaseElementComponent>>('slate-default-element-token');
