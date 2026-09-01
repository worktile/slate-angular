import { DefaultTextFlavour } from 'slate-angular';

export enum MarkTypes {
    bold = 'bold',
    italic = 'italic',
    underline = 'underlined',
    strike = 'strike',
    code = 'code-line'
}

export class RichTextFlavour extends DefaultTextFlavour {
    attributes: string[] = [];

    render() {
        super.render();
        this.applyRichtext();
    }

    applyRichtext() {
        this.attributes.forEach(attr => {
            this.nativeElement.removeAttribute(attr);
        });
        this.attributes = [];
        const textRecord = this.text as Record<string, unknown>;
        for (const key in textRecord) {
            if (Object.prototype.hasOwnProperty.call(textRecord, key) && key !== 'text' && !!textRecord[key]) {
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
