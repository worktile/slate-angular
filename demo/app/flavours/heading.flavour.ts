import { BaseFlavour } from './base.flavour';

export class H1Flavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('h1');
        return element;
    }
}

export class H2Flavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('h2');
        return element;
    }
}

export class H3Flavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('h3');
        return element;
    }
}

export class H4Flavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('h4');
        return element;
    }
}

export class H5Flavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('h5');
        return element;
    }
}

export class H6Flavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        const element = document.createElement('h6');
        return element;
    }
}