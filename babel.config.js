const config = {
    presets: ['@babel/preset-typescript'],
    plugins: [
        [
            'babel-plugin-styled-components',
            {
                minify: process.env.NODE_ENV === 'production',
                transpileTemplateLiterals: true,
            },
        ],
    ],
};

export default config;
