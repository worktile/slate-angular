import { Editor } from 'slate';
import { EDITOR_TO_ELEMENT, IS_RESTORING } from './weak-maps';

export function restoreDom(editor: Editor, execute: () => void) {
    console.log(`start restore`);
    IS_RESTORING.set(editor, true);
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
                console.log('removed: ', node, node.nextSibling);
            });

            mutation.addedNodes.forEach(node => {
                mutation.target.removeChild(node);
                console.log('added: ', node);
            });
        });
        disconnect();
        execute();
        console.log('restore dom executed');
    });
    observer.observe(editable, { subtree: true, childList: true, characterData: true, characterDataOldValue: true });
    const disconnect = () => {
        observer.disconnect();
        observer = null;
        IS_RESTORING.delete(editor);
        console.log(`end restore`);
    };
    setTimeout(() => {
        if (observer) {
            disconnect();
            execute();
        }
    }, 0);
}
