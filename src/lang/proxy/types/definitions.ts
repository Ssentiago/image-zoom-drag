import { LocaleNode } from './interfaces';

export type LocaleString = string & {
    $format: (params: Record<string, string>) => string;
};
export type LocaleWrapper<T> = {
    [K in keyof T]: T[K] extends object ? LocaleWrapper<T[K]> : LocaleString;
} & LocaleNode;
