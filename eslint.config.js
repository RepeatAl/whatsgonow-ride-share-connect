import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default js.FlatESLintConfig.create({
  // files to ignore
  ignores: ["dist", "node_modules"],

  // base configs to extend
  extends: [
    js.configs.recommended,
    tsPlugin.configs.recommended,
    react.configs.recommended,
    reactHooks.configs.recommended,
  ],

  // only lint TS/TSX and JS/JSX files
  files: ["**/*.{js,jsx,ts,tsx}"],

  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
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
    react: { version: "detect" },
  },

  rules: {
    // React hooks rules
    ...reactHooks.configs.recommended.rules,

    // React Refresh
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // TypeScript unused vars
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],

    // React rules
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",

    // General code style
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "prefer-const": "warn",
    "no-duplicate-imports": "error",
  },
});
