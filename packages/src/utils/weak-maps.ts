import { Node, Editor } from 'slate';
import { BaseElementComponent } from '../view/base';

/**
 * Weak maps that allow us to go between Slate nodes and DOM nodes. These
 * are used to resolve DOM event-related logic into Slate actions.
 */

export const EDITOR_TO_PLACEHOLDER: WeakMap<Editor, string> = new WeakMap();

/**
 * Symbols.
 */

export const PLACEHOLDER_SYMBOL = Symbol('placeholder') as unknown as string;

/**
 * Weak map for associating the html element with the component.
 */
export const ELEMENT_TO_COMPONENT: WeakMap<Node, BaseElementComponent> = new WeakMap();

export const EDITOR_TO_AFTER_VIEW_INIT_QUEUE: WeakMap<Editor, (() => void)[]> = new WeakMap();
