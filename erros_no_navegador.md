19:54:57.972 Running build in Washington, D.C., USA (East) – iad1
19:54:57.973 Build machine configuration: 2 cores, 8 GB
19:54:58.021 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 8c31d76)
19:54:58.576 Cloning completed: 555.000ms
19:54:58.736 Found .vercelignore
19:54:58.763 Removed 49 ignored files defined in .vercelignore
19:54:58.763   /check-data.mjs
19:54:58.763   /cookies.txt
19:54:58.763   /dev-scripts/add-cpf-cargo-fields.ts
19:54:58.763   /dev-scripts/apply-correct-schema.ts
19:54:58.763   /dev-scripts/check-brevo-account.ts
19:54:58.763   /dev-scripts/check-data.ts
19:54:58.763   /dev-scripts/clean-duplicate-tables.ts
19:54:58.763   /dev-scripts/create-email-templates-table.ts
19:54:58.763   /dev-scripts/create-simple-data.ts
19:54:58.764   /dev-scripts/create-tables-direct.ts
19:54:59.236 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:54:59.811 Running "vercel build"
19:55:00.209 Vercel CLI 48.0.2
19:55:00.526 Installing dependencies...
19:55:01.963 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:55:01.966 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:55:01.985 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:55:01.991 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:55:02.024 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:55:02.066 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:55:02.519 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:55:03.029 
19:55:03.030 added 44 packages, and changed 1 package in 2s
19:55:03.031 
19:55:03.031 166 packages are looking for funding
19:55:03.031   run `npm fund` for details
19:55:03.066 Detected Next.js version: 15.5.3
19:55:03.071 Running "npm run build"
19:55:03.181 
19:55:03.182 > fenafar-nextjs@0.1.0 build
19:55:03.182 > next build --turbopack
19:55:03.182 
19:55:04.383    ▲ Next.js 15.5.3 (Turbopack)
19:55:04.384 
19:55:04.478    Creating an optimized production build ...
19:55:05.260  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:55:05.261  ⚠ See instructions if you need to configure Turbopack:
19:55:05.261   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:55:05.261 
19:55:21.677  ✓ Finished writing to disk in 39ms
19:55:21.732  ✓ Compiled successfully in 16.5s
19:55:21.744    Linting and checking validity of types ...
19:55:30.412 Failed to compile.
19:55:30.412 
19:55:30.413 ./src/app/api/convites/route.ts:97:9
19:55:30.413 Type error: Object literal may only specify known properties, and 'maxMembers' does not exist in type '(Without<ConviteCreateInput, ConviteUncheckedCreateInput> & ConviteUncheckedCreateInput) | (Without<...> & ConviteCreateInput)'.
19:55:30.413 
19:55:30.413 [0m [90m  95 |[39m         role[33m:[39m data[33m.[39mrole[33m,[39m
19:55:30.413  [90m  96 |[39m         sindicatoId[33m:[39m data[33m.[39msindicatoId [33m||[39m [36mnull[39m[33m,[39m
19:55:30.413 [31m[1m>[22m[39m[90m  97 |[39m         maxMembers[33m:[39m data[33m.[39mmaxMembers [33m||[39m [36mnull[39m[33m,[39m
19:55:30.413  [90m     |[39m         [31m[1m^[22m[39m
19:55:30.413  [90m  98 |[39m         token[33m,[39m
19:55:30.414  [90m  99 |[39m         expiresAt[33m,[39m
19:55:30.414  [90m 100 |[39m         criadoPorId[33m:[39m user[33m.[39mid[33m,[39m[0m
19:55:30.439 Next.js build worker exited with code: 1 and signal: null
19:55:30.459 Error: Command "npm run build" exited with 1