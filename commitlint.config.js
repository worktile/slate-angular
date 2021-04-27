module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 200],
        'scope-empty': [2, 'never'],
        'scope-enum': [
            2,
            'always',
            [
                'demo',
                'core',
                'release',
                'plugin',
                'config',
                'template',
                'browser',
                'docs'
            ]
        ]
    }
};
