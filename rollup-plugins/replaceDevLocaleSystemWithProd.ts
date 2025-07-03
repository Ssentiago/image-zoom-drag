import { readFileSync } from 'fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { join } from 'path';
import * as ts from 'typescript';

const KEYS_MAPPING = new Map<string, string>();
const KEYS_SCOPE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
const keyUsageCount = new Map<string, number>();

function generateMinifiedKey(index: number): string {
    const base = KEYS_SCOPE.length;
    let result = '';
    let i = index;

    while (true) {
        result = KEYS_SCOPE[i % base] + result;
        i = Math.floor(i / base);
        if (i === 0) break;
        i--;
    }

    return result;
}
function createMinifyKeysMapping(options: { enLocalePath: string }) {
    KEYS_MAPPING.clear();

    const enLocalePathResolved = path.resolve(
        process.cwd(),
        options.enLocalePath
    );

    if (!existsSync(enLocalePathResolved)) {
        throw new Error(
            `Expected to be en locale json file at path: ${enLocalePathResolved}`
        );
    }

    const enLocaleKeys = Object.keys(
        JSON.parse(readFileSync(enLocalePathResolved, { encoding: 'utf-8' }))
    ).sort();

    // We generate unique keys: a, b, c, ..., z, aa, ab, ac, ..., zz, aaa, ...
    for (let i = 0; i < enLocaleKeys.length; i++) {
        const key = enLocaleKeys[i];
        const minified = generateMinifiedKey(i);
        KEYS_MAPPING.set(key, minified);
    }

    const originalLongest = Math.max(...enLocaleKeys.map((k) => k.length));
    const minifiedLongest = Math.max(
        ...Array.from(KEYS_MAPPING.values()).map((v) => v.length)
    );
    const avgOriginal = (
        enLocaleKeys.reduce((sum, k) => sum + k.length, 0) / enLocaleKeys.length
    ).toFixed(1);
    const avgMinified = (
        Array.from(KEYS_MAPPING.values()).reduce(
            (sum, v) => sum + v.length,
            0
        ) / KEYS_MAPPING.size
    ).toFixed(1);

    console.log(
        `Original keys: longest ${originalLongest}, avg ${avgOriginal}`
    );
    console.log(
        `Minified keys: longest ${minifiedLongest}, avg ${avgMinified}`
    );
    console.log(
        `Size reduction: ${((1 - minifiedLongest / originalLongest) * 100).toFixed(1)}% (longest), ${((1 - Number(avgMinified) / Number(avgOriginal)) * 100).toFixed(1)}% (average)`
    );
}
function singlePassTransformer(context: any) {
    const localesPath = path.resolve(process.cwd(), 'src/lang/locale/');

    return (sourceFile: any) => {
        function visitor(node: ts.Node): ts.Node {
            // Process t.key -> t('minified_key') immediately
            if (ts.isPropertyAccessExpression(node)) {
                const parent = node.parent;
                if (!ts.isPropertyAccessExpression(parent)) {
                    const fullPath = node.getText().replace(/\s+/g, '');
                    if (fullPath.startsWith('t.')) {
                        const path = fullPath.slice(2);
                        const minifiedKey = KEYS_MAPPING.get(path) || path;
                        keyUsageCount.set(
                            path,
                            (keyUsageCount.get(path) || 0) + 1
                        );
                        return ts.factory.createCallExpression(
                            ts.factory.createIdentifier('t'),
                            undefined,
                            [ts.factory.createStringLiteral(minifiedKey)]
                        );
                    }
                }
            }

            // Process imports
            if (ts.isImportDeclaration(node)) {
                const moduleSpecifier = node.moduleSpecifier;

                if (ts.isStringLiteral(moduleSpecifier)) {
                    const importPath = moduleSpecifier.text;
                    const matchedData = importPath.match(
                        /locale\/(.+?)\/flat\.json/
                    );

                    if (matchedData?.[1]) {
                        const object = JSON.parse(
                            readFileSync(join(localesPath, importPath), {
                                encoding: 'utf-8',
                            })
                        );

                        const newObject: Record<string, any> = {};
                        for (const key of KEYS_MAPPING.keys()) {
                            const objVal = object[key];
                            newObject[KEYS_MAPPING.get(key)!] = objVal;
                        }

                        const importName = node.importClause?.name?.text;
                        if (importName) {
                            return ts.factory.createVariableStatement(
                                undefined,
                                ts.factory.createVariableDeclarationList(
                                    [
                                        ts.factory.createVariableDeclaration(
                                            importName,
                                            undefined,
                                            undefined,
                                            createObjectFromModifiedObject(
                                                newObject
                                            )
                                        ),
                                    ],
                                    ts.NodeFlags.Const
                                )
                            );
                        }
                    }
                }
            }

            return ts.visitEachChild(node, visitor, context);
        }
        return ts.visitNode(sourceFile, visitor);
    };
}

