import { InjectionToken } from '@angular/core';
import { ComponentType } from '../../types/view';
import { BaseTextComponent } from '../../view/base';

export const SLATE_DEFAULT_TEXT_COMPONENT_TOKEN = new InjectionToken<ComponentType<BaseTextComponent>>('slate-default-text-token');

export const SLATE_DEFAULT_VOID_TEXT_COMPONENT_TOKEN = new InjectionToken<ComponentType<BaseTextComponent>>(
    'slate-default-void-text-token'
);