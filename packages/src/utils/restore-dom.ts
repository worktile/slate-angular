import { Editor } from 'slate';
import { EDITOR_TO_ELEMENT } from 'slate-dom';

export function restoreDom(editor: Editor, execute: () => void) {
    const editable = EDITOR_TO_ELEMENT.get(editor);
    let observer = new MutationObserver(mutations => {
        mutations.reverse().forEach(mutation => {
            if (mutation.type === 'characterData') {
                // We don't want to restore the DOM for characterData mutations
                // because this interrupts the composition.
                return;
            }

            mutation.removedNodes.forEach(node => {
                mutation.target.insertBefore(node, mutation.nextSibling);
            });

            mutation.addedNodes.forEach(node => {
                mutation.target.removeChild(node);
            });
        });
        disconnect();
        execute();
    });
    const disconnect = () => {
        observer.disconnect();
        observer = null;
    };
    observer.observe(editable, { subtree: true, childList: true, characterData: true, characterDataOldValue: true });
    setTimeout(() => {
        if (observer) {
            disconnect();
            execute();
        }
    }, 0);
}
