export enum SlaErrorCode {
    FIND_PATH_ERROR = 2000,
    FIND_DOM_NODE_ERROR = 2001,
    FIND_DOM_POINT_ERROR = 2002,
    FIND_SLATE_NODE_ERROR = 2003,
    FIND_SLATE_RANGE_ERROR = 2004,
    FIND_SLATE_POINT_ERROR = 2005,
    ToNativeSelectionError = 2100,
    ToSlateSelectionError = 2101,
    OnDOMBeforeInputError = 2102,
    OnSyntheticBeforeInputError = 2103,
    OnDOMKeydownError = 2104
}

export enum SlaErrorDataType {
    NODE = 'Node',
    POINT = 'Point',
    DOM_ELEMENT= 'DOMElement',
    DOM_POINT = 'DOMPoint',
    DOM_RANGE = 'DOMRange | DOMStaticRange | DOMSelection',
    EVENT = 'any'
}


