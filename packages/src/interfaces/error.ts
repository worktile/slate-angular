export enum SlateErrorCode {
    ToNativeSelectionError = 2100,
    ToSlateSelectionError = 2101,
    OnDOMBeforeInputError = 2102,
    OnSyntheticBeforeInputError = 2103,
    OnDOMKeydownError = 2104
}

export interface SlateError {
    code?: SlateErrorCode | number;
    name?: string;
    nativeError?: Error
}
