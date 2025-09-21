19:52:49.623 Running build in Washington, D.C., USA (East) – iad1
19:52:49.623 Build machine configuration: 2 cores, 8 GB
19:52:49.640 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 38e6f6c)
19:52:50.169 Cloning completed: 529.000ms
19:52:50.415 Found .vercelignore
19:52:50.436 Removed 49 ignored files defined in .vercelignore
19:52:50.437   /check-data.mjs
19:52:50.437   /cookies.txt
19:52:50.438   /dev-scripts/add-cpf-cargo-fields.ts
19:52:50.438   /dev-scripts/apply-correct-schema.ts
19:52:50.438   /dev-scripts/check-brevo-account.ts
19:52:50.438   /dev-scripts/check-data.ts
19:52:50.438   /dev-scripts/clean-duplicate-tables.ts
19:52:50.438   /dev-scripts/create-email-templates-table.ts
19:52:50.438   /dev-scripts/create-simple-data.ts
19:52:50.438   /dev-scripts/create-tables-direct.ts
19:52:50.959 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:52:51.520 Running "vercel build"
19:52:51.943 Vercel CLI 48.0.2
19:52:52.276 Installing dependencies...
19:52:53.811 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:52:53.822 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:52:53.831 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:52:53.855 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:52:53.861 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:52:53.898 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:52:54.374 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:52:54.941 
19:52:54.942 added 44 packages, and changed 1 package in 2s
19:52:54.943 
19:52:54.943 166 packages are looking for funding
19:52:54.943   run `npm fund` for details
19:52:54.973 Detected Next.js version: 15.5.3
19:52:54.978 Running "npm run build"
19:52:55.274 
19:52:55.275 > fenafar-nextjs@0.1.0 build
19:52:55.276 > next build --turbopack
19:52:55.276 
19:52:56.377    ▲ Next.js 15.5.3 (Turbopack)
19:52:56.377 
19:52:56.474    Creating an optimized production build ...
19:52:57.190  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:52:57.192  ⚠ See instructions if you need to configure Turbopack:
19:52:57.192   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:52:57.192 
19:53:14.150  ✓ Finished writing to disk in 39ms
19:53:14.193  ✓ Compiled successfully in 17.0s
19:53:14.199    Linting and checking validity of types ...
19:53:22.707 Failed to compile.
19:53:22.708 
19:53:22.708 ./src/app/api/convites/aceitar/[token]/route.ts:208:17
19:53:22.708 Type error: Object literal may only specify known properties, and 'usado' does not exist in type '(Without<ConviteUpdateInput, ConviteUncheckedUpdateInput> & ConviteUncheckedUpdateInput) | (Without<...> & ConviteUpdateInput)'.
19:53:22.708 
19:53:22.708 [0m [90m 206 |[39m       [36mawait[39m tx[33m.[39mconvite[33m.[39mupdate({
19:53:22.708  [90m 207 |[39m         where[33m:[39m { id[33m:[39m convite[33m.[39mid }[33m,[39m
19:53:22.708 [31m[1m>[22m[39m[90m 208 |[39m         data[33m:[39m { usado[33m:[39m [36mtrue[39m }
19:53:22.708  [90m     |[39m                 [31m[1m^[22m[39m
19:53:22.708  [90m 209 |[39m       })
19:53:22.709  [90m 210 |[39m
19:53:22.709  [90m 211 |[39m       [36mreturn[39m { user[33m:[39m newUser[33m,[39m sindicato[33m:[39m newSindicato }[0m
19:53:22.734 Next.js build worker exited with code: 1 and signal: null
19:53:22.755 Error: Command "npm run build" exited with 1