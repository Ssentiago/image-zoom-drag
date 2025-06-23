import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import fs from 'fs';
import analyze from 'rollup-plugin-analyzer';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import esbuild from 'rollup-plugin-esbuild';
import visualizer from 'rollup-plugin-visualizer';
import watch from 'rollup-plugin-watch';
import * as sass from 'sass';

function buildSass() {
    return {
        name: 'build-sass',
        buildStart() {
            const compileSass = () => {
                try {
                    const result = sass.compile('styles.scss', {
                        style:
                            process.env.NODE_ENV === 'production'
                                ? 'compressed'
                                : 'expanded',
                    });

                    fs.writeFileSync('styles.css', result.css);
                    console.log('SCSS compiled successfully');
                } catch (error) {
                    this.error('SCSS compilation failed: ' + error.message);
                }
            };

            compileSass();
        },
    };
}

const baseConfig = {
    input: 'src/main.ts',
    external: ['obsidian', 'electron'],
    plugins: [
        json(),
        buildSass(),
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'development'
            ),
        }),
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
            ],
        }),
        nodeResolve({
            preferBuiltins: true,
            extensions: ['.js', '.ts'],
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
            sourcemap: process.env.NODE_ENV === 'development',
        }),
        del({
            targets: ['styles.css'],
            hook: 'writeBundle',
        }),
        analyze({ summaryOnly: true }),
    ],
};

const developmentConfig = {
    ...baseConfig,
    output: {
        dir: 'test-vault/.obsidian/plugins/Diagram Zoom Drag',
        sourcemap: false,
        format: 'cjs',
        exports: 'auto',
    },
    plugins: [
        ...baseConfig.plugins,
        copy({
            targets: [
                {
                    src: './styles.css',
                    dest: 'test-vault/.obsidian/plugins/Diagram Zoom Drag/',
                },
                {
                    src: './manifest.json',
                    dest: 'test-vault/.obsidian/plugins/Diagram Zoom Drag/',
                },
                {
                    src: './.hotreload',
                    dest: 'test-vault/.obsidian/plugins/Diagram Zoom Drag/',
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
    },
    plugins: [
        ...baseConfig.plugins,
        copy({
            targets: [
                { src: './styles.css', dest: 'dist/' },
                { src: './manifest.json', dest: 'dist/' },
            ],
        }),
        visualizer({
            filename: 'bundle-analysis.html',
            gzipSize: true,
            brotliSize: true,
            open: false,
        }),
    ],
};

const config =
    process.env.NODE_ENV === 'development'
        ? developmentConfig
        : productionConfig;
export default config;
