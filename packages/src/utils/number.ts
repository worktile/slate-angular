export const roundTo = (value: number, precision = 2): number => {
    const factor = 10 ** precision;
    const n = Math.round(value * factor) / factor;
    return Object.is(n, -0) ? 0 : n;
};