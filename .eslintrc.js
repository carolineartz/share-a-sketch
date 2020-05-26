module.exports = {
  "extends": ["sarpik"],
  "rules": {
    "no-console": "off",
    "no-unused-vars": "off",
    "indent": ["error", 2],
    "semi": ["error", "never"],
    "react/jsx-props-no-spreading": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true,
      "allowConciseArrowFunctionExpressionsStartingWithVoid": true,
    }],
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": false,
        "printWidth": 120,
        "semi": false
      }
    ],
  },
  "settings": {
    "import/ignore": ["component", "\\@", ".ts", ".tsx"]
  }
}