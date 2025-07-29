export type LocaleWrapper<T> = {
    [K in keyof T]: T[K] extends object ? LocaleWrapper<T[K]> : T[K];
};
