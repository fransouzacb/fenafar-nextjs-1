19:49:03.092 Running build in Washington, D.C., USA (East) – iad1
19:49:03.092 Build machine configuration: 2 cores, 8 GB
19:49:03.107 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 207f09c)
19:49:03.440 Cloning completed: 333.000ms
19:49:03.729 Found .vercelignore
19:49:03.755 Removed 49 ignored files defined in .vercelignore
19:49:03.757   /check-data.mjs
19:49:03.757   /cookies.txt
19:49:03.758   /dev-scripts/add-cpf-cargo-fields.ts
19:49:03.758   /dev-scripts/apply-correct-schema.ts
19:49:03.758   /dev-scripts/check-brevo-account.ts
19:49:03.758   /dev-scripts/check-data.ts
19:49:03.759   /dev-scripts/clean-duplicate-tables.ts
19:49:03.759   /dev-scripts/create-email-templates-table.ts
19:49:03.759   /dev-scripts/create-simple-data.ts
19:49:03.759   /dev-scripts/create-tables-direct.ts
19:49:04.263 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:49:04.845 Running "vercel build"
19:49:06.379 Vercel CLI 48.0.2
19:49:06.691 Installing dependencies...
19:49:08.183 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:49:08.196 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:49:08.209 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:49:08.243 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:49:08.245 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:49:08.268 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:49:08.738 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:49:09.258 
19:49:09.258 added 44 packages, and changed 1 package in 2s
19:49:09.259 
19:49:09.259 166 packages are looking for funding
19:49:09.259   run `npm fund` for details
19:49:09.290 Detected Next.js version: 15.5.3
19:49:09.295 Running "npm run build"
19:49:09.405 
19:49:09.405 > fenafar-nextjs@0.1.0 build
19:49:09.405 > next build --turbopack
19:49:09.405 
19:49:10.491    ▲ Next.js 15.5.3 (Turbopack)
19:49:10.492 
19:49:10.585    Creating an optimized production build ...
19:49:11.283  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:49:11.283  ⚠ See instructions if you need to configure Turbopack:
19:49:11.283   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:49:11.283 
19:49:27.927  ✓ Finished writing to disk in 45ms
19:49:27.979  ✓ Compiled successfully in 16.7s
19:49:27.986    Linting and checking validity of types ...
19:49:36.671 Failed to compile.
19:49:36.672 
19:49:36.672 ./src/app/api/convites/aceitar/[token]/route.ts:187:13
19:49:36.673 Type error: Object literal may only specify known properties, and 'maxMembers' does not exist in type '(Without<SindicatoCreateInput, SindicatoUncheckedCreateInput> & SindicatoUncheckedCreateInput) | (Without<...> & SindicatoCreateInput)'.
19:49:36.673 
19:49:36.673 [0m [90m 185 |[39m             state[33m:[39m sindicatoData[33m.[39mestado [33m||[39m [36mnull[39m[33m,[39m
19:49:36.673  [90m 186 |[39m             zipCode[33m:[39m sindicatoData[33m.[39mcep [33m||[39m [36mnull[39m[33m,[39m
19:49:36.673 [31m[1m>[22m[39m[90m 187 |[39m             maxMembers[33m:[39m convite[33m.[39mmaxMembers [33m||[39m [35m100[39m[33m,[39m
19:49:36.674  [90m     |[39m             [31m[1m^[22m[39m
19:49:36.674  [90m 188 |[39m             active[33m:[39m [36mtrue[39m[33m,[39m
19:49:36.674  [90m 189 |[39m             adminId[33m:[39m newUser[33m.[39mid
19:49:36.674  [90m 190 |[39m           }[0m
19:49:36.698 Next.js build worker exited with code: 1 and signal: null
19:49:36.720 Error: Command "npm run build" exited with 1