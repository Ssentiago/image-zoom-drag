import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const config: Linter.Config[] = [
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['eslint.config.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin as any,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            import: importPlugin,
        },
        rules: {
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/ban-ts-comment': 'off', // Disables unused variables, ignoring arguments starting with _
            '@typescript-eslint/consistent-type-assertions': 'warn', // Allows comments like @ts-ignore
            '@typescript-eslint/consistent-type-definitions': [
                'error',
                'interface',
            ], // Allows prototype methods to be used directly,
            '@typescript-eslint/explicit-function-return-type': 'warn', // Requires explicit indication of the function return type
            '@typescript-eslint/no-explicit-any': 'warn', // Disables the use of namespaces
            '@typescript-eslint/no-floating-promises': 'error', // Disables the use of require for imports
            '@typescript-eslint/no-inferrable-types': 'warn', // Ensures consistent use of casting
            '@typescript-eslint/no-namespace': 'error', // Warns about unused expressions
            '@typescript-eslint/no-non-null-assertion': 'warn', // Requires the use of interfaces instead of types
            '@typescript-eslint/no-unnecessary-condition': 'warn', // Warns about using type any
            // '@typescript-eslint/no-misused-promises': 'error', // Prohibits the misuse of promises
            '@typescript-eslint/no-unnecessary-type-assertion': 'error', // Warns about using the !
            '@typescript-eslint/no-unused-expressions': 'warn', // Prefers to use optional chaining,
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ], // Warns about conditions that are always true or false
            '@typescript-eslint/no-var-requires': 'error', // Prefers to use the ?? operator
            '@typescript-eslint/prefer-includes': 'warn', // Requires promise processing
            '@typescript-eslint/prefer-nullish-coalescing': 'warn', // Ensures that await is only used with Promises
            '@typescript-eslint/prefer-optional-chain': 'warn', // Readonly for unchanged properties
            '@typescript-eslint/prefer-readonly': 'warn', // Checking the completeness Switch
            '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            'array-callback-return': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            'consistent-return': 'error', // Requires return value from array callback functions
            'default-param-last': 'error', // Prevents duplicate imports
            'dot-notation': 'error', // Prevents unnecessary use of await in return
            eqeqeq: ['error', 'always'], // Prevents unnecessary concatenation of strings
            'import/no-unused-modules': 'warn', //Requires a radix for the parseInt function, // Disables the use of var
            'no-async-promise-executor': 'error', // Prevents throwing literals as exceptions
            'no-await-in-loop': 'warn', //Disables asynchronous promise executors
            'no-console': 'warn', //Warns about await in loops
            'no-constant-binary-expression': 'error', // Disables constant binary expressions
            'no-duplicate-imports': 'error', // Prevents the use of variables before they are declared
            'no-else-return': 'error',
            'no-empty-function': 'warn', // Requires default settings to be latest
            'no-extra-bind': 'error', // Requires the use of dot notation whenever possible
            'no-loop-func': 'error', //Disables else after return
            'no-magic-numbers': ['warn', { ignore: [0, 1, -1] }], // Warns about empty functions
            'no-prototype-builtins': 'off', // Prevents the creation of functions inside loops
            'no-return-await': 'error', // Prohibits unnecessary returns
            'no-sequences': 'error', // Prefers arrow functions for callbacks
            'no-throw-literal': 'error', // Prefers rest parameters instead of arguments
            'no-unneeded-ternary': 'error', // Prefers spread operator instead of .apply()
            'no-use-before-define': [
                'error',
                { functions: false, classes: true },
            ], // Warns about using console.log
            'no-useless-concat': 'error', // TypeScript заменяет PropTypes
            'no-useless-return': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-arrow-callback': 'warn',
            'prefer-const': 'error',
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'warn',
            radix: 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-hooks/rules-of-hooks': 'error',
            'react/jsx-pascal-case': 'error',
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/no-unused-state': 'warn',
            'react/prop-types': 'off',
            yoda: 'error',
        },
    },
];

export default config;
