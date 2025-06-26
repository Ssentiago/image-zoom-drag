import { locales, currentLocale } from '../init-locale';
import { LocaleString, LocaleWrapper } from './types/definitions';

function processFormat(path: string[], params: Record<string, string>) {
    const val = path.reduce((acc: any, k) => acc?.[k], currentLocale);
    if (typeof val === 'string') {
        return val.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] || '');
    }
    return val;
}

function processObject(fullPath: string[]) {
    return localeProxy([...fullPath]);
}

function processString(val: string) {
    return Object.assign(val, {
        $format: (params: Record<string, string>) =>
            val.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] || ''),
        toString: () => val,
        valueOf: () => val,
    }) as LocaleString;
}

function processFallback(fullPath: string[], fallbackVal: any) {
    if (typeof fallbackVal === 'object' && !Array.isArray(fallbackVal)) {
        return processObject(fullPath);
    }
    if (typeof fallbackVal === 'string') {
        return processString(fallbackVal);
    }
    return fallbackVal;
}

function processNonExistingPath(fullPath: string[]) {
    const fallbackVal = fullPath.reduce((acc: any, k) => acc?.[k], locales.en);

    if (fallbackVal !== undefined && fallbackVal !== null) {
        return processFallback(fullPath, fallbackVal);
    }

    if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing locale key: ${fullPath.join('.')}`);
    }
    return `[missing: ${fullPath.join('.')}]`;
}

export function localeProxy<T extends object>(
    path: string[] = []
): LocaleWrapper<T> {
    return new Proxy({} as any, {
        get(_, key: string) {
            if (!currentLocale) {
                throw new Error('Locale not initialized');
            }

            const fullPath = [...path, key as string];

            if (key === '$format') {
                return processFormat.bind(null, fullPath);
            }

            const val = fullPath.reduce(
                (acc: any, k) => acc?.[k],
                currentLocale
            );

            if (
                val === undefined ||
                val === null ||
                val === '' ||
                (Array.isArray(val) && val.length === 0)
            ) {
                return processNonExistingPath(fullPath);
            }

            if (typeof val === 'object' && !Array.isArray(val)) {
                return processObject(fullPath);
            }

            if (typeof val === 'string') {
                return processString(val);
            }
            return val;
        },
    });
}
