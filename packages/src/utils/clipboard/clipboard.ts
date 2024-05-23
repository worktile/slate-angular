import { Element } from 'slate';
import {
    getDataTransferClipboard,
    getDataTransferClipboardText,
    setDataTransferClipboard,
    setDataTransferClipboardText
} from './data-transfer';
import { getNavigatorClipboard, setNavigatorClipboard } from './navigator-clipboard';
import { isClipboardReadSupported, isClipboardWriteSupported, isClipboardWriteTextSupported } from './common';
import { ClipboardData } from '../../types/clipboard';

const DATA_KEY = 'data-slate-fragment';

export const buildHTMLText = (contentContainer: HTMLElement, attach: HTMLElement, data: Element[]) => {
    const stringObj = JSON.stringify(data);
    const encoded = window.btoa(encodeURIComponent(stringObj));
    attach.setAttribute(DATA_KEY, encoded);
    return contentContainer.innerHTML;
};

export const getClipboardFromHTMLText = (html: string): ClipboardData => {
    const regex = `/${DATA_KEY}="([^"]*)"/`;
    const match = html.match(regex);
    if (match) {
        try {
            const result = JSON.parse(match[1]);
            if (result) {
                return {
                    elements: result?.elements ?? []
                };
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    return null;
};

export const createClipboardData = (html: string, elements: Element[], text: string, files: File[]): ClipboardData => {
    const data = { elements, text, html, files };
    return data;
};

export const getClipboardData = async (dataTransfer?: DataTransfer): Promise<ClipboardData> => {
    let clipboardData = null;
    if (dataTransfer) {
        if (dataTransfer.files.length) {
            return { files: Array.from(dataTransfer.files) };
        }

        clipboardData = getDataTransferClipboard(dataTransfer);
        if (!clipboardData || (clipboardData && Object.keys(clipboardData).length === 0)) {
            clipboardData = getDataTransferClipboardText(dataTransfer);
        }
        return clipboardData;
    }
    if (isClipboardReadSupported()) {
        return await getNavigatorClipboard();
    }
    return clipboardData;
};

export const setClipboardData = async (
    contentContainer: HTMLElement,
    attach: HTMLElement,
    clipboardData: ClipboardData,
    dataTransfer?: Pick<DataTransfer, 'getData' | 'setData'>
) => {
    if (!clipboardData) {
        return;
    }
    const { elements, text } = clipboardData;

    if (isClipboardWriteSupported()) {
        const htmlText = buildHTMLText(contentContainer, attach, elements);
        console.log(htmlText, 'htmlText');
        return await setNavigatorClipboard(htmlText, elements, text);
    }

    if (dataTransfer) {
        const htmlText = buildHTMLText(contentContainer, attach, elements);
        setDataTransferClipboard(dataTransfer, htmlText);
        setDataTransferClipboardText(dataTransfer, text);
        return;
    }

    // Compatible with situations where navigator.clipboard.write is not supported and dataTransfer is empty
    // Such as contextmenu copy in Firefox.
    if (isClipboardWriteTextSupported()) {
        const htmlText = buildHTMLText(contentContainer, attach, elements);
        return await navigator.clipboard.writeText(htmlText);
    }
};