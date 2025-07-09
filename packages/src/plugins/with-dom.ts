import {
    FAKE_LEFT_BLOCK_CARD_OFFSET,
    FAKE_RIGHT_BLOCK_CARD_OFFSET,
    getCardTargetAttribute,
    isCardLeftByTargetAttr
} from '../utils/block-card';
import { BasePoint, BaseRange, Editor, Node, Point, Range, Element, NodeEntry, point } from 'slate';
import {
    DOMEditor,
    DOMElement,
    DOMNode,
    DOMRange,
    DOMPoint,
    DOMSelection,
    DOMStaticRange,
    EDITOR_TO_ELEMENT,
    hasShadowRoot,
    IS_CHROME,
    isDOMElement,
    isDOMSelection,
    NODE_TO_ELEMENT,
    NODE_TO_INDEX,
    NODE_TO_PARENT,
    normalizeDOMPoint
} from 'slate-dom';
import { AngularEditor } from './angular-editor';

export interface CustomDOMEditor extends DOMEditor {
    hasEditableTarget: (editor: CustomDOMEditor, target: EventTarget | null) => target is DOMNode;
    hasRange: (editor: CustomDOMEditor, range: Range) => boolean;
    hasSelectableTarget: (editor: CustomDOMEditor, target: EventTarget | null) => boolean;
    hasTarget: (editor: CustomDOMEditor, target: EventTarget | null) => target is DOMNode;
    insertData: (data: DataTransfer) => void;
    insertFragmentData: (data: DataTransfer) => boolean;
    insertTextData: (data: DataTransfer) => boolean;
    isTargetInsideNonReadonlyVoid: (editor: CustomDOMEditor, target: EventTarget | null) => boolean;
    setFragmentData: (data: DataTransfer, originEvent?: 'drag' | 'copy' | 'cut') => void;
}

const customToDOMNode = (editor: Editor, node: Node): HTMLElement => {
    const domNode = Editor.isEditor(node) ? EDITOR_TO_ELEMENT.get(editor) : NODE_TO_ELEMENT.get(node);

    if (!domNode) {
        throw new Error(`Cannot resolve a DOM node from Slate node: ${JSON.stringify(node)}`);
    }

    return domNode;
};
DOMEditor.toDOMNode = customToDOMNode as unknown as (editor: DOMEditor, node: Node) => HTMLElement;

const toDOMPointForBlockCard = (editor: AngularEditor, point: Point): DOMPoint | undefined => {
    const [node] = Editor.node(editor, point.path);
    const [parentNode] = Editor.parent(editor, point.path);
    if (editor.isBlockCard(parentNode) || editor.isBlockCard(node)) {
        if (point.offset < 0) {
            if (point.offset === FAKE_LEFT_BLOCK_CARD_OFFSET) {
                const cursorNode = CustomDOMEditor.getCardCursorNode(editor, node, { direction: 'left' });
                return [cursorNode, 1];
            } else {
                const cursorNode = CustomDOMEditor.getCardCursorNode(editor, node, { direction: 'right' });
                return [cursorNode, 1];
            }
        }
        if (editor.selection && Range.isExpanded(editor.selection)) {
            const [start, end] = Range.edges(editor.selection);
            if (start === point) {
                const cursorNode = CustomDOMEditor.getCardCursorNode(editor, parentNode, { direction: 'left' });
                return [cursorNode, 1];
            } else {
                const cursorNode = CustomDOMEditor.getCardCursorNode(editor, parentNode, { direction: 'right' });
                return [cursorNode, 1];
            }
        }
    }
};

