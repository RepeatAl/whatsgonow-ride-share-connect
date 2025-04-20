import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { parser as tsParser } from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // Apply to all JS/TS files including JSX/TSX
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      js,
      react: pluginReact,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tsPlugin,
    },
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
      tsPlugin.configs.flat.recommended,
    ],
    rules: {
      // React hooks rules
      ...reactHooks.configs.recommended.rules,
      // Ensure only components are exported when using react-refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // TypeScript unused variables warning
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Console usage
      "no-console": ["warn", { allow: ["error", "warn", "info"] }],
      // Prefer const over let
      "prefer-const": "warn",
      // Disallow duplicate imports
      "no-duplicate-imports": "error",
    },
    settings: {
      react: { version: "detect" },
    },
  },
]);
