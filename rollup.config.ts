import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import path from 'node:path';
import analyze from 'rollup-plugin-analyzer';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import esbuild from 'rollup-plugin-esbuild';
import watch from 'rollup-plugin-watch';

import addLoggerContext from './rollup-plugins/addLoggerContext';
import { buildSass } from './rollup-plugins/buildSass';
import replaceDevLocaleSystemWithProd from './rollup-plugins/replaceDevLocaleSystemWithProd.js';

const baseConfig = {
    input: 'src/main.ts',
    external: ['obsidian', 'electron'],
    plugins: [
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
        }),
        replaceDevLocaleSystemWithProd({
            enLocalePath: 'src/lang/locale/en/flat.json',
            verbose: true,
        }),
        addLoggerContext(),
        json(),
        buildSass(),
        alias({
            entries: [
                {
                    find: 'react',
                    replacement: 'preact/compat',
                },
                {
                    find: 'react-dom/test-utils',
                    replacement: 'preact/test-utils',
                },
                {
                    find: 'react-dom',
                    replacement: 'preact/compat',
                },
                {
                    find: 'react/jsx-runtime',
                    replacement: 'preact/jsx-runtime',
                },
                { find: '@', replacement: path.resolve(process.cwd(), 'src') },
            ],
        }),
        nodeResolve({
            preferBuiltins: true,
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            browser: true,
        }),
        commonjs({
            include: 'node_modules/**',
        }),
        esbuild({
            include: /\.[jt]sx?$/,
            exclude: [],
            target: 'es2023',
            jsx: 'automatic',
            jsxImportSource: 'preact',
            minify: process.env.NODE_ENV === 'production',
            minifyIdentifiers: process.env.NODE_ENV === 'production',
            minifyWhitespace: process.env.NODE_ENV === 'production',
            minifySyntax: process.env.NODE_ENV === 'production',
            keepNames: process.env.NODE_ENV === 'development',
            treeShaking: true,
            sourceMap: process.env.NODE_ENV === 'development',
            banner: '/* Autogenerated by esbuild. Source code available in the plugin’s repository: https://github.com/Ssentiago/image-zoom-drag */',
            footer: '/* End of bundle */',
        }),
        babel({
            babelHelpers: 'bundled',
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            include: ['src/**/*'],
        }),
        del({
            targets: ['styles.css'],
            hook: 'writeBundle',
        }),
        // analyze({ summaryOnly: true }),
    ],
};

const developmentConfig = {
    ...baseConfig,
    output: {
        dir: 'test-vault/.obsidian/plugins/image-zoom-drag',
        sourcemap: false,
        format: 'cjs',
        exports: 'auto',
        inlineDynamicImports: true,
    },
    plugins: [
        ...baseConfig.plugins,
        copy({
            targets: [
                {
                    src: './styles.css',
                    dest: 'test-vault/.obsidian/plugins/image-zoom-drag/',
                },
                {
                    src: './manifest.json',
                    dest: 'test-vault/.obsidian/plugins/image-zoom-drag/',
                },
                {
                    src: './.hotreload',
                    dest: 'test-vault/.obsidian/plugins/image-zoom-drag/',
                },
            ],
        }),
        watch({
            dir: '.',
            include: ['styles.scss'],
        }),
    ],
};

const productionConfig = {
    ...baseConfig,
    output: {
        dir: 'dist',
        sourcemap: false,
        sourcemapExcludeSources: true,
        format: 'cjs',
        exports: 'auto',
        inlineDynamicImports: true,
    },
    plugins: [
        ...baseConfig.plugins,
        copy({
            targets: [
                { src: './styles.css', dest: 'dist/' },
                { src: './manifest.json', dest: 'dist/' },
            ],
        }),
    ],
};

const config =
    process.env.NODE_ENV === 'development'
        ? developmentConfig
        : productionConfig;
export default config;
