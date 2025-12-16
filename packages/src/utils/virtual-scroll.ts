import { Editor, Element } from 'slate';
import { AngularEditor } from '../plugins/angular-editor';

export const ELEMENT_KEY_TO_HEIGHTS = new WeakMap<AngularEditor, Map<string, number>>();

// 可以完全替换 getBlockHeight
export const getRealHeightByElement = (editor: AngularEditor, element: Element) => {
    const heights = ELEMENT_KEY_TO_HEIGHTS.get(editor);
    const key = AngularEditor.findKey(editor, element);
    return heights?.get(key.id) || 0;
};

// 滚动到元素位置
export const scrollToElement = (editor: Editor, element: Element, scrollTo: (scrollTop: number) => void) => {

}
