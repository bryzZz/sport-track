import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"],
            ["^node:"],
            ["^@?\\w"],
            ["^(lib|routes)(/|$)"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
]);
