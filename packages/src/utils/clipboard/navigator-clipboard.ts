import { Element } from 'slate';
import { getClipboardFromHTMLText } from './clipboard';
import { blobAsString, isClipboardFile, isClipboardReadSupported, isClipboardWriteSupported, stripHtml } from './common';
import { ClipboardData } from '../../types/clipboard';

export const setNavigatorClipboard = async (htmlText: string, data: Element[], text: string = '') => {
    let textClipboard = text;
    if (isClipboardWriteSupported()) {
        await navigator.clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([htmlText], {
                    type: 'text/html'
                }),
                'text/plain': new Blob([textClipboard ?? JSON.stringify(data)], { type: 'text/plain' })
            })
        ]);
    }
};

export const getNavigatorClipboard = async () => {
    if (!isClipboardReadSupported()) {
        return null;
    }
    const clipboardItems = await navigator.clipboard.read();
    let clipboardData: ClipboardData = {};

    if (Array.isArray(clipboardItems) && clipboardItems[0] instanceof ClipboardItem) {
        for (const item of clipboardItems) {
            if (isClipboardFile(item)) {
                const clipboardFiles = item.types.filter(type => type.match(/^image\//));
                const fileBlobs = await Promise.all(clipboardFiles.map(type => item.getType(type)!));
                const urls = (fileBlobs.filter(Boolean) as (File | Blob)[]).map(blob => URL.createObjectURL(blob));
                const files = await Promise.all(
                    urls.map(async url => {
                        const blob = await (await fetch(url)).blob();
                        return new File([blob], 'file', { type: blob.type });
                    })
                );
                clipboardData = {
                    ...clipboardData,
                    files
                };
            }
            if (item.types.includes('text/html')) {
                const htmlContent = await blobAsString(await item.getType('text/html'));
                const htmlClipboardData = getClipboardFromHTMLText(htmlContent);
                if (htmlClipboardData) {
                    clipboardData = { ...clipboardData, ...htmlClipboardData };
                    return clipboardData;
                }
                if (htmlContent && htmlContent.trim()) {
                    clipboardData = { ...clipboardData, html: htmlContent };
                }
            }
            if (item.types.includes('text/plain')) {
                const textContent = await blobAsString(await item.getType('text/plain'));
                clipboardData = {
                    ...clipboardData,
                    text: stripHtml(textContent)
                };
            }
        }
    }
    return clipboardData;
};
