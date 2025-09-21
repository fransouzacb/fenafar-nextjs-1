19:38:10.320 Running build in Washington, D.C., USA (East) – iad1
19:38:10.321 Build machine configuration: 2 cores, 8 GB
19:38:10.338 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 59241ed)
19:38:10.644 Cloning completed: 304.000ms
19:38:10.723 Found .vercelignore
19:38:10.741 Removed 49 ignored files defined in .vercelignore
19:38:10.743   /check-data.mjs
19:38:10.743   /cookies.txt
19:38:10.744   /dev-scripts/add-cpf-cargo-fields.ts
19:38:10.744   /dev-scripts/apply-correct-schema.ts
19:38:10.744   /dev-scripts/check-brevo-account.ts
19:38:10.744   /dev-scripts/check-data.ts
19:38:10.745   /dev-scripts/clean-duplicate-tables.ts
19:38:10.745   /dev-scripts/create-email-templates-table.ts
19:38:10.746   /dev-scripts/create-simple-data.ts
19:38:10.746   /dev-scripts/create-tables-direct.ts
19:38:11.604 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:38:12.212 Running "vercel build"
19:38:12.593 Vercel CLI 48.0.2
19:38:12.966 Installing dependencies...
19:38:14.496 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:38:14.509 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:38:14.526 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:38:14.534 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:38:14.554 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:38:14.587 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:38:15.033 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:38:15.593 
19:38:15.594 added 44 packages, and changed 1 package in 2s
19:38:15.595 
19:38:15.595 166 packages are looking for funding
19:38:15.595   run `npm fund` for details
19:38:15.626 Detected Next.js version: 15.5.3
19:38:15.631 Running "npm run build"
19:38:15.746 
19:38:15.746 > fenafar-nextjs@0.1.0 build
19:38:15.746 > next build --turbopack
19:38:15.746 
19:38:17.488    ▲ Next.js 15.5.3 (Turbopack)
19:38:17.489 
19:38:17.587    Creating an optimized production build ...
19:38:18.327  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:38:18.327  ⚠ See instructions if you need to configure Turbopack:
19:38:18.328   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:38:18.328 
19:38:34.551  ✓ Finished writing to disk in 42ms
19:38:34.594  ✓ Compiled successfully in 16.3s
19:38:34.599    Linting and checking validity of types ...
19:38:43.143 Failed to compile.
19:38:43.143 
19:38:43.143 ./src/app/api/convites/[id]/route.ts:206:9
19:38:43.143 Type error: Object literal may only specify known properties, and 'usado' does not exist in type 'ConviteSelect<DefaultArgs>'.
19:38:43.143 
19:38:43.143 [0m [90m 204 |[39m         role[33m:[39m [36mtrue[39m[33m,[39m
19:38:43.143  [90m 205 |[39m         expiresAt[33m:[39m [36mtrue[39m[33m,[39m
19:38:43.143 [31m[1m>[22m[39m[90m 206 |[39m         usado[33m:[39m [36mtrue[39m[33m,[39m
19:38:43.143  [90m     |[39m         [31m[1m^[22m[39m
19:38:43.144  [90m 207 |[39m         maxMembers[33m:[39m [36mtrue[39m[33m,[39m
19:38:43.144  [90m 208 |[39m         sindicato[33m:[39m {
19:38:43.144  [90m 209 |[39m           select[33m:[39m {[0m
19:38:43.168 Next.js build worker exited with code: 1 and signal: null
19:38:43.189 Error: Command "npm run build" exited with 1