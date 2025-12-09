import { Editor, Node, Path, Transforms, Element } from 'slate';
import { Injector } from '@angular/core';
import { SlateError } from '../types/error';
import { FAKE_LEFT_BLOCK_CARD_OFFSET, FAKE_RIGHT_BLOCK_CARD_OFFSET } from '../utils/block-card';
import { CustomDOMEditor } from './with-dom';
import { DOMEditor, EDITOR_TO_ELEMENT, IS_FOCUSED } from 'slate-dom';
import { ClipboardData } from '../types/clipboard';

/**
 * An Angular and DOM-specific version of the `Editor` interface.
 */
export interface AngularEditor extends CustomDOMEditor {
    deleteCutData: () => void;
    selectAll: () => void;
    onKeydown: (event: KeyboardEvent) => void;
    onClick: (event: MouseEvent) => void;
    injector: Injector;
    isBlockCard: (node: Node) => boolean;
    isExpanded: (node: Element) => boolean;
    onError: (errorData: SlateError) => void;
    customInsertFragmentData: (data: DataTransfer, clipboardData: ClipboardData | null) => Promise<boolean>;
    customInsertTextData: (data: DataTransfer) => Promise<boolean>;
}

export const AngularEditor = {
    ...CustomDOMEditor,
    /**
     * handle editor error.
     */

    onError(errorData: SlateError) {
        if (errorData.nativeError) {
            throw errorData.nativeError;
        }
    },

    /**
     * onKeydown hook.
     */
    onKeydown(editor: AngularEditor, data: KeyboardEvent): void {
        editor.onKeydown(data);
    },

    /**
     * onClick hook.
     */
    onClick(editor: AngularEditor, data: MouseEvent): void {
        editor.onClick(data);
    },

    deleteCutData(editor: AngularEditor): void {
        editor.deleteCutData();
    },

    isLeafBlock(editor: AngularEditor, node: Node): boolean {
        return Element.isElement(node) && !editor.isInline(node) && Editor.hasInlines(editor, node);
    },

    /**
     * move native selection to card-left or card-right
     * @param editor
     * @param blockCardNode
     * @param options
     */
    moveBlockCard(
        editor: AngularEditor,
        blockCardNode: Node,
        options: {
            direction: 'left' | 'right';
        }
    ) {
        const cursorNode = AngularEditor.getCardCursorNode(editor, blockCardNode, options);
        const window = AngularEditor.getWindow(editor);
        const domSelection = window.getSelection();
        domSelection.setBaseAndExtent(cursorNode, 1, cursorNode, 1);
    },

    /**
     * move slate selection to card-left or card-right
     * @param editor
     * @param path
     * @param options
     */
    moveBlockCardCursor(
        editor: AngularEditor,
        path: Path,
        options: {
            direction: 'left' | 'right';
        }
    ) {
        const cursor = {
            path,
            offset: options.direction === 'left' ? FAKE_LEFT_BLOCK_CARD_OFFSET : FAKE_RIGHT_BLOCK_CARD_OFFSET
        };
        Transforms.select(editor, { anchor: cursor, focus: cursor });
    },
    focus: (editor, options = { retries: 5 }) => {
        // Return if already focused
        if (IS_FOCUSED.get(editor)) {
            return;
        }

        // Return if no dom node is associated with the editor, which means the editor is not yet mounted
        // or has been unmounted. This can happen especially, while retrying to focus the editor.
        if (!EDITOR_TO_ELEMENT.get(editor)) {
            return;
        }

        IS_FOCUSED.set(editor, true);
        const el = DOMEditor.toDOMNode(editor, editor);
        const root = DOMEditor.findDocumentOrShadowRoot(editor);
        if (root.activeElement !== el) {
            // IS_FOCUSED should be set before calling el.focus() to ensure that
            // FocusedContext is updated to the correct value
            el.focus({ preventScroll: true });
        }
    }
};
