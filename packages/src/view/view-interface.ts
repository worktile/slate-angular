export interface BeforeContextChange<T> {
    beforeContextChange: (value: T) => void;
}

export interface AfterContextChange {
    afterContextChange: () => void;
}

export type BeforeDomMoveOrigin = 'move' | 'virtual-scroll';

export interface BeforeDomMove {
    beforeDomMove: (origin: BeforeDomMoveOrigin) => void;
}

export interface BeforeDomMoveRef {
    instance: {
        beforeDomMove: (origin: BeforeDomMoveOrigin) => void;
    };
}

export function hasBeforeContextChange<T>(value): value is BeforeContextChange<T> {
    if (value.beforeContextChange) {
        return true;
    }
    return false;
}

export function hasAfterContextChange<T>(value): value is AfterContextChange {
    if (value.afterContextChange) {
        return true;
    }
    return false;
}

export function hasBeforeDomMove(value): value is BeforeDomMoveRef {
    if (value.instance?.beforeDomMove) {
        return true;
    }
    return false;
}
