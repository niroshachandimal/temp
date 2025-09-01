const commitlint = require('@commitlint/config-conventional');

module.exports = {
    extends: [commitlint],

    rules: {
        // Ensure commit messages start with "GIG-" followed by a number
        'header-pattern': [2, 'always', /^GIG-\d+\s.*/],
        'header-match-team': [2, 'always', 'GIG-<number> <commit-message>'],
        'subject-case': [2, 'always', 'sentence-case'],
    },
};
