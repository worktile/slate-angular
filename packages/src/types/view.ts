import { TemplateRef } from '@angular/core';
import { BaseFlavour } from '../view/flavour/base';

export interface ComponentType<T> {
    new (...args: any[]): T;
}

export type ViewType = TemplateRef<any> | ComponentType<any> | BaseFlavour;
