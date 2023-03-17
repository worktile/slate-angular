import { Editor } from 'slate';
import { EDITOR_TO_ELEMENT } from './weak-maps';

export function restoreDom(editor: Editor, execute: () => void) {
    const editable = EDITOR_TO_ELEMENT.get(editor);
    const observer = new MutationObserver(mutations => {
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
        observer.disconnect();
        console.log('restore dom executed');
        execute();
    });
    observer.observe(editable, { subtree: true, childList: true, characterData: true, characterDataOldValue: true });
    setTimeout(() => {
        observer.disconnect();
    }, 0);
}


