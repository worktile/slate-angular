import { Node, Editor } from 'slate';
import { BaseElementComponent } from '../view/base';
import { BaseFlavour } from '../view/flavour/base';

/**
 * Symbols.
 */

export const PLACEHOLDER_SYMBOL = Symbol('placeholder') as unknown as string;

/**
 * Weak map for associating the html element with the component.
 */
export const ELEMENT_TO_COMPONENT: WeakMap<Node, BaseElementComponent | BaseFlavour> = new WeakMap();

export const EDITOR_TO_AFTER_VIEW_INIT_QUEUE: WeakMap<Editor, (() => void)[]> = new WeakMap();
