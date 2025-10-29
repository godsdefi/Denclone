const tsParserModule = await import("@typescript-eslint/parser");
const tsPluginModule = await import("@typescript-eslint/eslint-plugin");

const tsParser = tsParserModule.default ?? tsParserModule;
const tsPlugin = tsPluginModule.default ?? tsPluginModule;

export default [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    // Test and tooling files should not use the type-aware parser (avoids needing a separate tsconfig)
    files: ["tests/**", "e2e/**", "vitest.config.ts", "playwright.config.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        // intentionally do not set `project` here to avoid parser project lookup errors
      },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["tests/**", "e2e/**", "vitest.config.ts", "playwright.config.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      // Enable some basic TypeScript rules; we keep this minimal to avoid
      // imposing a large rule-set. Add or tune rules as needed.
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {},
  },
];
