import { BaseTextFlavour } from '../../view/base';

export class DefaultTextFlavour extends BaseTextFlavour {
    render() {
        const nativeElement = document.createElement('span');
        this.nativeElement = nativeElement;
        this.nativeElement.setAttribute('data-slate-node', 'text');
        const leaf = document.createElement('span');
        this.nativeElement.appendChild(leaf);
        leaf.setAttribute('data-slate-leaf', 'true');
        const stringNode = document.createElement('span');
        leaf.appendChild(stringNode);
        stringNode.textContent = this.text.text;
        stringNode.setAttribute('data-slate-string', 'true');
    }

    rerender() {
        const stringNode = this.nativeElement.querySelector('[data-slate-string="true"]')!;
        stringNode.textContent = this.text.text;
    }
}
