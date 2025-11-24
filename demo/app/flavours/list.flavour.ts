import { BaseFlavour } from './base.flavour';

export class ULFlavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('ul');
        return element;
    }
}

export class OLFlavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('ol');
        return element;
    }
}

export class LIFlavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('li');
        return element;
    }
}
