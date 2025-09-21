20:02:38.771 Running build in Washington, D.C., USA (East) – iad1
20:02:38.772 Build machine configuration: 2 cores, 8 GB
20:02:38.786 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 3863b1e)
20:02:39.171 Cloning completed: 385.000ms
20:02:39.439 Found .vercelignore
20:02:39.469 Removed 49 ignored files defined in .vercelignore
20:02:39.486   /check-data.mjs
20:02:39.488   /cookies.txt
20:02:39.488   /dev-scripts/add-cpf-cargo-fields.ts
20:02:39.489   /dev-scripts/apply-correct-schema.ts
20:02:39.489   /dev-scripts/check-brevo-account.ts
20:02:39.490   /dev-scripts/check-data.ts
20:02:39.490   /dev-scripts/clean-duplicate-tables.ts
20:02:39.491   /dev-scripts/create-email-templates-table.ts
20:02:39.491   /dev-scripts/create-simple-data.ts
20:02:39.492   /dev-scripts/create-tables-direct.ts
20:02:39.875 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
20:02:40.405 Running "vercel build"
20:02:40.780 Vercel CLI 48.0.2
20:02:41.095 Installing dependencies...
20:02:42.551 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
20:02:42.552 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
20:02:42.583 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
20:02:42.599 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
20:02:42.610 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
20:02:42.641 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
20:02:43.086 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
20:02:43.608 
20:02:43.609 added 44 packages, and changed 1 package in 2s
20:02:43.609 
20:02:43.609 166 packages are looking for funding
20:02:43.610   run `npm fund` for details
20:02:43.639 Detected Next.js version: 15.5.3
20:02:43.644 Running "npm run build"
20:02:43.749 
20:02:43.749 > fenafar-nextjs@0.1.0 build
20:02:43.749 > next build --turbopack
20:02:43.749 
20:02:44.807    ▲ Next.js 15.5.3 (Turbopack)
20:02:44.808 
20:02:44.902    Creating an optimized production build ...
20:02:45.665  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
20:02:45.667  ⚠ See instructions if you need to configure Turbopack:
20:02:45.667   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
20:02:45.667 
20:03:01.910  ✓ Finished writing to disk in 45ms
20:03:01.947  ✓ Compiled successfully in 16.3s
20:03:01.994    Linting and checking validity of types ...
20:03:10.486 Failed to compile.
20:03:10.486 
20:03:10.486 ./src/app/api/documentos/[id]/download/route.ts:60:19
20:03:10.486 Type error: 'documento.sindicato.admin' is possibly 'null'.
20:03:10.486 
20:03:10.487 [0m [90m 58 |[39m     [36mif[39m (user[33m.[39mrole [33m===[39m [33mUserRole[39m[33m.[39m[33mSINDICATO_ADMIN[39m) {
20:03:10.487  [90m 59 |[39m       [90m// Verificar se o documento pertence ao sindicato que o usuário administra[39m
20:03:10.487 [31m[1m>[22m[39m[90m 60 |[39m       hasAccess [33m=[39m documento[33m.[39msindicato[33m.[39madmin[33m.[39mid [33m===[39m user[33m.[39mid
20:03:10.487  [90m    |[39m                   [31m[1m^[22m[39m
20:03:10.487  [90m 61 |[39m     } [36melse[39m [36mif[39m (user[33m.[39mrole [33m===[39m [33mUserRole[39m[33m.[39m[33mMEMBER[39m) {
20:03:10.487  [90m 62 |[39m       [90m// Verificar se o documento foi criado pelo próprio usuário[39m
20:03:10.487  [90m 63 |[39m       [90m// TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado[39m[0m
20:03:10.513 Next.js build worker exited with code: 1 and signal: null
20:03:10.534 Error: Command "npm run build" exited with 1