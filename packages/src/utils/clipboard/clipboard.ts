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
import { SlateFragmentAttributeKey, getSlateFragmentAttribute } from '../dom';

export const buildHTMLText = (contentContainer: HTMLElement, attach: HTMLElement, data: Element[]) => {
    const stringObj = JSON.stringify(data);
    const encoded = window.btoa(encodeURIComponent(stringObj));
    attach.setAttribute(SlateFragmentAttributeKey, encoded);
    return contentContainer.innerHTML;
};

export const getClipboardFromHTMLText = (html: string): ClipboardData => {
    const fragmentAttribute = getSlateFragmentAttribute(html);
    if (fragmentAttribute) {
        try {
            const decoded = decodeURIComponent(window.atob(fragmentAttribute));
            const result = JSON.parse(decoded);
            if (result && Array.isArray(result) && result.length > 0) {
                return {
                    elements: result
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

/**
 *
 */
export const setClipboardData = async (
    clipboardData: ClipboardData,
    contentContainer: HTMLElement,
    attach: HTMLElement,
    dataTransfer?: Pick<DataTransfer, 'getData' | 'setData'>
) => {
    if (!clipboardData) {
        return;
    }
    const { elements, text } = clipboardData;
    if (isClipboardWriteSupported()) {
        const htmlText = buildHTMLText(contentContainer, attach, elements);
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
