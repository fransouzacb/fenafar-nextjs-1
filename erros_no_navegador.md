19:42:25.044 Running build in Washington, D.C., USA (East) – iad1
19:42:25.044 Build machine configuration: 2 cores, 8 GB
19:42:25.081 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 692a8c1)
19:42:25.403 Cloning completed: 321.000ms
19:42:25.475 Found .vercelignore
19:42:25.503 Removed 49 ignored files defined in .vercelignore
19:42:25.504   /check-data.mjs
19:42:25.505   /cookies.txt
19:42:25.506   /dev-scripts/add-cpf-cargo-fields.ts
19:42:25.506   /dev-scripts/apply-correct-schema.ts
19:42:25.507   /dev-scripts/check-brevo-account.ts
19:42:25.508   /dev-scripts/check-data.ts
19:42:25.508   /dev-scripts/clean-duplicate-tables.ts
19:42:25.509   /dev-scripts/create-email-templates-table.ts
19:42:25.509   /dev-scripts/create-simple-data.ts
19:42:25.516   /dev-scripts/create-tables-direct.ts
19:42:26.240 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:42:26.847 Running "vercel build"
19:42:27.247 Vercel CLI 48.0.2
19:42:27.583 Installing dependencies...
19:42:29.404 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:42:29.408 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:42:29.429 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:42:29.453 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:42:29.456 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:42:29.493 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:42:29.960 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:42:30.541 
19:42:30.542 added 44 packages, and changed 1 package in 3s
19:42:30.542 
19:42:30.542 166 packages are looking for funding
19:42:30.543   run `npm fund` for details
19:42:30.572 Detected Next.js version: 15.5.3
19:42:30.577 Running "npm run build"
19:42:30.685 
19:42:30.686 > fenafar-nextjs@0.1.0 build
19:42:30.686 > next build --turbopack
19:42:30.686 
19:42:31.774    ▲ Next.js 15.5.3 (Turbopack)
19:42:31.775 
19:42:31.868    Creating an optimized production build ...
19:42:32.589  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:42:32.590  ⚠ See instructions if you need to configure Turbopack:
19:42:32.590   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:42:32.590 
19:42:48.460  ✓ Finished writing to disk in 48ms
19:42:48.517  ✓ Compiled successfully in 15.9s
19:42:48.523    Linting and checking validity of types ...
19:42:57.017 Failed to compile.
19:42:57.018 
19:42:57.018 ./src/app/api/convites/[id]/route.ts:206:9
19:42:57.018 Type error: Object literal may only specify known properties, and 'maxMembers' does not exist in type 'ConviteSelect<DefaultArgs>'.
19:42:57.018 
19:42:57.018 [0m [90m 204 |[39m         role[33m:[39m [36mtrue[39m[33m,[39m
19:42:57.018  [90m 205 |[39m         expiresAt[33m:[39m [36mtrue[39m[33m,[39m
19:42:57.018 [31m[1m>[22m[39m[90m 206 |[39m         maxMembers[33m:[39m [36mtrue[39m[33m,[39m
19:42:57.018  [90m     |[39m         [31m[1m^[22m[39m
19:42:57.018  [90m 207 |[39m         sindicato[33m:[39m {
19:42:57.018  [90m 208 |[39m           select[33m:[39m {
19:42:57.018  [90m 209 |[39m             id[33m:[39m [36mtrue[39m[33m,[39m[0m
19:42:57.043 Next.js build worker exited with code: 1 and signal: null
19:42:57.064 Error: Command "npm run build" exited with 1