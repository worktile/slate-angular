export interface BeforeContextChange<T> {
    beforeContextChange: (value: T) => void;
}

export interface AfterContextChange<T> {
    afterContextChange: () => void;
}

export function hasBeforeContextChange<T>(value): value is BeforeContextChange<T> {
    if (value.beforeContextChange) {
        return true;
    }
    return false;
}

export function hasAfterContextChange<T>(value): value is AfterContextChange<T> {
    if (value.afterContextChange) {
        return true;
    }
    return false;
}
