09:42:18.208 Running build in Washington, D.C., USA (East) – iad1
09:42:18.210 Build machine configuration: 2 cores, 8 GB
09:42:18.241 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 42e0a64)
09:42:18.921 Cloning completed: 680.000ms
09:42:19.419 Found .vercelignore
09:42:19.649 Removed 49 ignored files defined in .vercelignore
09:42:19.650   /check-data.mjs
09:42:19.650   /cookies.txt
09:42:19.650   /dev-scripts/add-cpf-cargo-fields.ts
09:42:19.650   /dev-scripts/apply-correct-schema.ts
09:42:19.651   /dev-scripts/check-brevo-account.ts
09:42:19.651   /dev-scripts/check-data.ts
09:42:19.651   /dev-scripts/clean-duplicate-tables.ts
09:42:19.651   /dev-scripts/create-email-templates-table.ts
09:42:19.652   /dev-scripts/create-simple-data.ts
09:42:19.652   /dev-scripts/create-tables-direct.ts
09:42:20.415 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
09:42:21.179 Running "vercel build"
09:42:21.582 Vercel CLI 48.0.3
09:42:21.923 Installing dependencies...
09:42:23.523 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
09:42:23.537 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
09:42:23.576 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
09:42:23.597 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
09:42:23.628 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
09:42:23.633 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
09:42:24.096 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
09:42:24.621 
09:42:24.622 added 44 packages, and changed 1 package in 2s
09:42:24.622 
09:42:24.623 166 packages are looking for funding
09:42:24.623   run `npm fund` for details
09:42:24.654 Detected Next.js version: 15.5.3
09:42:24.659 Running "npm run build"
09:42:24.904 
09:42:24.904 > fenafar-nextjs@0.1.0 build
09:42:24.905 > next build --turbopack
09:42:24.905 
09:42:26.184    ▲ Next.js 15.5.3 (Turbopack)
09:42:26.185 
09:42:26.284    Creating an optimized production build ...
09:42:27.014  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
09:42:27.014  ⚠ See instructions if you need to configure Turbopack:
09:42:27.014   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
09:42:27.015 
09:42:44.459  ✓ Finished writing to disk in 38ms
09:42:44.529  ✓ Compiled successfully in 17.5s
09:42:44.541    Linting and checking validity of types ...
09:42:53.483 Failed to compile.
09:42:53.484 
09:42:53.484 ./src/app/api/documentos/[id]/route.ts:42:9
09:42:53.484 Type error: Object literal may only specify known properties, and 'user' does not exist in type 'DocumentoInclude<DefaultArgs>'.
09:42:53.484 
09:42:53.484 [0m [90m 40 |[39m           }
09:42:53.484  [90m 41 |[39m         }[33m,[39m
09:42:53.484 [31m[1m>[22m[39m[90m 42 |[39m         user[33m:[39m {
09:42:53.484  [90m    |[39m         [31m[1m^[22m[39m
09:42:53.484  [90m 43 |[39m           select[33m:[39m {
09:42:53.484  [90m 44 |[39m             id[33m:[39m [36mtrue[39m[33m,[39m
09:42:53.485  [90m 45 |[39m             name[33m:[39m [36mtrue[39m[33m,[39m[0m
09:42:53.510 Next.js build worker exited with code: 1 and signal: null
09:42:53.532 Error: Command "npm run build" exited with 1