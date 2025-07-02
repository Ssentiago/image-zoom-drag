import { LocaleSchema } from '@/lang/types/interfaces';

function tf(text: string, params: Record<string, string>) {
    return text.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? `{{${k}}}`);
}

let t: LocaleSchema;

async function initT() {
    t =
        process.env.NODE_ENV === 'development'
            ? ((await import('./t/dev/dev')).t as LocaleSchema)
            : ((await import('./t/prod')).t as unknown as LocaleSchema);
}

initT();

export { t, tf };
