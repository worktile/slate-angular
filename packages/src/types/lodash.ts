export type DebouncedFunc<T> = T & { cancel: () => void; flush: () => void };
