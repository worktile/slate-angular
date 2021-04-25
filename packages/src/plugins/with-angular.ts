import { Editor, Node, Transforms, Range, Text, Element, NodeEntry, Descendant, Path } from 'slate';
import { EDITOR_TO_ON_CHANGE } from '../utils/weak-maps';
import { isDOMText, getPlainText } from '../utils/dom';
import { AngularEditor } from './angular-editor';
import { SlaErrorData } from '../interfaces/error';

export const withAngular = <T extends Editor>(editor: T, clipboardFormatKey = 'x-slate-fragment') => {
    const e = editor as T & AngularEditor;
    const { apply, onChange } = e;

    e.onChange = () => {
        const onContextChange = EDITOR_TO_ON_CHANGE.get(e);

        if (onContextChange) {
            onContextChange();
        }

        onChange();
    };

    e.setFragmentData = (data: DataTransfer) => {
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
          const span = document.createElement('span');
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
        const div = document.createElement('div');
        div.appendChild(contents);
        div.setAttribute('hidden', 'true');
        document.body.appendChild(div);
        data.setData('text/html', div.innerHTML);
        data.setData('text/plain', getPlainText(div));
        document.body.removeChild(div);
    },

    e.insertData = (data: DataTransfer) => {
        const fragment = data.getData(`application/${clipboardFormatKey}`);

        if (fragment) {
            const decoded = decodeURIComponent(window.atob(fragment));
            const parsed = JSON.parse(decoded) as Node[];
            e.insertFragment(parsed);
            return;
        }

        const text = data.getData('text/plain');

        if (text) {
            const lines = text.split(/\r\n|\r|\n/);
            let split = false;

            for (const line of lines) {
                if (split) {
                    Transforms.splitNodes(e, { always: true });
                }

                e.insertText(line);
                split = true;
            }
        }
    };

    // override slate layer logic
    e.normalizeNode = (entry: NodeEntry) => {
      const [node, path] = entry
  
      // There are no core normalizations for text nodes.
      if (Text.isText(node)) {
        return
      }
  
      // Ensure that block and inline nodes have at least one text child.
      if (Element.isElement(node) && node.children.length === 0) {
        const child = { text: '' }
        Transforms.insertNodes(editor, child, {
          at: path.concat(0),
          voids: true,
        })
        return
      }
  
      // Determine whether the node should have block or inline children.
      const shouldHaveInlines = Editor.isEditor(node)
        ? false
        : Element.isElement(node) &&
        (editor.isInline(node) ||
          node.children.length === 0 ||
          Text.isText(node.children[0]) ||
          editor.isInline(node.children[0]))
  
      // Since we'll be applying operations while iterating, keep track of an
      // index that accounts for any added/removed nodes.
      let n = 0
  
      for (let i = 0; i < node.children.length; i++, n++) {
        const child = node.children[i] as Descendant
        const prev = node.children[i - 1] as Descendant
        const isLast = i === node.children.length - 1
        const isInlineOrText =
          Text.isText(child) ||
          (Element.isElement(child) && editor.isInline(child))
  
        // Only allow block nodes in the top-level children and parent blocks
        // that only contain block nodes. Similarly, only allow inline nodes in
        // other inline nodes, or parent blocks that only contain inlines and
        // text.
        if (isInlineOrText !== shouldHaveInlines) {
          Transforms.removeNodes(editor, { at: path.concat(n), voids: true })
          n--
        } else if (Element.isElement(child)) {
          // Ensure that inline nodes are surrounded by text nodes.
          if (editor.isInline(child)) {
            if (prev == null || !Text.isText(prev)) {
              const newChild = { text: '' }
              Transforms.insertNodes(editor, newChild, {
                at: path.concat(n),
                voids: true,
              })
              n++
            } else if (isLast) {
              const newChild = { text: '' }
              Transforms.insertNodes(editor, newChild, {
                at: path.concat(n + 1),
                voids: true,
              })
              n++
            }
          }
        } else {
          // Merge adjacent text nodes that are empty or match.
          if (prev != null && Text.isText(prev)) {
            // adjust logic: first remove empty text to avoid merge empty text #WIK-3805
            if (prev.text === '') {
              // adjust logic: adjust cursor location when empty text is first child of node #WIK-3631
              // ensure current selection in the text #WIK-3762
              const prevFocused = Range.isCollapsed(editor.selection) && Path.equals(editor.selection.anchor.path, path.concat(n - 1));
              if (prev === node.children[0] && prevFocused) {
                Transforms.select(editor, Editor.start(editor, path.concat(n)));
              }
              Transforms.removeNodes(editor, {
                at: path.concat(n - 1),
                voids: true,
              })
              n--
            } else if (Text.equals(child, prev, { loose: true })) {
              Transforms.mergeNodes(editor, { at: path.concat(n), voids: true })
              n--
            } else if (isLast && child.text === '') {
              Transforms.removeNodes(editor, {
                at: path.concat(n),
                voids: true,
              })
              n--
            }
          }
        }
      }
    };

    e.onKeydown = () => {};

    e.onClick = () => {};

    e.equalsNodeKey = (node, another) => false;

    e.isBlockCard = (element) => false;
    
    e.onError = (errorData: SlaErrorData) => {};

    return e;
};
