// eslint.config.js (ESLint 9+, flat config)
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },

    rules: {
      // Error prevention
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off", // Allow console.log
      "no-debugger": "error",

      // Best practices
      curly: ["error", "all"], // Require braces
      "no-var": "error", // Use let/const
      "prefer-const": "error",

      // Style
      indent: ["error", 2],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "comma-dangle": ["error", "never"]
    }
  },

  {
    // Test files
    files: ["**/*.test.js"],
    rules: {
      "no-unused-expressions": "off"
    }
  }
];