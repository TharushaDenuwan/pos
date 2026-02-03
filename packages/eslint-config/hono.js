import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import securityPlugin from "eslint-plugin-security";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for Node.js/Bun API projects.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nodeConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  securityPlugin.configs.recommended,
  {
    rules: {
      "prefer-template": "error",
      "no-console": "off",
      "no-restricted-syntax": ["off", "ForOfStatement"]
    },
    ignores: ["dist/**", "build/**"]
  }
];
