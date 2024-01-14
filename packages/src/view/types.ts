import { AngularEditor } from '../plugins/angular-editor';
import { SlateViewContext } from './context';

/**
 * base class for template
 */
export interface BaseEmbeddedView<T, K extends AngularEditor = AngularEditor> {
    context: T;
    viewContext: SlateViewContext<K>;
}
