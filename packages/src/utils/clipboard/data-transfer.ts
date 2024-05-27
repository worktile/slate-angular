import { getClipboardFromHTMLText } from './clipboard';
import { ClipboardData } from '../../types/clipboard';

export const setDataTransferClipboard = (dataTransfer: Pick<DataTransfer, 'getData' | 'setData'> | null, htmlText: string) => {
    dataTransfer?.setData(`text/html`, htmlText);
};

export const setDataTransferClipboardText = (data: Pick<DataTransfer, 'getData' | 'setData'> | null, text: string) => {
    data?.setData(`text/plain`, text);
};

export const getDataTransferClipboard = (data: Pick<DataTransfer, 'getData' | 'setData'> | null): ClipboardData => {
    const html = data?.getData(`text/html`);
    if (html) {
        const htmlClipboardData = getClipboardFromHTMLText(html);
        if (htmlClipboardData) {
            return htmlClipboardData;
        }
        const textData = getDataTransferClipboardText(data);
        if (textData) {
            return {
                html,
                ...textData
            };
        } else {
            return { html };
        }
    } else {
        const textData = getDataTransferClipboardText(data);
        return textData;
    }
};

export const getDataTransferClipboardText = (data: Pick<DataTransfer, 'getData' | 'setData'> | null): ClipboardData => {
    if (!data) {
        return null;
    }
    const text = data?.getData(`text/plain`);
    if (text) {
        const htmlClipboardData = getClipboardFromHTMLText(text);
        if (htmlClipboardData) {
            return htmlClipboardData;
        }
    }
    return { text };
};