const customToDOMPoint = (editor: AngularEditor, point: Point): DOMPoint => {
    const [node] = Editor.node(editor, point.path);
    const el = customToDOMNode(editor, node);
    let domPoint: DOMPoint | undefined;

    const domPointForBlackCard = toDOMPointForBlockCard(editor, point);
    if (domPointForBlackCard) {
        return domPointForBlackCard;
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
};
DOMEditor.toDOMPoint = customToDOMPoint as unknown as (editor: DOMEditor, point: BasePoint) => DOMPoint;

const toSlatePointForBlockCard = (editor: AngularEditor, domPoint: DOMPoint, nearestNode: DOMNode): Point | undefined => {
    const [domNode] = domPoint;
    const cardTargetAttr = getCardTargetAttribute(domNode);
    if (cardTargetAttr) {
        const domSelection = window.getSelection();
        const blockCardEntry = CustomDOMEditor.toSlateCardEntry(editor, domNode) || CustomDOMEditor.toSlateCardEntry(editor, nearestNode);
        const [, blockPath] = blockCardEntry;
        if (domSelection.isCollapsed) {
            if (isCardLeftByTargetAttr(cardTargetAttr)) {
                return { path: blockPath, offset: -1 };
            } else {
                return { path: blockPath, offset: -2 };
            }
        }
        if (isCardLeftByTargetAttr(cardTargetAttr)) {
            return Editor.start(editor, blockPath);
        } else {
            return Editor.end(editor, blockPath);
        }
    }
};

const customToSlatePoint = <T extends boolean>(
    editor: AngularEditor,
    domPoint: DOMPoint,
    options: {
        exactMatch: boolean;
        suppressThrow: T;
        searchDirection?: 'forward' | 'backward';
    }
): T extends true ? Point | null : Point => {
    const { exactMatch, suppressThrow } = options;
    const [nearestNode, nearestOffset] = normalizeDOMPoint(domPoint);
    let parentNode = nearestNode.parentNode as DOMElement;
    let textNode: DOMElement | null = null;
    let offset = 0;

    const slatePointForBlockCard = toSlatePointForBlockCard(editor, domPoint, nearestNode);
    if (slatePointForBlockCard) {
        return slatePointForBlockCard;
    }

    if (parentNode) {
        const voidNode = parentNode.closest('[data-slate-void="true"]');
        let leafNode = parentNode.closest('[data-slate-leaf]');
        let domNode: DOMElement | null = null;

        // Calculate how far into the text node the `nearestNode` is, so that we
        // can determine what the offset relative to the text node is.
        if (leafNode && CustomDOMEditor.isLeafInEditor(editor, leafNode)) {
            textNode = leafNode.closest('[data-slate-node="text"]')!;
            const window = DOMEditor.getWindow(editor);
            const range = window.document.createRange();
            range.setStart(textNode, 0);
            range.setEnd(nearestNode, nearestOffset);
            const contents = range.cloneContents();
            const removals = [
                ...Array.prototype.slice.call(contents.querySelectorAll('[data-slate-zero-width]')),
                ...Array.prototype.slice.call(contents.querySelectorAll('[contenteditable=false]'))
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
            const spacer = voidNode.querySelector('[data-slate-spacer="true"]')!;
            leafNode = spacer.firstElementChild;
            parentNode = leafNode.firstElementChild;
            textNode = spacer;
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
        if (suppressThrow) {
            return null as T extends true ? Point | null : Point;
        }
        throw new Error(`Cannot resolve a Slate point from DOM point: ${domPoint}`);
    }

    // COMPAT: If someone is clicking from one Slate editor into another,
    // the select event fires twice, once for the old editor's `element`
    // first, and then afterwards for the correct `element`. (2017/03/03)
    let slateNode = null;
    try {
        slateNode = CustomDOMEditor.toSlateNode(editor, textNode);
    } catch (error) {
        if (!suppressThrow) {
            throw error;
        }
    }
    if (!slateNode && suppressThrow) {
        return null as T extends true ? Point | null : Point;
    }
    const path = CustomDOMEditor.findPath(editor, slateNode);
    return { path, offset };
};
DOMEditor.toSlatePoint = customToSlatePoint as unknown as <T extends boolean>(
    editor: DOMEditor,
    domPoint: DOMPoint,
    options: { exactMatch: boolean; suppressThrow: T; searchDirection?: 'forward' | 'backward' }
) => T extends true ? BasePoint : BasePoint;

const customToSlateRange = <T extends boolean>(
    editor: CustomDOMEditor,
    domRange: DOMRange | DOMStaticRange | DOMSelection,
    options?: {
        exactMatch?: boolean;
        suppressThrow: T;
    }
): T extends true ? Range | null : Range => {
    const { exactMatch, suppressThrow } = options || {};
    const el = isDOMSelection(domRange) ? domRange.anchorNode : domRange.startContainer;
    let anchorNode;
    let anchorOffset;
    let focusNode;
    let focusOffset;
    let isCollapsed;

    if (el) {
        if (isDOMSelection(domRange)) {
            anchorNode = domRange.anchorNode;
            anchorOffset = domRange.anchorOffset;
            focusNode = domRange.focusNode;
            focusOffset = domRange.focusOffset;
            // COMPAT: There's a bug in chrome that always returns `true` for
            // `isCollapsed` for a Selection that comes from a ShadowRoot.
            // (2020/08/08)
            // https://bugs.chromium.org/p/chromium/issues/detail?id=447523
            if (IS_CHROME && hasShadowRoot(anchorNode)) {
                isCollapsed = domRange.anchorNode === domRange.focusNode && domRange.anchorOffset === domRange.focusOffset;
            } else {
                isCollapsed = domRange.isCollapsed;
            }
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

    const anchor = DOMEditor.toSlatePoint(editor, [anchorNode, anchorOffset], { suppressThrow, exactMatch });
    if (!anchor) {
        return null as T extends true ? Range | null : Range;
    }

    const focus = isCollapsed ? anchor : DOMEditor.toSlatePoint(editor, [focusNode, focusOffset], { suppressThrow, exactMatch });
    if (!focus) {
        return null as T extends true ? Range | null : Range;
    }

    let range: Range = { anchor: anchor as Point, focus: focus as Point };
    // if the selection is a hanging range that ends in a void
    // and the DOM focus is an Element
    // (meaning that the selection ends before the element)
    // unhang the range to avoid mistakenly including the void
    if (
        Range.isExpanded(range) &&
        Range.isForward(range) &&
        isDOMElement(focusNode) &&
        Editor.void(editor as Editor, { at: range.focus, mode: 'highest' })
    ) {
        range = Editor.unhangRange(editor as Editor, range, { voids: true });
    }

    return range;
};
DOMEditor.toSlateRange = customToSlateRange as unknown as <T extends boolean>(
    editor: DOMEditor,
    domRange: Range | StaticRange | Selection,
    options: { exactMatch: boolean; suppressThrow: T }
) => T extends true ? BaseRange : BaseRange;

export const CustomDOMEditor = {
    ...DOMEditor,
    isNodeInEditor(editor: CustomDOMEditor, node: Node): boolean {
        let child = node;

        while (true) {
            const parent = NODE_TO_PARENT.get(child);

            if (parent == null) {
                if (Editor.isEditor(child) && child === editor) {
                    return true;
                } else {
                    break;
                }
            }

            const i = NODE_TO_INDEX.get(child);

            if (i == null) {
                break;
            }

            child = parent;
        }

        return false;
    },
    isLeafInEditor(editor: CustomDOMEditor, leafNode: DOMElement): boolean {
        const textNode = leafNode.closest('[data-slate-node="text"]')!;
        let node: Node | null = null;
        try {
            node = CustomDOMEditor.toSlateNode(editor, textNode);
        } catch (error) {}
        if (node && CustomDOMEditor.isNodeInEditor(editor, node)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * Check if the editor is hanging right.
     */
    isBlockHangingRight(editor: Editor): boolean {
        const { selection } = editor;
        if (!selection) {
            return false;
        }
        if (Range.isCollapsed(selection)) {
            return false;
        }
        const [start, end] = Range.edges(selection);
        const endBlock = Editor.above(editor, {
            at: end,
            match: node => Element.isElement(node) && Editor.isBlock(editor, node)
        });
        return Editor.isStart(editor, end, endBlock[1]);
    },
    isBlockCardLeftCursor(editor: Editor) {
        return (
            editor.selection?.anchor?.offset === FAKE_LEFT_BLOCK_CARD_OFFSET &&
            editor.selection?.focus?.offset === FAKE_LEFT_BLOCK_CARD_OFFSET
        );
    },
    isBlockCardRightCursor(editor: Editor) {
        return (
            editor.selection?.anchor?.offset === FAKE_RIGHT_BLOCK_CARD_OFFSET &&
            editor.selection?.focus?.offset === FAKE_RIGHT_BLOCK_CARD_OFFSET
        );
    },
    getCardCursorNode(
        editor: AngularEditor,
        blockCardNode: Node,
        options: {
            direction: 'left' | 'right' | 'center';
        }
    ) {
        const blockCardElement = DOMEditor.toDOMNode(editor, blockCardNode);
        const cardCenter = blockCardElement.parentElement;
        return options.direction === 'left' ? cardCenter.previousElementSibling.firstChild : cardCenter.nextElementSibling.firstChild;
    },
    toSlateCardEntry(editor: AngularEditor, node: DOMNode): NodeEntry {
        const element = node.parentElement.closest('.slate-block-card')?.querySelector('[card-target="card-center"]').firstElementChild;
        const slateNode = DOMEditor.toSlateNode(editor, element);
        const path = DOMEditor.findPath(editor, slateNode);
        return [slateNode, path];
    }
};
