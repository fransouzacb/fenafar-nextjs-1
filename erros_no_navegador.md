19:51:04.715 Running build in Washington, D.C., USA (East) – iad1
19:51:04.716 Build machine configuration: 2 cores, 8 GB
19:51:04.730 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: a20593d)
19:51:05.031 Cloning completed: 300.000ms
19:51:05.222 Found .vercelignore
19:51:05.283 Removed 49 ignored files defined in .vercelignore
19:51:05.283   /check-data.mjs
19:51:05.283   /cookies.txt
19:51:05.283   /dev-scripts/add-cpf-cargo-fields.ts
19:51:05.283   /dev-scripts/apply-correct-schema.ts
19:51:05.283   /dev-scripts/check-brevo-account.ts
19:51:05.284   /dev-scripts/check-data.ts
19:51:05.284   /dev-scripts/clean-duplicate-tables.ts
19:51:05.284   /dev-scripts/create-email-templates-table.ts
19:51:05.284   /dev-scripts/create-simple-data.ts
19:51:05.284   /dev-scripts/create-tables-direct.ts
19:51:05.915 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:51:06.461 Running "vercel build"
19:51:06.831 Vercel CLI 48.0.2
19:51:07.156 Installing dependencies...
19:51:08.567 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:51:08.569 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:51:08.590 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:51:08.626 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:51:08.627 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:51:08.655 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:51:09.071 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:51:09.599 
19:51:09.600 added 44 packages, and changed 1 package in 2s
19:51:09.601 
19:51:09.604 166 packages are looking for funding
19:51:09.604   run `npm fund` for details
19:51:09.633 Detected Next.js version: 15.5.3
19:51:09.637 Running "npm run build"
19:51:09.741 
19:51:09.742 > fenafar-nextjs@0.1.0 build
19:51:09.742 > next build --turbopack
19:51:09.742 
19:51:10.761    ▲ Next.js 15.5.3 (Turbopack)
19:51:10.761 
19:51:10.852    Creating an optimized production build ...
19:51:11.583  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:51:11.584  ⚠ See instructions if you need to configure Turbopack:
19:51:11.584   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:51:11.584 
19:51:26.344  ✓ Finished writing to disk in 39ms
19:51:26.402  ✓ Compiled successfully in 14.8s
19:51:26.411    Linting and checking validity of types ...
19:51:34.704 Failed to compile.
19:51:34.705 
19:51:34.705 ./src/app/api/convites/aceitar/[token]/route.ts:188:13
19:51:34.705 Type error: Object literal may only specify known properties, but 'adminId' does not exist in type '(Without<SindicatoCreateInput, SindicatoUncheckedCreateInput> & SindicatoUncheckedCreateInput) | (Without<...> & SindicatoCreateInput)'. Did you mean to write 'admin'?
19:51:34.705 
19:51:34.705 [0m [90m 186 |[39m             zipCode[33m:[39m sindicatoData[33m.[39mcep [33m||[39m [36mnull[39m[33m,[39m
19:51:34.705  [90m 187 |[39m             active[33m:[39m [36mtrue[39m[33m,[39m
19:51:34.705 [31m[1m>[22m[39m[90m 188 |[39m             adminId[33m:[39m newUser[33m.[39mid
19:51:34.706  [90m     |[39m             [31m[1m^[22m[39m
19:51:34.706  [90m 189 |[39m           }
19:51:34.706  [90m 190 |[39m         })
19:51:34.706  [90m 191 |[39m[0m
19:51:34.731 Next.js build worker exited with code: 1 and signal: null
19:51:34.752 Error: Command "npm run build" exited with 1