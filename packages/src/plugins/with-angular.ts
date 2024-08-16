import { Editor, Element, Node, Operation, Path, PathRef, Range, Transforms } from 'slate';
import { OriginEvent } from '../types/clipboard';
import { SlateError } from '../types/error';
import { completeTable, EDITOR_TO_ON_CHANGE, getPlainText, isDOMText, isInvalidTable, Key, NODE_TO_KEY } from '../utils';
import { getClipboardData, setClipboardData } from '../utils/clipboard/clipboard';
import { findCurrentLineRange } from '../utils/lines';
import { AngularEditor } from './angular-editor';

export const withAngular = <T extends Editor>(editor: T, clipboardFormatKey = 'x-slate-fragment') => {
    const e = editor as T & AngularEditor;
    const { apply, onChange, deleteBackward } = e;

    e.deleteBackward = unit => {
        if (unit !== 'line') {
            return deleteBackward(unit);
        }

        if (editor.selection && Range.isCollapsed(editor.selection)) {
            const parentBlockEntry = Editor.above(editor, {
                match: n => Element.isElement(n) && Editor.isBlock(editor, n),
                at: editor.selection
            });

            if (parentBlockEntry) {
                const [, parentBlockPath] = parentBlockEntry;
                const parentElementRange = Editor.range(editor, parentBlockPath, editor.selection.anchor);

                const currentLineRange = findCurrentLineRange(e, parentElementRange);

                if (!Range.isCollapsed(currentLineRange)) {
                    Transforms.delete(editor, { at: currentLineRange });
                }
            }
        }
    };

    e.apply = (op: Operation) => {
        const matches: [Path | PathRef, Key][] = [];

        switch (op.type) {
            case 'insert_text':
            case 'remove_text':
            case 'set_node': {
                for (const [node, path] of Editor.levels(e, { at: op.path })) {
                    const key = AngularEditor.findKey(e, node);
                    matches.push([path, key]);
                }

                break;
            }

            case 'insert_node':
            case 'remove_node':
            case 'merge_node':
            case 'split_node': {
                for (const [node, path] of Editor.levels(e, {
                    at: Path.parent(op.path)
                })) {
                    const key = AngularEditor.findKey(e, node);
                    matches.push([path, key]);
                }

                break;
            }

            case 'move_node': {
                const commonPath = Path.common(Path.parent(op.path), Path.parent(op.newPath));
                for (const [node, path] of Editor.levels(e, {
                    at: Path.parent(op.path)
                })) {
                    const key = AngularEditor.findKey(e, node);
                    matches.push([Editor.pathRef(editor, path), key]);
                }
                for (const [node, path] of Editor.levels(e, {
                    at: Path.parent(op.newPath)
                })) {
                    if (path.length > commonPath.length) {
                        const key = AngularEditor.findKey(e, node);
                        matches.push([Editor.pathRef(editor, path), key]);
                    }
                }
                break;
            }
        }

        apply(op);

        for (const [source, key] of matches) {
            const [node] = Editor.node(e, Path.isPath(source) ? source : source.current);
            NODE_TO_KEY.set(node, key);
        }
    };

    e.onChange = () => {
        const onContextChange = EDITOR_TO_ON_CHANGE.get(e);

        if (onContextChange) {
            onContextChange();
        }

        onChange();
    };

    e.setFragmentData = (dataTransfer?: Pick<DataTransfer, 'getData' | 'setData'>, originEvent?: OriginEvent) => {
        const { selection } = e;

        if (!selection) {
            return;
        }

        const [start, end] = Range.edges(selection);
        const startVoid = Editor.void(e, { at: start.path });
        const endVoid = Editor.void(e, { at: end.path });

        if (Range.isCollapsed(selection) && !startVoid) {
            return;
        }

        // Create a fake selection so that we can add a Base64-encoded copy of the
        // fragment to the HTML, to decode on future pastes.
        const domRange = AngularEditor.toDOMRange(e, selection);
        let contents = domRange.cloneContents();
        let attach = contents.childNodes[0] as HTMLElement;

        // Make sure attach is non-empty, since empty nodes will not get copied.
        const contentsArray = Array.from(contents.children);
        contentsArray.forEach(node => {
            if (node.textContent && node.textContent.trim() !== '') {
                attach = node as HTMLElement;
            }
        });

        // COMPAT: If the end node is a void node, we need to move the end of the
        // range from the void node's spacer span, to the end of the void node's
        // content, since the spacer is before void's content in the DOM.
        if (endVoid) {
            const [voidNode] = endVoid;
            const r = domRange.cloneRange();
            const domNode = AngularEditor.toDOMNode(e, voidNode);
            r.setEndAfter(domNode);
            contents = r.cloneContents();
        }

        // COMPAT: If the start node is a void node, we need to attach the encoded
        // fragment to the void node's content node instead of the spacer, because
        // attaching it to empty `<div>/<span>` nodes will end up having it erased by
        // most browsers. (2018/04/27)
        if (startVoid) {
            attach = contents.querySelector('[data-slate-spacer]')! as HTMLElement;
        }

        // Remove any zero-width space spans from the cloned DOM so that they don't
        // show up elsewhere when pasted.
        Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(zw => {
            const isNewline = zw.getAttribute('data-slate-zero-width') === 'n';
            zw.textContent = isNewline ? '\n' : '';
        });

        // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
        // in the HTML, and can be used for intra-Slate pasting. If it's a text
        // node, wrap it in a `<span>` so we have something to set an attribute on.
        if (isDOMText(attach)) {
            const span = attach.ownerDocument.createElement('span');
            // COMPAT: In Chrome and Safari, if we don't add the `white-space` style
            // then leading and trailing spaces will be ignored. (2017/09/21)
            span.style.whiteSpace = 'pre';
            span.appendChild(attach);
            contents.appendChild(span);
            attach = span;
        }

        const fragment = e.getFragment();

        // Add the content to a <div> so that we can get its inner HTML.
        const div = contents.ownerDocument.createElement('div');
        const attachWrapper = document.createElement('div');
        const elements = Array.from(contents.children);
        if (isInvalidTable(elements)) {
            contents = completeTable(contents.cloneNode(true) as DocumentFragment);
        }

        attachWrapper.appendChild(contents);
        div.appendChild(attachWrapper);
        div.setAttribute('hidden', 'true');
        contents.ownerDocument.body.appendChild(div);
        setClipboardData({ text: getPlainText(div), elements: fragment as Element[] }, div, attachWrapper, dataTransfer);
        contents.ownerDocument.body.removeChild(div);
    };

    e.deleteCutData = () => {
        const { selection } = editor;
        if (selection) {
            if (Range.isExpanded(selection)) {
                Editor.deleteFragment(editor);
            } else {
                const node = Node.parent(editor, selection.anchor.path);
                if (Element.isElement(node) && Editor.isVoid(editor, node)) {
                    Transforms.delete(editor);
                }
            }
        }
    };

    e.insertData = async (data: DataTransfer) => {
        if (!(await e.insertFragmentData(data))) {
            e.insertTextData(data);
        }
    };

    e.insertFragmentData = async (data: DataTransfer): Promise<boolean> => {
        /**
         * Checking copied fragment from application/x-slate-fragment or data-slate-fragment
         */
        const clipboardData = await getClipboardData(data);
        if (clipboardData && clipboardData.elements) {
            e.insertFragment(clipboardData.elements);
            return true;
        }
        return false;
    };

    e.insertTextData = async (data: DataTransfer): Promise<boolean> => {
        const clipboardData = await getClipboardData(data);

        if (clipboardData && clipboardData.text) {
            const lines = clipboardData.text.split(/\r\n|\r|\n/);
            let split = false;

            for (const line of lines) {
                if (split) {
                    Transforms.splitNodes(e, { always: true });
                }

                e.insertText(line);
                split = true;
            }
            return true;
        }
        return false;
    };

    e.onKeydown = () => {};

    e.onClick = () => {};

    e.isBlockCard = element => false;

    e.isExpanded = element => true;

    e.onError = (errorData: SlateError) => {
        if (errorData.nativeError) {
            console.error(errorData.nativeError);
        } else {
            console.error(errorData);
        }
    };

    return e;
};
