export function deepMerge(target: any, source: any): any {
    if (!source || typeof source !== 'object') return target;

    const result = { ...target };

    for (const key in source) {
        if (
            source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key])
        ) {
            result[key] = deepMerge(result[key] ?? {}, source[key]);
        } else if (source[key] !== undefined) {
            result[key] = source[key];
        }
    }

    return result;
}
