import { MentionElement } from "../../../custom-types";
import { BaseFlavour } from "../flavours/base.flavour";

export class MentionFlavour extends BaseFlavour<MentionElement> {
    createNativeElement(): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('demo-mention-view');
        element.textContent = `@${this.context.element.character}`;
        return element;
    }

    rerender(): void {
        super.rerender();
        if (this.context.selection) {
            this.nativeElement.classList.add('focus')
        } else {
            this.nativeElement.classList.remove('focus')
        }
    }
}