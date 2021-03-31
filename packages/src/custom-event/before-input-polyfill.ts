
export const BEFORE_INPUT_EVENTS: {name: string, handler: string, isTriggerBeforeInput: boolean}[] = [
    // { name: 'blur', handler: 'onBlur', isTriggerBeforeInput: true },
    // { name: 'compositionstart', handler: 'onCompositionStart', isTriggerBeforeInput: true },
    { name: 'compositionupdate', handler: null, isTriggerBeforeInput: true },
    // { name: 'compositionend', handler: 'onCompositionEnd', isTriggerBeforeInput: false },
    // { name: 'keydown', handler: 'onKeyDown', isTriggerBeforeInput: true },
    { name: 'keypress', handler: null, isTriggerBeforeInput: true },
    { name: 'keyup', handler: 'onKeyUp', isTriggerBeforeInput: true },
    { name: 'mousedown', handler: 'onMouseDown', isTriggerBeforeInput: true },
    { name: 'textInput', handler: null, isTriggerBeforeInput: true },
    // { name: 'paste', handler: 'onPaste', isTriggerBeforeInput: true }
];
