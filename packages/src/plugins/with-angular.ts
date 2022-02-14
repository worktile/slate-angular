import { Editor, Node, Transforms, Range, Path, Operation } from 'slate';
import { EDITOR_TO_ON_CHANGE, NODE_TO_KEY, isDOMText, getPlainText, Key, getSlateFragmentAttribute } from '../utils';
import { AngularEditor } from './angular-editor';
import { SlateError } from '../types/error';
import { findCurrentLineRange } from '../utils/lines';

export const withAngular = <T extends AngularEditor>(
  editor: T,
  clipboardFormatKey = 'x-slate-fragment'
) => {
  const e = editor as T & AngularEditor;
  const { apply, onChange, deleteBackward } = e;

  e.deleteBackward = unit => {
    if (unit !== 'line') {
      return deleteBackward(unit);
    }

    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const parentBlockEntry = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
        at: editor.selection,
      });

      if (parentBlockEntry) {
        const [, parentBlockPath] = parentBlockEntry;
        const parentElementRange = Editor.range(
          editor,
          parentBlockPath,
          editor.selection.anchor
        );

        const currentLineRange = findCurrentLineRange(e, parentElementRange);

        if (!Range.isCollapsed(currentLineRange)) {
          Transforms.delete(editor, { at: currentLineRange });
        }
      }
    }
  };

  e.apply = (op: Operation) => {
    const matches: [Path, Key][] = [];

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
          at: Path.parent(op.path),
        })) {
          const key = AngularEditor.findKey(e, node);
          matches.push([path, key]);
        }

        break;
      }

      case 'move_node': {
        for (const [node, path] of Editor.levels(e, {
          at: Path.common(Path.parent(op.path), Path.parent(op.newPath)),
        })) {
          const key = AngularEditor.findKey(e, node);
          matches.push([path, key]);
        }
        break;
      }
    }

    apply(op);

    for (const [path, key] of matches) {
      const [node] = Editor.node(e, path);
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

  e.setFragmentData = (data: Pick<DataTransfer, 'getData' | 'setData'>) => {
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
    Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(
      zw => {
        const isNewline = zw.getAttribute('data-slate-zero-width') === 'n';
        zw.textContent = isNewline ? '\n' : '';
      }
    );

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
    const stringObj = JSON.stringify(fragment);
    const encoded = window.btoa(encodeURIComponent(stringObj));
    attach.setAttribute('data-slate-fragment', encoded);
    data.setData(`application/${clipboardFormatKey}`, encoded);

    // Add the content to a <div> so that we can get its inner HTML.
    const div = contents.ownerDocument.createElement('div');
    div.appendChild(contents);
    div.setAttribute('hidden', 'true');
    contents.ownerDocument.body.appendChild(div);
    data.setData('text/html', div.innerHTML);
    data.setData('text/plain', getPlainText(div));
    contents.ownerDocument.body.removeChild(div);
    return data;
  };

  e.deleteCutData = () => {
    const { selection } = editor;
    if (selection) {
      if (Range.isExpanded(selection)) {
        Editor.deleteFragment(editor);
      } else {
        const node = Node.parent(editor, selection.anchor.path);
        if (Editor.isVoid(editor, node)) {
          Transforms.delete(editor);
        }
      }
    }
  };

  e.insertData = (data: DataTransfer) => {
    if (!e.insertFragmentData(data)) {
      e.insertTextData(data);
    }
  };

  e.insertFragmentData = (data: DataTransfer): boolean => {
    /**
     * Checking copied fragment from application/x-slate-fragment or data-slate-fragment
     */
    const fragment =
      data.getData(`application/${clipboardFormatKey}`) ||
      getSlateFragmentAttribute(data)

    if (fragment) {
      const decoded = decodeURIComponent(window.atob(fragment))
      const parsed = JSON.parse(decoded) as Node[]
      e.insertFragment(parsed)
      return true
    }
    return false
  }

  e.insertTextData = (data: DataTransfer): boolean => {
    const text = data.getData('text/plain')

    if (text) {
      const lines = text.split(/\r\n|\r|\n/)
      let split = false

      for (const line of lines) {
        if (split) {
          Transforms.splitNodes(e, { always: true })
        }

        e.insertText(line)
        split = true
      }
      return true
    }
    return false
  }

  e.onKeydown = () => {};
  e.onClick = () => {};
  e.onDragenter = () => {};
  e.onDragleave = () => {};

  e.onDragover = (event: DragEvent) => {
    // Only when the target is void, call `preventDefault` to signal
    // that drops are allowed. Editable content is droppable by
    // default, and calling `preventDefault` hides the cursor.
    const node = AngularEditor.toSlateNode(editor, event.target as HTMLElement);

    if (Editor.isVoid(editor, node)) {
        event.preventDefault();
    }
  };

  e.onDrop = (event: DragEvent, isDraggingInternally: boolean) => {
    event.preventDefault();
    // Keep a reference to the dragged range before updating selection
    const draggedRange = editor.selection;

    // Find the range where the drop happened
    const range = AngularEditor.findEventRange(editor, event);
    const data = event.dataTransfer;

    Transforms.select(editor, range);

    if (isDraggingInternally) {
      if (draggedRange) {
        Transforms.delete(editor, {
          at: draggedRange,
        });
      }
    }

    AngularEditor.insertData(editor, data);

    // When dragging from another source into the editor, it's possible
    // that the current editor does not have focus.
    if (!AngularEditor.isFocused(editor)) {
      AngularEditor.focus(editor);
    }
  };

  e.isBlockCard = (element) => false;

  e.onError = (errorData: SlateError) => {
    if (errorData.nativeError) {
      console.error(errorData.nativeError);
    } else {
      console.error(errorData);
    }
  };

  return e;
};
