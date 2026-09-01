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

export function hasBeforeContextChange<T>(value: any): value is BeforeContextChange<T> {
    if (value.beforeContextChange) {
        return true;
    }
    return false;
}

export function hasAfterContextChange<T>(value: any): value is AfterContextChange {
    if (value.afterContextChange) {
        return true;
    }
    return false;
}

export function hasBeforeDomMove(value: any): value is BeforeDomMoveRef {
    if (value.instance?.beforeDomMove) {
        return true;
    }
    return false;
}
