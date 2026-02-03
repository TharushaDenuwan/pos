import pluginNext from "@next/eslint-plugin-next";
import globals from "globals";

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextConfig = [
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker
      }
    }
  },
  {
    plugins: {
      "@next/next": pluginNext
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules
    }
  }
];
