import { Element } from 'slate';
import { AngularEditor, BaseElementFlavour } from 'slate-angular';

export class H1Flavour<T extends Element = Element, K extends AngularEditor = AngularEditor> extends BaseElementFlavour<T, K> {
    render() {
        const nativeElement = document.createElement('h1');
        this.nativeElement = nativeElement;
    }

    rerender() {
        // No-op
    }
}
