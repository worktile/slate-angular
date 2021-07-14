import { Descendant } from "slate";

export enum SlateErrorCode {
    ToNativeSelectionError = 2100,
    ToSlateSelectionError = 2101,
    OnDOMBeforeInputError = 2102,
    OnSyntheticBeforeInputError = 2103,
    OnDOMKeydownError = 2104,
    GetStartPointError = 2105,
    NotFoundPreviousRootNodeError = 3100,
    InvalidValueError = 4100,
}

export interface SlateError {
    code?: SlateErrorCode | number;
    name?: string;
    nativeError?: Error;
    data?: Descendant[];
}
