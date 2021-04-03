export const IS_IOS =
    typeof navigator !== 'undefined' &&
    typeof window !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

export const IS_APPLE =
    typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent);

export const IS_FIREFOX =
    typeof navigator !== 'undefined' &&
    /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);

export const IS_SAFARI =
    typeof navigator !== 'undefined' &&
    /Version\/[\d\.]+.*Safari/.test(navigator.userAgent);

// "modern" Edge was released at 79.x
export const IS_EDGE_LEGACY =
    typeof navigator !== 'undefined' &&
    /Edge?\/(?:[0-6][0-9]|[0-7][0-8])/i.test(navigator.userAgent);

export const IS_CHROME =
    typeof navigator !== 'undefined' && /Chrome/i.test(navigator.userAgent);

// Native `beforeInput` events don't work well with react on Chrome 75
// and older, Chrome 76+ can use `beforeInput` though.
export const IS_CHROME_LEGACY =
    typeof navigator !== 'undefined' &&
    /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])/i.test(navigator.userAgent);

// Firefox did not support `beforeInput` until `v87`.
export const IS_FIREFOX_LEGACY =
    typeof navigator !== 'undefined' &&
    /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])).*/i.test(
        navigator.userAgent
    );