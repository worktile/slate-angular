import { BaseElementFlavour } from "../view/base";
import { AngularEditor } from "../plugins/angular-editor";
import { Element } from "slate";

export class DefaultElementFlavour<T extends Element = Element, K extends AngularEditor = AngularEditor> extends BaseElementFlavour<T, K> {
    render() {
        const nativeElement = document.createElement('div');
        this.nativeElement = nativeElement;
    }

    rerender() {
        // No-op
    }
}