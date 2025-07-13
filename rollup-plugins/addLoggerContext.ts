import path from 'node:path';
import ts, { TransformationContext } from 'typescript';

function findFunctionName(currentNode: ts.Node, source: ts.SourceFile): string {
    let parent = currentNode.parent;

    while (parent) {
        if (
            ts.isFunctionDeclaration(parent) ||
            ts.isMethodDeclaration(parent)
        ) {
            // For FunctionDeclation or MethodDeclaration, we get a name
            return parent.name?.getText(source) ?? 'anonymous';
        } else if (
            ts.isFunctionExpression(parent) ||
            ts.isArrowFunction(parent)
        ) {
            // For Functionexpression or Arrowfunction, a name may not be
            return 'anonymous';
        } else if (
            ts.isVariableDeclaration(parent) &&
            parent.name &&
            ts.isIdentifier(parent.name)
        ) {
            // If the function is assigned to the variable
            return parent.name.getText(source);
        }
        parent = parent.parent;
    }
    return 'global'; // If we have not found a function, we believe that this is a global context
}

const createNewLoggerExpression = (
    node: ts.CallExpression,
    source: ts.SourceFile
) => {
    const logText = node.arguments[0];

    if (!logText) {
        return node;
    }

    const originalContext = node.arguments[1];

    const fileName = source.fileName;

    const functionName = findFunctionName(node, source);

    const sourceFile = node.getSourceFile();
    const lineAndChar = sourceFile.getLineAndCharacterOfPosition(
        node.getStart()
    );

    const lineNumber = lineAndChar.line + 1;
    const columnNumber = lineAndChar.character + 1;

    const contextObj = ts.factory.createObjectLiteralExpression([
        ...(originalContext && ts.isObjectLiteralExpression(originalContext)
            ? originalContext.properties
            : []),
        ts.factory.createPropertyAssignment(
            'file',
            ts.factory.createStringLiteral(
                path.relative(process.cwd(), fileName)
            )
        ),
        ts.factory.createPropertyAssignment(
            'lineNumber',
            ts.factory.createNumericLiteral(lineNumber)
        ),
        ts.factory.createPropertyAssignment(
            'columnNumber',
            ts.factory.createNumericLiteral(columnNumber)
        ),
        ts.factory.createPropertyAssignment(
            'functionName',
            ts.factory.createStringLiteral(functionName)
        ),
    ]);

    return ts.factory.createCallExpression(
        node.expression,
        node.typeArguments,
        [logText, contextObj]
    );
};

export default function addLoggerContext() {
    return {
        name: 'add-logger-context',
        transform(code: string, id: string) {
            if (!id.match(/(ts|tsx)$/)) return;

            const source = ts.createSourceFile(
                id,
                code,
                ts.ScriptTarget.Latest,
                true
            );

            const result = ts.transform(source, [
                (context: TransformationContext) => {
                    return (source: ts.SourceFile) => {
                        function visitor(node: ts.Node): ts.Node {
                            if (
                                ts.isCallExpression(node) &&
                                ts.isPropertyAccessExpression(node.expression)
                            ) {
                                const callText = node.getText(source);
                                const hasLogger =
                                    /(?:\w+\.)*logger\.(?:debug|error|warn|info)\(/.test(
                                        callText
                                    );

                                if (hasLogger) {
                                    const expr = node.expression;
                                    if (
                                        ts.isIdentifier(expr.name) &&
                                        [
                                            'debug',
                                            'info',
                                            'warn',
                                            'error',
                                            'trace',
                                        ].includes(expr.name.text)
                                    ) {
                                        return createNewLoggerExpression(
                                            node,
                                            source
                                        );
                                    }
                                }
                            }

                            return ts.visitEachChild(node, visitor, context);
                        }

                        return ts.visitNode(source, visitor) as ts.SourceFile;
                    };
                },
            ]);

            const transformedCode = ts
                .createPrinter()
                .printFile(result.transformed[0]);

            return { code: transformedCode, map: null };
        },
    };
}
