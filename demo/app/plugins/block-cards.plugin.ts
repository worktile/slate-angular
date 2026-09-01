import { Editor, Path, Transforms, Location } from 'slate';
import { AngularEditor, hasBlockCard, isCardLeft } from 'slate-angular';
import { HistoryEditor } from 'slate-history';

export const withBlockCard = <T extends Editor>(editor: T) => {
    const e = editor as T & AngularEditor;
    const { insertBreak, deleteBackward, deleteForward, insertText } = e;

    e.insertBreak = () => {
        const domSelection = window.getSelection();
        const anchorNode = domSelection?.anchorNode;
        if (domSelection && domSelection.isCollapsed && hasBlockCard(domSelection) && anchorNode) {
            const isLeftCursor = isCardLeft(anchorNode);
            const cardEntry = AngularEditor.toSlateCardEntry(e, anchorNode);
            const cursorRootPath = cardEntry[1];
            insertParagraph(e, isLeftCursor ? cursorRootPath : Path.next(cursorRootPath));
            if (!isLeftCursor) {
                Transforms.select(e, Path.next(cursorRootPath));
            }
            return;
        }
        insertBreak();
    };

    e.deleteBackward = (unit: 'character' | 'word' | 'line' | 'block') => {
        const domSelection = window.getSelection();
        const anchorNode = domSelection?.anchorNode;
        if (domSelection && domSelection.isCollapsed && hasBlockCard(domSelection) && anchorNode) {
            const isLeftCursor = isCardLeft(anchorNode);
            const cardEntry = AngularEditor.toSlateCardEntry(e, anchorNode);
            const cursorRootPath = cardEntry[1];
            if (isLeftCursor) {
                const previousPath = Path.previous(cursorRootPath);
                HistoryEditor.withoutMerging(e as T & HistoryEditor, () => {
                    Transforms.select(e, Editor.end(e, previousPath));
                });
                return;
            } else {
                insertParagraph(e, cursorRootPath);
                Transforms.select(e, cursorRootPath);
                Transforms.removeNodes(e, {
                    at: Path.next(cursorRootPath)
                });
                return;
            }
        }
        deleteBackward(unit);
    };

    e.deleteForward = (unit: 'character' | 'word' | 'line' | 'block') => {
        const domSelection = window.getSelection();
        const anchorNode = domSelection?.anchorNode;
        if (domSelection && domSelection.isCollapsed && hasBlockCard(domSelection) && anchorNode) {
            const isLeftCursor = isCardLeft(anchorNode);
            const cardEntry = AngularEditor.toSlateCardEntry(e, anchorNode);
            const cursorRootPath = cardEntry[1];
            if (isLeftCursor) {
                insertParagraph(e, cursorRootPath);
                Transforms.select(e, cursorRootPath);
                Transforms.removeNodes(e, {
                    at: Path.next(cursorRootPath)
                });
                return;
            } else {
                const nextPath = Path.next(cursorRootPath);
                HistoryEditor.withoutMerging(e as T & HistoryEditor, () => {
                    Transforms.select(e, Editor.start(e, nextPath));
                });
                return;
            }
        }

        deleteForward(unit);
    };

    e.insertText = (text: string) => {
        const domSelection = window.getSelection();
        const anchorNode = domSelection?.anchorNode;
        if (domSelection && domSelection.isCollapsed && hasBlockCard(domSelection) && anchorNode) {
            const isLeftCursor = isCardLeft(anchorNode);
            const cardEntry = AngularEditor.toSlateCardEntry(e, anchorNode);
            const cursorRootPath = cardEntry[1];
            if (isLeftCursor) {
                insertParagraph(e, cursorRootPath);
                Transforms.select(e, cursorRootPath);
            } else {
                const nextPath = Path.next(cursorRootPath);
                insertParagraph(e, nextPath);
                Transforms.select(e, nextPath);
            }
        }
        insertText(text);
    };

    return e;
};

const insertParagraph = (editor: Editor, at: Location) => {
    Transforms.insertNodes(
        editor,
        {
            type: 'paragraph',
            children: [
                {
                    text: ''
                }
            ]
        },
        { at }
    );
};
