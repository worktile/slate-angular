import { BaseFlavour } from './base.flavour';

export class BlockquoteFlavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('blockquote');
        return element;
    }
}