19:57:59.321 Running build in Washington, D.C., USA (East) – iad1
19:57:59.322 Build machine configuration: 2 cores, 8 GB
19:57:59.359 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: bcc0ea8)
19:57:59.869 Cloning completed: 509.000ms
19:58:00.030 Found .vercelignore
19:58:00.069 Removed 49 ignored files defined in .vercelignore
19:58:00.069   /check-data.mjs
19:58:00.069   /cookies.txt
19:58:00.069   /dev-scripts/add-cpf-cargo-fields.ts
19:58:00.069   /dev-scripts/apply-correct-schema.ts
19:58:00.069   /dev-scripts/check-brevo-account.ts
19:58:00.069   /dev-scripts/check-data.ts
19:58:00.070   /dev-scripts/clean-duplicate-tables.ts
19:58:00.070   /dev-scripts/create-email-templates-table.ts
19:58:00.070   /dev-scripts/create-simple-data.ts
19:58:00.070   /dev-scripts/create-tables-direct.ts
19:58:00.737 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:58:01.331 Running "vercel build"
19:58:01.820 Vercel CLI 48.0.2
19:58:02.142 Installing dependencies...
19:58:03.897 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:58:03.911 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:58:03.915 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:58:03.924 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:58:03.948 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:58:03.961 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:58:04.463 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:58:05.004 
19:58:05.005 added 44 packages, and changed 1 package in 3s
19:58:05.005 
19:58:05.005 166 packages are looking for funding
19:58:05.005   run `npm fund` for details
19:58:05.037 Detected Next.js version: 15.5.3
19:58:05.042 Running "npm run build"
19:58:05.151 
19:58:05.151 > fenafar-nextjs@0.1.0 build
19:58:05.152 > next build --turbopack
19:58:05.152 
19:58:06.250    ▲ Next.js 15.5.3 (Turbopack)
19:58:06.250 
19:58:06.350    Creating an optimized production build ...
19:58:07.072  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:58:07.072  ⚠ See instructions if you need to configure Turbopack:
19:58:07.072   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:58:07.073 
19:58:23.597  ✓ Finished writing to disk in 48ms
19:58:23.644  ✓ Compiled successfully in 16.6s
19:58:23.652    Linting and checking validity of types ...
19:58:32.154 Failed to compile.
19:58:32.155 
19:58:32.155 ./src/app/api/convites/route.ts:98:9
19:58:32.156 Type error: Object literal may only specify known properties, and 'token' does not exist in type '(Without<ConviteCreateInput, ConviteUncheckedCreateInput> & ConviteUncheckedCreateInput) | (Without<...> & ConviteCreateInput)'.
19:58:32.156 
19:58:32.156 [0m [90m  96 |[39m         sindicatoId[33m:[39m data[33m.[39msindicatoId [33m||[39m [36mnull[39m[33m,[39m
19:58:32.156  [90m  97 |[39m         [90m// maxMembers: data.maxMembers || null, // Campo não existe no schema do Vercel[39m
19:58:32.156 [31m[1m>[22m[39m[90m  98 |[39m         token[33m,[39m
19:58:32.156  [90m     |[39m         [31m[1m^[22m[39m
19:58:32.156  [90m  99 |[39m         expiresAt[33m,[39m
19:58:32.157  [90m 100 |[39m         criadoPorId[33m:[39m user[33m.[39mid[33m,[39m
19:58:32.157  [90m 101 |[39m         [90m// usado: false // Campo não existe no schema do Vercel[39m[0m
19:58:32.181 Next.js build worker exited with code: 1 and signal: null
19:58:32.202 Error: Command "npm run build" exited with 1