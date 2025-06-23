import { EventPath } from './types/interfaces';

export function createEventsWrapper(obj: any, path: string[] = []) {
    return new Proxy(obj, {
        get(target: any, key: string) {
            if (key === '$path') {
                return `settings.${path.join('.')}`;
            }

            const basePath =
                path.length > 0 ? `settings.${path.join('.')}` : 'settings';

            if (key === '$all' || key === '$deep') {
                return `${basePath}.**`;
            }

            if (key === '$children') {
                return createEventsWrapper(obj, [...path, key]);
            }

            const value = target[key];

            if (typeof value !== 'object' || value === null) {
                const pathStr = `settings.${[...path, key].join('.')}`;
                return {
                    $path: pathStr,
                    $all: `${pathStr}.**`,
                    $deep: `${pathStr}.**`,
                    $children: `${pathStr}.*`,
                    toString: () => pathStr,
                    valueOf: () => pathStr,
                } as EventPath;
            }

            return createEventsWrapper(value, [...path, key]);
        },
    });
}