function createObjectFromModifiedObject(obj: Record<string, any>) {
    const properties = Object.entries(obj).map(([key, value]) =>
        ts.factory.createPropertyAssignment(
            ts.factory.createStringLiteral(key),
            Array.isArray(value)
                ? ts.factory.createArrayLiteralExpression(
                      value.map((v) =>
                          ts.factory.createStringLiteral(String(v))
                      )
                  )
                : ts.factory.createStringLiteral(String(value))
        )
    );

    return ts.factory.createObjectLiteralExpression(properties, true);
}

export default function replaceDevLocaleSystemWithProd(options: {
    enLocalePath: string;
    verbose?: boolean;
}) {
    createMinifyKeysMapping(options);

    return {
        name: 'repaceDevLocaleSystemWithProd',

        transform(code: string, id: string) {
            if (!id.match(/(ts|tsx)$/)) return;

            if (process.env.NODE_ENV !== 'production') {
                return;
            }

            const sourceFile = ts.createSourceFile(
                id,
                code,
                ts.ScriptTarget.Latest,
                true
            );

            const result = ts.transform(sourceFile, [singlePassTransformer]);
            const transformedCode = ts
                .createPrinter()
                .printFile(result.transformed[0]);

            return { code: transformedCode, map: null };
        },
        buildEnd() {
            if (process.env.NODE_ENV !== 'production' || !options.verbose) {
                return;
            }

            console.log('=== replaceDevLocaleSystemWithProd ===');
            console.log('\n--- Key Usage Stats ---');
            const usageCounts = Array.from(keyUsageCount.entries()).sort(
                (a, b) => b[1] - a[1]
            );

            const enLocaleKeys = Object.keys(
                JSON.parse(
                    readFileSync(
                        path.resolve(process.cwd(), options.enLocalePath),
                        { encoding: 'utf-8' }
                    )
                )
            ).sort();

            const totalUsages = usageCounts.reduce(
                (sum, [_, count]) => sum + count,
                0
            );

            if (usageCounts.length > 0) {
                console.log(`Total key usages: ${totalUsages}`);
                console.log(
                    `Most used: "${usageCounts[0][0]}" (${usageCounts[0][1]} times)`
                );
                console.log(
                    `Least used: "${usageCounts[usageCounts.length - 1][0]}" (${usageCounts[usageCounts.length - 1][1]} times)`
                );
                console.log(
                    `Average usages per key: ${(totalUsages / keyUsageCount.size).toFixed(1)}`
                );
            }

            const unused = enLocaleKeys.filter(
                (key) => !keyUsageCount.has(key)
            );
            if (unused.length > 0) {
                console.log(
                    `\n⚠️  Found ${unused.length} unused translation keys:`
                );
                unused.forEach((key) => console.log(`   - ${key}`));
                console.log(
                    `💡 Consider removing these keys to reduce bundle size further`
                );
            }

            if (usageCounts.length > 0) {
                const originalTotalChars = usageCounts.reduce(
                    (sum, [key, count]) => sum + key.length * count,
                    0
                );
                const minifiedTotalChars = usageCounts.reduce(
                    (sum, [key, count]) => {
                        const minKey = KEYS_MAPPING.get(key) || key;
                        return sum + minKey.length * count;
                    },
                    0
                );

                console.log(
                    `Total chars in code: ${originalTotalChars} → ${minifiedTotalChars} (${((1 - minifiedTotalChars / originalTotalChars) * 100).toFixed(1)}% reduction)`
                );
            }
        },
    };
}
