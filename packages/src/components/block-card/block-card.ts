import { getZeroTextNode } from '../../utils/dom';

export const SLATE_BLOCK_CARD_CLASS_NAME = 'slate-block-card';

export class SlateBlockCard {
    centerRootNodes: HTMLElement[];

    nativeElement: HTMLElement;

    centerContainer: HTMLElement;

    onInit() {
        const nativeElement = document.createElement('div');
        nativeElement.classList.add(SLATE_BLOCK_CARD_CLASS_NAME);
        this.nativeElement = nativeElement;
        this.createContent();
    }

    createContent() {
        const leftCaret = document.createElement('span');
        leftCaret.setAttribute(`card-target`, 'card-left');
        leftCaret.classList.add('card-left');
        leftCaret.appendChild(getZeroTextNode());
        const rightCaret = document.createElement('span');
        rightCaret.setAttribute(`card-target`, 'card-right');
        rightCaret.classList.add('card-right');
        rightCaret.appendChild(getZeroTextNode());
        const center = document.createElement('div');
        center.setAttribute(`card-target`, 'card-center');
        this.nativeElement.appendChild(leftCaret);
        this.nativeElement.appendChild(center);
        this.nativeElement.appendChild(rightCaret);
        this.centerContainer = center;
    }

    append() {
        this.centerRootNodes.forEach(rootNode => !this.centerContainer.contains(rootNode) && this.centerContainer.appendChild(rootNode));
    }

    initializeCenter(rootNodes: HTMLElement[]) {
        this.centerRootNodes = rootNodes;
        this.append();
    }

    onDestroy() {
        this.nativeElement.remove();
    }
}

export const getBlockCardByNativeElement = (nativeElement: HTMLElement) => {
    const blockCardElement = nativeElement?.parentElement?.parentElement;
    if (blockCardElement && blockCardElement.classList.contains(SLATE_BLOCK_CARD_CLASS_NAME)) {
        return blockCardElement;
    }
    return null;
};
