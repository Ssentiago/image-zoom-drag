import { localeProxy } from './proxy/locale-proxy';
import { LocaleSchema } from './types/interfaces';

export const t = localeProxy<LocaleSchema>();
