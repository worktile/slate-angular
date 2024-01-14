export const createThrottleRAF = () => {
    let timerId: number | null = null;
    const throttleRAF = (fn: () => void) => {
        const scheduleFunc = () => {
            timerId = requestAnimationFrame(() => {
                timerId = null;
                fn();
            });
        };
        if (timerId !== null) {
            cancelAnimationFrame(timerId);
            timerId = null;
        }
        scheduleFunc();
    };
    return throttleRAF;
};

export type ThrottleRAF = (fn: () => void) => void;
