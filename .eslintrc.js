const path = require("path");

const prettierConfig = require("./package.json").prettier;

module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true,
        browser: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:unicorn/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: [path.resolve(__dirname, "./tsconfig.json")],
    },
    plugins: ["prettier", "sort-keys-fix", "@typescript-eslint"],
    root: true,
    rules: {
        "arrow-body-style": ["error", "as-needed"],
        "constructor-super": "error",
        curly: "error",
        eqeqeq: "error",
        "linebreak-style": ["error", "unix"],
        "new-cap": "error",
        "no-class-assign": "error",
        "no-console": 0,
        "no-const-assign": "error",
        "no-delete-var": "error",
        "no-dupe-class-members": "error",
        "no-label-var": "error",
        "no-negated-condition": "error",
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-this-before-super": "error",
        "no-undef-init": "error",
        "no-useless-constructor": "error",
        "no-var": "error",
        "prefer-const": "error",
        "prefer-template": "error",
        "prettier/prettier": ["error", prettierConfig],
        "require-atomic-updates": 0,
        "require-await": "error",
        "require-yield": "error",
        "sort-keys-fix/sort-keys-fix": ["error"],
        "spaced-comment": ["error", "always", { markers: ["/"] }],
        strict: ["error", "global"],
        yoda: "error",
        quotes: ["error", "double", { avoidEscape: true }],
        "unicorn/prevent-abbreviations": "off",
        "@typescript-eslint/array-type": ["error", { default: "generic" }],
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-use-before-define": ["error", { classes: false, functions: false }],
        "unicorn/prefer-spread": 0,
        "unicorn/no-null": 0,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    globals: {
        React: true,
    },
    overrides: [
        {
            files: ["**/*.tsx"],
            rules: {
                "react/prop-types": "off",
            },
        },
    ],
};
