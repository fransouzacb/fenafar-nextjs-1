20:00:13.924 Running build in Washington, D.C., USA (East) – iad1
20:00:13.925 Build machine configuration: 2 cores, 8 GB
20:00:13.964 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 5857857)
20:00:14.270 Cloning completed: 306.000ms
20:00:14.487 Found .vercelignore
20:00:14.528 Removed 49 ignored files defined in .vercelignore
20:00:14.528   /check-data.mjs
20:00:14.529   /cookies.txt
20:00:14.529   /dev-scripts/add-cpf-cargo-fields.ts
20:00:14.529   /dev-scripts/apply-correct-schema.ts
20:00:14.529   /dev-scripts/check-brevo-account.ts
20:00:14.529   /dev-scripts/check-data.ts
20:00:14.530   /dev-scripts/clean-duplicate-tables.ts
20:00:14.530   /dev-scripts/create-email-templates-table.ts
20:00:14.530   /dev-scripts/create-simple-data.ts
20:00:14.530   /dev-scripts/create-tables-direct.ts
20:00:15.099 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
20:00:15.905 Running "vercel build"
20:00:16.291 Vercel CLI 48.0.2
20:00:17.482 Installing dependencies...
20:00:18.919 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
20:00:18.929 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
20:00:18.943 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
20:00:18.969 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
20:00:18.976 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
20:00:19.010 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
20:00:19.563 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
20:00:20.090 
20:00:20.091 added 44 packages, and changed 1 package in 2s
20:00:20.091 
20:00:20.091 166 packages are looking for funding
20:00:20.091   run `npm fund` for details
20:00:20.122 Detected Next.js version: 15.5.3
20:00:20.127 Running "npm run build"
20:00:20.236 
20:00:20.236 > fenafar-nextjs@0.1.0 build
20:00:20.236 > next build --turbopack
20:00:20.236 
20:00:21.387    ▲ Next.js 15.5.3 (Turbopack)
20:00:21.387 
20:00:21.496    Creating an optimized production build ...
20:00:22.221  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
20:00:22.221  ⚠ See instructions if you need to configure Turbopack:
20:00:22.222   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
20:00:22.222 
20:00:39.050  ✓ Finished writing to disk in 41ms
20:00:39.087  ✓ Compiled successfully in 16.9s
20:00:39.096    Linting and checking validity of types ...
20:00:47.584 Failed to compile.
20:00:47.585 
20:00:47.585 ./src/app/api/documentos/[id]/download/route.ts:38:13
20:00:47.586 Type error: Object literal may only specify known properties, but 'adminId' does not exist in type 'SindicatoSelect<DefaultArgs>'. Did you mean to write 'admin'?
20:00:47.586 
20:00:47.586 [0m [90m 36 |[39m           select[33m:[39m {
20:00:47.586  [90m 37 |[39m             id[33m:[39m [36mtrue[39m[33m,[39m
20:00:47.586 [31m[1m>[22m[39m[90m 38 |[39m             adminId[33m:[39m [36mtrue[39m
20:00:47.587  [90m    |[39m             [31m[1m^[22m[39m
20:00:47.587  [90m 39 |[39m           }
20:00:47.587  [90m 40 |[39m         }
20:00:47.587  [90m 41 |[39m       }[0m
20:00:47.610 Next.js build worker exited with code: 1 and signal: null
20:00:47.632 Error: Command "npm run build" exited with 1