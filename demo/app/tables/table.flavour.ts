import { BaseFlavour } from '../flavours/base.flavour';

export class TableFlavour extends BaseFlavour {
    createNativeElement(): HTMLElement {
        if (this.element.type === 'table') {
            return document.createElement('table');
        }
        if (this.element.type === 'table-row') {
            return document.createElement('tr');
        }
        if (this.element.type === 'table-cell') {
            return document.createElement('td');
        }
    }
}
