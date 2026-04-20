import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["data", "uploads"]),
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{js,ts}"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
]);
