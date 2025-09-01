import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.browser,
                ...globals.node,
                process: true,
            },
        },
        rules: {
            camelcase: ['error', { properties: 'always' }], // Enforce camelCase for variables & properties
            'id-length': ['error', { min: 3 }], // Ensure variable names are at least 3 characters long
            'no-underscore-dangle': ['error'], // Disallow underscore prefix or suffix in variable names
            'prefer-const': 'error', // Enforce 'const' over 'let' if the variable is not reassigned
            'consistent-return': 'error', // Ensure every function has a return statement
            'prettier/prettier': 'error', // Enforce Prettier formatting
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
        },
    },
    pluginJs.configs.recommended,
    prettierConfig, // Disables ESLint rules that conflict with Prettier
    {
        plugins: { prettier: prettierPlugin },
        rules: {
            'prettier/prettier': 'error',
        },
    },
];
