09:47:34.613 Running build in Washington, D.C., USA (East) – iad1
09:47:34.615 Build machine configuration: 2 cores, 8 GB
09:47:34.689 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 33ad3a8)
09:47:36.378 Cloning completed: 1.688s
09:47:36.548 Found .vercelignore
09:47:36.573 Removed 49 ignored files defined in .vercelignore
09:47:36.578   /check-data.mjs
09:47:36.578   /cookies.txt
09:47:36.578   /dev-scripts/add-cpf-cargo-fields.ts
09:47:36.578   /dev-scripts/apply-correct-schema.ts
09:47:36.579   /dev-scripts/check-brevo-account.ts
09:47:36.579   /dev-scripts/check-data.ts
09:47:36.579   /dev-scripts/clean-duplicate-tables.ts
09:47:36.579   /dev-scripts/create-email-templates-table.ts
09:47:36.579   /dev-scripts/create-simple-data.ts
09:47:36.579   /dev-scripts/create-tables-direct.ts
09:47:37.348 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
09:47:38.045 Running "vercel build"
09:47:38.438 Vercel CLI 48.0.3
09:47:40.005 Installing dependencies...
09:47:41.617 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
09:47:41.626 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
09:47:41.657 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
09:47:41.677 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
09:47:41.682 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
09:47:41.720 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
09:47:42.184 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
09:47:42.782 
09:47:42.783 added 44 packages, and changed 1 package in 2s
09:47:42.783 
09:47:42.783 166 packages are looking for funding
09:47:42.783   run `npm fund` for details
09:47:42.814 Detected Next.js version: 15.5.3
09:47:42.819 Running "npm run build"
09:47:42.932 
09:47:42.933 > fenafar-nextjs@0.1.0 build
09:47:42.933 > next build --turbopack
09:47:42.933 
09:47:44.088    ▲ Next.js 15.5.3 (Turbopack)
09:47:44.090 
09:47:44.187    Creating an optimized production build ...
09:47:44.915  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
09:47:44.915  ⚠ See instructions if you need to configure Turbopack:
09:47:44.915   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
09:47:44.915 
09:48:01.476  ✓ Finished writing to disk in 64ms
09:48:01.503  ✓ Compiled successfully in 16.6s
09:48:01.509    Linting and checking validity of types ...
09:48:10.251 Failed to compile.
09:48:10.252 
09:48:10.252 ./src/app/api/documentos/[id]/route.ts:59:18
09:48:10.252 Type error: Object literal may only specify known properties, but 'adminId' does not exist in type 'SindicatoWhereUniqueInput'. Did you mean to write 'admin'?
09:48:10.252 
09:48:10.252 [0m [90m 57 |[39m       [90m// Verificar se o documento pertence ao sindicato que o usuário administra[39m
09:48:10.252  [90m 58 |[39m       [36mconst[39m sindicato [33m=[39m [36mawait[39m prisma[33m.[39msindicato[33m.[39mfindUnique({
09:48:10.252 [31m[1m>[22m[39m[90m 59 |[39m         where[33m:[39m { adminId[33m:[39m user[33m.[39mid }[33m,[39m
09:48:10.252  [90m    |[39m                  [31m[1m^[22m[39m
09:48:10.253  [90m 60 |[39m         select[33m:[39m { id[33m:[39m [36mtrue[39m }
09:48:10.253  [90m 61 |[39m       })
09:48:10.253  [90m 62 |[39m       hasAccess [33m=[39m sindicato[33m?[39m[33m.[39mid [33m===[39m documento[33m.[39msindicatoId[0m
09:48:10.279 Next.js build worker exited with code: 1 and signal: null
09:48:10.301 Error: Command "npm run build" exited with 1