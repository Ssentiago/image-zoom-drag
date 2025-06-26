import { moment } from 'obsidian';

import en from './locale/en';
import { PartialLocale } from './types/definitions';
import { LocaleSchema } from './types/interfaces';

export const locales: Record<string, LocaleSchema> = {
    en,
};

export function initLocale(): LocaleSchema | PartialLocale {
    const localeKey = moment.locale() as keyof typeof locales;
    const lang = localeKey in locales ? localeKey : 'en';

    return locales[lang];
}

export const currentLocale: LocaleSchema | PartialLocale = initLocale();
