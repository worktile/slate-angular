import { AngularEditor, BaseElementFlavour } from 'slate-angular';
import { Element } from 'slate';

export abstract class BaseFlavour<T extends Element = Element, K extends AngularEditor = AngularEditor> extends BaseElementFlavour<T, K> {
    abstract createNativeElement(): HTMLElement;

    render() {
        this.nativeElement = this.createNativeElement();
    }

    rerender() {
        // No-op
    }
}
