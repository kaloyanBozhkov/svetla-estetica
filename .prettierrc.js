module.exports = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    arrowParens: 'always',
    printWidth: 100,
    overrides: [
        {
            files: ['*.scss', '*.*.scss', '*.css', '*.*.css'],
            options: {
                printWidth: 120,
                singleQuote: false,
                trailingComma: 'es5',
            },
        },
    ],
}
