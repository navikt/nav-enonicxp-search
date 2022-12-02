const unresolvedImports = ['^/lib/xp', '^/lib/cache', '^/assets'];

module.exports = {
    extends: ['prettier', 'eslint:recommended', 'plugin:import/recommended'],
    plugins: ['prettier', 'import'],
    rules: {
        'prettier/prettier': ['off'],
        'comma-dangle': ['error', 'only-multiline'],
        'no-cond-assign': ['error', 'except-parens'],
        'no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'none',
            },
        ],
        'no-console': 'error',
        'import/no-unresolved': [
            'error',
            {
                ignore: unresolvedImports,
            },
        ],
        'import/no-absolute-path': [
            'error',
            {
                ignore: unresolvedImports,
            },
        ],
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
        'no-underscore-dangle': 'off',
        'object-shorthand': 'off',
        'prefer-destructuring': 'off',
        radix: ['error', 'as-needed'],
        'no-plusplus': 'off',
        'func-names': 'off',
        'no-empty': 'off',
        'arrow-body-style': 'off',
        'no-param-reassign': 'off',
        'no-unsafe-optional-chaining': 'off',
    },
    globals: {
        require: true,
        log: true,
        exports: true,
        resolve: true,
        app: true,
        fetch: true,
        document: true,
        window: true,
        __: true,
    },
    overrides: [
        {
            files: ['*.html', '*.ftl', '*.xml'],
            rules: {
                'max-len': 'off',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.es6'],
            },
        },
    },
};
