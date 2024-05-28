import { Element } from 'slate';

export const isClipboardReadSupported = () => {
    return 'clipboard' in navigator && 'read' in navigator.clipboard;
};

export const isClipboardWriteSupported = () => {
    return 'clipboard' in navigator && 'write' in navigator.clipboard;
};

export const isClipboardWriteTextSupported = () => {
    return 'clipboard' in navigator && 'writeText' in navigator.clipboard;
};

export const isClipboardFile = (item: ClipboardItem) => {
    return item.types.find(i => i.match(/^image\//));
};

export const stripHtml = (html: string) => {
    // See <https://github.com/developit/preact-markup/blob/4788b8d61b4e24f83688710746ee36e7464f7bbc/src/parse-markup.js#L60-L69>
    const doc = document.implementation.createHTMLDocument('');
    doc.documentElement.innerHTML = html.trim();
    return doc.body.textContent || doc.body.innerText || '';
};

export const blobAsString = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
            const text = reader.result;
            resolve(text as string);
        });
        reader.addEventListener('error', () => {
            reject(reader.error);
        });
        reader.readAsText(blob);
    });
};
