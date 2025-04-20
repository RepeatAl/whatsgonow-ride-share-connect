import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { parser as tsParser } from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";


export default js.defineConfig({
  ignores: ["dist"],
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
          ecmaFeatures: {
            jsx: true,
          },
        },
        globals: {
          ...globals.browser,
          React: "readonly",
        },
      },
      plugins: {
        react,
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
        "@typescript-eslint": tsPlugin,
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        ...js.configs.recommended.rules,
        ...tsPlugin.configs.recommended.rules,
        ...react.configs.recommended.rules,
        ...reactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "no-console": ["warn", { allow: ["warn", "error", "info"] }],
        "prefer-const": "warn",
        "no-duplicate-imports": "error",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-uses-react": "off",
        "react/jsx-uses-vars": "error",
      },
    },
  ],
});
