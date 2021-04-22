import { Editor, Node, Path, Point, Range, Transforms } from 'slate';
import {
    EDITOR_TO_ELEMENT,
    ELEMENT_TO_NODE,
    IS_FOCUSED,
    IS_READONLY,
    NODE_TO_INDEX,
    NODE_TO_PARENT,
    NODE_TO_ELEMENT
} from '../utils/weak-maps';
import {
    DOMElement,
    DOMNode,
    DOMPoint,
    DOMRange,
    DOMSelection,
    DOMStaticRange,
    isDOMElement,
    normalizeDOMPoint
} from '../utils/dom';
import { Injector } from '@angular/core';
import { NodeEntry } from 'slate';
import { SlaErrorData } from '../interfaces/error';

/**
 * A React and DOM-specific version of the `Editor` interface.
 */

export interface AngularEditor extends Editor {
    insertData: (data: DataTransfer) => void;
    setFragmentData: (data: DataTransfer) => void;
    onKeydown: (event: KeyboardEvent) => void;
    onClick: (event: MouseEvent) => void;
    equalsNodeKey: (node: Node, another: Node) => boolean;
    injector: Injector;
    isBlockCard: (node: Node) => boolean;
    onError: (errorData: SlaErrorData) => void;
}

export const AngularEditor = {
    ...Editor,
    /**
     * Find a key for a Slate node.
     */

    // findKey(editor: AngularEditor, node: Node): Key {
    //     let key = NODE_TO_KEY.get(node);

    //     if (!key) {
    //         key = new Key();
    //         NODE_TO_KEY.set(node, key);
    //     }

    //     return key;
    // },

    /**
     * handle editor error.
     */

    onError(errorData: SlaErrorData) {
        if (errorData.nativeError) {
            throw errorData.nativeError;
        }
    },

    /**
     * Find the path of Slate node.
     */

    findPath(editor: AngularEditor, node: Node): Path {
        const path: Path = [];
        let child = node;

        while (true) {
            const parent = NODE_TO_PARENT.get(child);

            if (parent == null) {
                if (Editor.isEditor(child)) {
                    return path;
                } else {
                    break;
                }
            }

            const i = NODE_TO_INDEX.get(child);

            if (i == null) {
                break;
            }

            path.unshift(i);
            child = parent;
        }
        throw new Error(`Unable to find the path for Slate node: ${JSON.stringify(node)}`);
    },

    /**
     * Check if the editor is focused.
     */

    isFocused(editor: AngularEditor): boolean {
        return !!IS_FOCUSED.get(editor);
    },

    /**
     * Check if the editor is in read-only mode.
     */

    isReadonly(editor: AngularEditor): boolean {
        return !!IS_READONLY.get(editor);
    },

    /**
     * Check if the editor is hanging right.
     */
    isBlockHangingRight(editor: AngularEditor): boolean {
        const { selection } = editor;
        if (!selection) {
            return false;
        }
        if (Range.isCollapsed(selection)) {
            return false;
        }
        const [start, end] = Range.edges(selection);
        const endBlock = Editor.above(editor, { at: end, match: (node) => Editor.isBlock(editor, node) });
        return Editor.isStart(editor, end, endBlock[1]);
    },

    /**
     * Blur the editor.
     */

    blur(editor: AngularEditor): void {
        const el = AngularEditor.toDOMNode(editor, editor);
        IS_FOCUSED.set(editor, false);

        if (window.document.activeElement === el) {
            el.blur();
        }
    },

    /**
     * Focus the editor.
     */

    focus(editor: AngularEditor): void {
        const el = AngularEditor.toDOMNode(editor, editor);
        IS_FOCUSED.set(editor, true);

        if (window.document.activeElement !== el) {
            el.focus({ preventScroll: true });
        }
    },

    /**
     * Deselect the editor.
     */

    deselect(editor: AngularEditor): void {
        const { selection } = editor;
        const domSelection = window.getSelection();

        if (domSelection && domSelection.rangeCount > 0) {
            domSelection.removeAllRanges();
        }

        if (selection) {
            Transforms.deselect(editor);
        }
    },

    /**
     * Check if a DOM node is within the editor.
     */

    hasDOMNode(editor: AngularEditor, target: DOMNode, options: { editable?: boolean } = {}): boolean {
        const { editable = false } = options;
        const editorEl = AngularEditor.toDOMNode(editor, editor);
        let targetEl;

        // COMPAT: In Firefox, reading `target.nodeType` will throw an error if
        // target is originating from an internal "restricted" element (e.g. a
        // stepper arrow on a number input). (2018/05/04)
        // https://github.com/ianstormtaylor/slate/issues/1819
        try {
            targetEl = (isDOMElement(target) ? target : target.parentElement) as HTMLElement;
        } catch (err) {
            if (!err.message.includes('Permission denied to access property "nodeType"')) {
                throw err;
            }
        }

        if (!targetEl) {
            return false;
        }

        return targetEl.closest(`[data-slate-editor]`) === editorEl &&
            (!editable || targetEl.isContentEditable ||
                !!targetEl.getAttribute('data-slate-zero-width'));
    },

    /**
     * Insert data from a `DataTransfer` into the editor.
     */

    insertData(editor: AngularEditor, data: DataTransfer): void {
        editor.insertData(data);
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

    /**
     * Sets data from the currently selected fragment on a `DataTransfer`.
     */

    setFragmentData(editor: AngularEditor, data: DataTransfer): void {
        editor.setFragmentData(data);
    },

    /**
     * Find the native DOM element from a Slate node.
     */

    toDOMNode(editor: AngularEditor, node: Node): HTMLElement {
        const domNode = Editor.isEditor(node)
            ? EDITOR_TO_ELEMENT.get(editor)
            : NODE_TO_ELEMENT.get(node);

        if (!domNode) {
            throw new Error(`Cannot resolve a DOM node from Slate node: ${JSON.stringify(node)}`);
        }

        return domNode;
    },

    /**
     * Find a native DOM selection point from a Slate point.
     */

    toDOMPoint(editor: AngularEditor, point: Point): DOMPoint {
        const [node] = Editor.node(editor, point.path);
        const el = AngularEditor.toDOMNode(editor, node);
        let domPoint: DOMPoint | undefined;

        // block card
        const cardTargetAttr = AngularEditor.getCardTargetAttribute(el);
        if (cardTargetAttr) {
            if (point.offset === -1) {
                const cursorNode = AngularEditor.getCardCursorNode(editor, node, { direction: 'left' });
                return [cursorNode, 1];
            } else {
                const cursorNode = AngularEditor.getCardCursorNode(editor, node, { direction: 'right' });
                return [cursorNode, 1];
            }
        }

        // If we're inside a void node, force the offset to 0, otherwise the zero
        // width spacing character will result in an incorrect offset of 1
        if (Editor.void(editor, { at: point })) {
            point = { path: point.path, offset: 0 };
        }

        // For each leaf, we need to isolate its content, which means filtering
        // to its direct text and zero-width spans. (We have to filter out any
        // other siblings that may have been rendered alongside them.)
        const selector = `[data-slate-string], [data-slate-zero-width]`;
        const texts = Array.from(el.querySelectorAll(selector));
        let start = 0;

        for (const text of texts) {
            const domNode = text.childNodes[0] as HTMLElement;

            if (domNode == null || domNode.textContent == null) {
                continue;
            }

            const { length } = domNode.textContent;
            const attr = text.getAttribute('data-slate-length');
            const trueLength = attr == null ? length : parseInt(attr, 10);
            const end = start + trueLength;

            if (point.offset <= end) {
                const offset = Math.min(length, Math.max(0, point.offset - start));
                domPoint = [domNode, offset];
                // fixed cursor position after zero width char
                if (offset === 0 && length === 1 && domNode.textContent === '\uFEFF') {
                    domPoint = [domNode, offset + 1];
                }
                break;
            }

            start = end;
        }

        if (!domPoint) {
            throw new Error(`Cannot resolve a DOM point from Slate point: ${JSON.stringify(point)}`);
        }

        return domPoint;
    },

    /**
     * Find a native DOM range from a Slate `range`.
     */

    toDOMRange(editor: AngularEditor, range: Range): DOMRange {
        const { anchor, focus } = range;
        const isBackward = Range.isBackward(range);
        const domAnchor = AngularEditor.toDOMPoint(editor, anchor);
        const domFocus = Range.isCollapsed(range) ? domAnchor : AngularEditor.toDOMPoint(editor, focus);

        const domRange = window.document.createRange();
        const [startNode, startOffset] = isBackward ? domFocus : domAnchor;
        const [endNode, endOffset] = isBackward ? domAnchor : domFocus;

        // A slate Point at zero-width Leaf always has an offset of 0 but a native DOM selection at
        // zero-width node has an offset of 1 so we have to check if we are in a zero-width node and
        // adjust the offset accordingly.
        const startEl = (isDOMElement(startNode)
            ? startNode
            : startNode.parentElement) as HTMLElement;
        const isStartAtZeroWidth = !!startEl.getAttribute('data-slate-zero-width');
        const endEl = (isDOMElement(endNode)
            ? endNode
            : endNode.parentElement) as HTMLElement;
        const isEndAtZeroWidth = !!endEl.getAttribute('data-slate-zero-width');

        domRange.setStart(startNode, isStartAtZeroWidth ? 1 : startOffset);
        domRange.setEnd(endNode, isEndAtZeroWidth ? 1 : endOffset);
        return domRange;
    },

    /**
     * Find a Slate node from a native DOM `element`.
     */

    toSlateNode(editor: AngularEditor, domNode: DOMNode): Node {
        let domEl = isDOMElement(domNode) ? domNode : domNode.parentElement;

        if (domEl && !domEl.hasAttribute('data-slate-node')) {
            domEl = domEl.closest(`[data-slate-node]`);
        }

        const node = domEl ? ELEMENT_TO_NODE.get(domEl as HTMLElement) : null;

        if (!node) {
            throw new Error(`Cannot resolve a Slate node from DOM node: ${domEl}`);
        }

        return node;
    },

    /**
     * Get the target range from a DOM `event`.
     */

    findEventRange(editor: AngularEditor, event: any): Range {
        if ('nativeEvent' in event) {
            event = event.nativeEvent;
        }

        const { clientX: x, clientY: y, target } = event;

        if (x == null || y == null) {
            throw new Error(`Cannot resolve a Slate range from a DOM event: ${event}`);
        }

        const node = AngularEditor.toSlateNode(editor, event.target);
        const path = AngularEditor.findPath(editor, node);

        // If the drop target is inside a void node, move it into either the
        // next or previous node, depending on which side the `x` and `y`
        // coordinates are closest to.
        if (Editor.isVoid(editor, node)) {
            const rect = target.getBoundingClientRect();
            const isPrev = editor.isInline(node)
                ? x - rect.left < rect.left + rect.width - x
                : y - rect.top < rect.top + rect.height - y;

            const edge = Editor.point(editor, path, {
                edge: isPrev ? 'start' : 'end'
            });
            const point = isPrev ? Editor.before(editor, edge) : Editor.after(editor, edge);

            if (point) {
                return Editor.range(editor, point);
            }
        }

        // Else resolve a range from the caret position where the drop occured.
        let domRange;
        const { document } = window;

        // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
        if (document.caretRangeFromPoint) {
            domRange = document.caretRangeFromPoint(x, y);
        } else {
            const position = document.caretPositionFromPoint(x, y);

            if (position) {
                domRange = document.createRange();
                domRange.setStart(position.offsetNode, position.offset);
                domRange.setEnd(position.offsetNode, position.offset);
            }
        }

        if (!domRange) {
            throw new Error(`Cannot resolve a Slate range from a DOM event: ${event}`);
        }

        // Resolve a Slate range from the DOM range.
        const range = AngularEditor.toSlateRange(editor, domRange);
        return range;
    },

    /**
     * Find a Slate point from a DOM selection's `domNode` and `domOffset`.
     */

    toSlatePoint(editor: AngularEditor, domPoint: DOMPoint): Point {
        const [domNode] = domPoint;
        const [nearestNode, nearestOffset] = normalizeDOMPoint(domPoint);
        let parentNode = nearestNode.parentNode as DOMElement;
        let textNode: DOMElement | null = null;
        let offset = 0;

        // block card
        const cardTargetAttr = AngularEditor.getCardTargetAttribute(domNode);
        if (cardTargetAttr) {
            const domSelection = window.getSelection();
            const isBackward = editor.selection && Range.isBackward(editor.selection);
            const blockCardEntry = AngularEditor.toSlateCardEntry(editor, domNode) || AngularEditor.toSlateCardEntry(editor, nearestNode);
            const [, blockPath] = blockCardEntry;
            if (domSelection.isCollapsed) {
                if (AngularEditor.isCardLeftByTargetAttr(cardTargetAttr)) {
                    return { path: blockPath, offset: -1 };
                }
                else {
                    return { path: blockPath, offset: -2 };
                }
            }
            // forward
            // and to the end of previous node
            if (AngularEditor.isCardLeftByTargetAttr(cardTargetAttr) && !isBackward) {
                const endPath =
                  blockPath[blockPath.length - 1] <= 0
                    ? blockPath
                    : Path.previous(blockPath);
                return AngularEditor.end(editor, endPath);
            }
            // to the of current node
            if (
                (AngularEditor.isCardCenterByTargetAttr(cardTargetAttr) ||
                AngularEditor.isCardRightByTargetAttr(cardTargetAttr)) &&
                !isBackward
            ) {
                return AngularEditor.end(editor, blockPath);
            }
            // backward
            // and to the start of next node
            if (AngularEditor.isCardRightByTargetAttr(cardTargetAttr) && isBackward) {
                return AngularEditor.start(editor, Path.next(blockPath));
            }
            // and to the start of current node
            if (
                (AngularEditor.isCardCenterByTargetAttr(cardTargetAttr) ||
                AngularEditor.isCardLeftByTargetAttr(cardTargetAttr)) &&
                isBackward
            ) {
                return AngularEditor.start(editor, blockPath);
            }
        }

        if (parentNode) {
            const voidNode = parentNode.closest('[data-slate-void="true"]');
            let leafNode = parentNode.closest('[data-slate-leaf]');
            let domNode: DOMElement | null = null;

            // Calculate how far into the text node the `nearestNode` is, so that we
            // can determine what the offset relative to the text node is.
            if (leafNode) {
                textNode = leafNode.closest('[data-slate-node="text"]')!;
                const range = window.document.createRange();
                range.setStart(textNode, 0);
                range.setEnd(nearestNode, nearestOffset);
                const contents = range.cloneContents();
                const removals = [
                    ...contents.querySelectorAll('[data-slate-zero-width]'),
                    ...contents.querySelectorAll('[contenteditable=false]')
                ];

                removals.forEach(el => {
                    el!.parentNode!.removeChild(el);
                });

                // COMPAT: Edge has a bug where Range.prototype.toString() will
                // convert \n into \r\n. The bug causes a loop when slate-react
                // attempts to reposition its cursor to match the native position. Use
                // textContent.length instead.
                // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10291116/
                offset = contents.textContent!.length;
                domNode = textNode;
            } else if (voidNode) {
                // For void nodes, the element with the offset key will be a cousin, not an
                // ancestor, so find it by going down from the nearest void parent.

                leafNode = voidNode.querySelector('[data-slate-leaf]')!;
                parentNode = voidNode.querySelector('[data-slate-length="0"]');
                textNode = leafNode.closest('[data-slate-node="text"]')!;
                domNode = leafNode;
                offset = domNode.textContent!.length;
            }

            // COMPAT: If the parent node is a Slate zero-width space, editor is
            // because the text node should have no characters. However, during IME
            // composition the ASCII characters will be prepended to the zero-width
            // space, so subtract 1 from the offset to account for the zero-width
            // space character.
            if (domNode && offset === domNode.textContent!.length && parentNode && parentNode.hasAttribute('data-slate-zero-width')) {
                offset--;
            }
        }

        if (!textNode) {
            throw new Error(`Cannot resolve a Slate point from DOM point: ${domPoint}`);
        }

        // COMPAT: If someone is clicking from one Slate editor into another,
        // the select event fires twice, once for the old editor's `element`
        // first, and then afterwards for the correct `element`. (2017/03/03)
        const slateNode = AngularEditor.toSlateNode(editor, textNode!);
        const path = AngularEditor.findPath(editor, slateNode);
        return { path, offset };
    },

    /**
     * Find a Slate range from a DOM range or selection.
     */

    toSlateRange(editor: AngularEditor, domRange: DOMRange | DOMStaticRange | DOMSelection): Range {
        const el = domRange instanceof Selection ? domRange.anchorNode : domRange.startContainer;
        let anchorNode;
        let anchorOffset;
        let focusNode;
        let focusOffset;
        let isCollapsed;

        if (el) {
            if (domRange instanceof Selection) {
                anchorNode = domRange.anchorNode;
                anchorOffset = domRange.anchorOffset;
                focusNode = domRange.focusNode;
                focusOffset = domRange.focusOffset;
                isCollapsed = domRange.isCollapsed;
            } else {
                anchorNode = domRange.startContainer;
                anchorOffset = domRange.startOffset;
                focusNode = domRange.endContainer;
                focusOffset = domRange.endOffset;
                isCollapsed = domRange.collapsed;
            }
        }

        if (anchorNode == null || focusNode == null || anchorOffset == null || focusOffset == null) {
            throw new Error(`Cannot resolve a Slate range from DOM range: ${domRange}`);
        }

        const anchor = AngularEditor.toSlatePoint(editor, [anchorNode, anchorOffset]);
        const focus = isCollapsed ? anchor : AngularEditor.toSlatePoint(editor, [focusNode, focusOffset]);

        return { anchor, focus };
    },

    hasCardTarget(node: DOMNode) {
        return node && (node.parentElement.hasAttribute('card-target') || (node instanceof HTMLElement && node.hasAttribute('card-target')));
    },

    getCardTargetAttribute(node: DOMNode) {
        return node.parentElement.attributes['card-target'] || (node instanceof HTMLElement && node.attributes['card-target']);
    },

    getCardCursorNode(editor: AngularEditor, blockCardNode: Node, options: {
        direction: 'left' | 'right' | 'center'
    }) {
        const blockCardElement = AngularEditor.toDOMNode(editor, blockCardNode);
        const cardCenter = blockCardElement.parentElement;
        return options.direction === 'left'
          ? cardCenter.previousElementSibling
          : cardCenter.nextElementSibling;
    },

    isCardLeft(node: DOMNode) {
        const cardTarget = AngularEditor.getCardTargetAttribute(node);
        return cardTarget && cardTarget.nodeValue === 'card-left';
    },

    isCardLeftByTargetAttr(targetAttr: any) {
        return targetAttr && targetAttr.nodeValue === 'card-left';
    },

    isCardRightByTargetAttr(targetAttr: any) {
        return targetAttr && targetAttr.nodeValue === 'card-right';
    },

    isCardCenterByTargetAttr(targetAttr: any) {
        return targetAttr && targetAttr.nodeValue === 'card-center';
    },

    toSlateCardEntry(editor: AngularEditor, node: DOMNode): NodeEntry {
        const element = node.parentElement
            .closest('.sla-block-card-element')?.querySelector('[card-target="card-center"]')
            .firstElementChild;
        const slateNode = AngularEditor.toSlateNode(editor, element);
        const path = AngularEditor.findPath(editor, slateNode);
        return [slateNode, path];
    },

    moveBlockCard(editor: AngularEditor, blockCardNode: Node, options: {
        direction: 'left' | 'right'
    }) {
        const cursorNode = AngularEditor.getCardCursorNode(editor, blockCardNode, options);
        const domSelection = window.getSelection();
        domSelection.setBaseAndExtent(cursorNode, 1, cursorNode, 1);
    }
};
