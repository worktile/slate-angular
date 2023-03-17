import { Editor, Path, Transforms, Location } from 'slate';
import { AngularEditor, hasBlockCard, isCardLeft } from 'slate-angular';
import { HistoryEditor } from 'slate-history';

export const withBlockCard = editor => {
    const { insertBreak, deleteBackward, deleteForward, insertText } = editor;

    editor.insertBreak = () => {
        const domSelection = window.getSelection();
        const anchorNode = domSelection.anchorNode;
        if (domSelection && domSelection.isCollapsed && hasBlockCard(domSelection)) {
            const isLeftCursor = isCardLeft(anchorNode);
            const cardEntry = AngularEditor.toSlateCardEntry(editor, anchorNode);
            const cursorRootPath = cardEntry[1];
            insertParagraph(editor, isLeftCursor ? cursorRootPath : Path.next(cursorRootPath));
            if (!isLeftCursor) {
                Transforms.select(editor, Path.next(cursorRootPath));
            }
            return;
        }
        insertBreak();
    };

    editor.deleteBackward = unit => {
        const domSelection = window.getSelection();
        const anchorNode = domSelection.anchorNode;
        if (domSelection && domSelection.isCollapsed && hasBlockCard(domSelection)) {
            const isLeftCursor = isCardLeft(anchorNode);
            const cardEntry = AngularEditor.toSlateCardEntry(editor, anchorNode);
            const cursorRootPath = cardEntry[1];
            if (isLeftCursor) {
                const previousPath = Path.previous(cursorRootPath);
                HistoryEditor.withoutMerging(editor, () => {
                    Transforms.select(editor, Editor.end(editor, previousPath));
                });
                return;
            } else {
                insertParagraph(editor, cursorRootPath);
                Transforms.select(editor, cursorRootPath);
                Transforms.removeNodes(editor, {
                    at: Path.next(cursorRootPath)
                });
                return;
            }
        }
        deleteBackward(unit);
    };

    editor.deleteForward = unit => {
        const domSelection = window.getSelection();
        const anchorNode = domSelection.anchorNode;
        if (domSelection && domSelection.isCollapsed && hasBlockCard(domSelection)) {
            const isLeftCursor = isCardLeft(anchorNode);
            const cardEntry = AngularEditor.toSlateCardEntry(editor, anchorNode);
            const cursorRootPath = cardEntry[1];
            if (isLeftCursor) {
                insertParagraph(editor, cursorRootPath);
                Transforms.select(editor, cursorRootPath);
                Transforms.removeNodes(editor, {
                    at: Path.next(cursorRootPath)
                });
                return;
            } else {
                const nextPath = Path.next(cursorRootPath);
                HistoryEditor.withoutMerging(editor, () => {
                    Transforms.select(editor, Editor.start(editor, nextPath));
                });
                return;
            }
        }

        deleteForward(unit);
    };

    editor.insertText = (text: string) => {
        const domSelection = window.getSelection();
        const anchorNode = domSelection?.anchorNode;
        if (domSelection && domSelection.isCollapsed && hasBlockCard(domSelection)) {
            const isLeftCursor = isCardLeft(anchorNode);
            const cardEntry = AngularEditor.toSlateCardEntry(editor, anchorNode);
            const cursorRootPath = cardEntry[1];
            if (isLeftCursor) {
                insertParagraph(editor, cursorRootPath);
                Transforms.select(editor, cursorRootPath);
            } else {
                const nextPath = Path.next(cursorRootPath);
                insertParagraph(editor, nextPath);
                Transforms.select(editor, nextPath);
            }
        }
        insertText(text);
    };

    return editor;
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
