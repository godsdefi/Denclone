Local development

To run this project locally you can use pnpm (lockfile included):

```bash
pnpm install
pnpm dev      # start Next.js in development mode
pnpm build    # create a production build
pnpm exec tsc --noEmit  # run a TypeScript typecheck
```

Notes:
- Linting is available via `pnpm lint` but the repository may require installing or adjusting ESLint config/plugins to match your environment. If you encounter an "ESLint must be installed" error, run `pnpm add -D eslint` and re-run `pnpm lint`.
- The project uses a large set of dependencies; installing may take a few minutes.
- This repository contains many dependencies pinned to `latest` and some packages that target react 18; if you plan to upgrade or change React/Next major versions, expect peer dependency adjustments.
