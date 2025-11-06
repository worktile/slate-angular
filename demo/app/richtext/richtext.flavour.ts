import { BaseTextFlavour, DefaultTextFlavour } from 'slate-angular';

export class RichTextFlavour extends DefaultTextFlavour {
    attributes = [];

    render() {
        super.render();
        this.applyRichtext();
    }

    applyRichtext() {
        this.attributes.forEach(attr => {
            this.nativeElement.removeAttribute(attr);
        });
        this.attributes = [];
        for (const key in this.text) {
            if (Object.prototype.hasOwnProperty.call(this.text, key) && key !== 'text' && !!this.text[key]) {
                const attr = `slate-${key}`;
                this.nativeElement.setAttribute(attr, 'true');
                this.attributes.push(attr);
            }
        }
    }

    onContextChange() {
        super.onContextChange();
        if (this.initialized) {
            this.applyRichtext();
        }
    }
}
