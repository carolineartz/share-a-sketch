// basic .eslintrc.js compatible with react prettier and typescript
module.exports = {
  // Specifies the ESLint parser for TypeScript
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended", // start with the default recommended rules
    "plugin:react/recommended", // uses react-specific linting rules
    "plugin:@typescript-eslint/recommended", // uses typescript-specific lintinng rules
    "plugin:prettier/recommended", // enables eslint-plugin-prettier and eslint-config-prettier
    "prettier/@typescript-eslint", // disables typescript-specific linting rules that conflict with prettier
    "prettier/react" // disables react-specific linting rules that conflict with prettier
  ],
  plugins: [
    "react",
    "@typescript-eslint",
    "prettier"
  ],
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 2018,
    // Allows for the use of imports
    sourceType: "module",
  },
  rules: {
    // Disable prop-types as we use TypeScript for type checking
    "react/prop-types": "off",
    // Allow implicit void for now...
    "@typescript-eslint/explicit-function-return-type": "off",
    // Enable prettier rules
    "prettier/prettier": 1,
    // allow @ts-ignore for testing purposes
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-namespace":"off",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",
  },
};