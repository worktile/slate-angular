import { InjectionToken } from '@angular/core';
import { ComponentType } from '../../types/view';
import { BaseLeafComponent } from '../../view/base';

export const SLATE_DEFAULT_LEAF_COMPONENT_TOKEN = new InjectionToken<ComponentType<BaseLeafComponent>>('slate-default-leaf-token');