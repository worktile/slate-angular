import { BaseTextFlavour } from '../../view/base';

export class DefaultTextFlavour extends BaseTextFlavour {
    render() {
        const { nativeElement } = createText(this.text.text);
        this.nativeElement = nativeElement;
    }

    rerender() {}
}

export const createText = (text: string) => {
    const nativeElement = document.createElement('span');
    nativeElement.setAttribute('data-slate-node', 'text');
    return { nativeElement };
};
