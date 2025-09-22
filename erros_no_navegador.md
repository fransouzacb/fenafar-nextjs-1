09:52:36.965 Running build in Washington, D.C., USA (East) – iad1
09:52:36.965 Build machine configuration: 2 cores, 8 GB
09:52:36.980 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 3c12ddb)
09:52:37.792 Cloning completed: 812.000ms
09:52:37.972 Found .vercelignore
09:52:38.020 Removed 49 ignored files defined in .vercelignore
09:52:38.021   /check-data.mjs
09:52:38.022   /cookies.txt
09:52:38.022   /dev-scripts/add-cpf-cargo-fields.ts
09:52:38.022   /dev-scripts/apply-correct-schema.ts
09:52:38.022   /dev-scripts/check-brevo-account.ts
09:52:38.023   /dev-scripts/check-data.ts
09:52:38.023   /dev-scripts/clean-duplicate-tables.ts
09:52:38.023   /dev-scripts/create-email-templates-table.ts
09:52:38.023   /dev-scripts/create-simple-data.ts
09:52:38.024   /dev-scripts/create-tables-direct.ts
09:52:38.693 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
09:52:39.233 Running "vercel build"
09:52:39.628 Vercel CLI 48.0.3
09:52:39.980 Installing dependencies...
09:52:42.334 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
09:52:42.339 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
09:52:42.371 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
09:52:42.398 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
09:52:42.401 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
09:52:42.425 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
09:52:42.911 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
09:52:43.459 
09:52:43.460 added 44 packages, and changed 1 package in 3s
09:52:43.460 
09:52:43.461 166 packages are looking for funding
09:52:43.461   run `npm fund` for details
09:52:43.490 Detected Next.js version: 15.5.3
09:52:43.495 Running "npm run build"
09:52:43.602 
09:52:43.603 > fenafar-nextjs@0.1.0 build
09:52:43.603 > next build --turbopack
09:52:43.603 
09:52:44.676    ▲ Next.js 15.5.3 (Turbopack)
09:52:44.677 
09:52:44.787    Creating an optimized production build ...
09:52:45.490  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
09:52:45.491  ⚠ See instructions if you need to configure Turbopack:
09:52:45.491   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
09:52:45.492 
09:53:01.155  ✓ Finished writing to disk in 44ms
09:53:01.241  ✓ Compiled successfully in 15.7s
09:53:01.249    Linting and checking validity of types ...
09:53:09.435 Failed to compile.
09:53:09.435 
09:53:09.435 ./src/app/api/documentos/[id]/route.ts:70:29
09:53:09.435 Type error: Property 'userId' does not exist on type '{ sindicato: { name: string; id: string; cnpj: string; }; } & { name: string; id: string; active: boolean; createdAt: Date; updatedAt: Date; sindicatoId: string; description: string | null; tipo: DocumentoTipo; fileUrl: string; fileSize: number | null; mimeType: string | null; }'.
09:53:09.435 
09:53:09.435 [0m [90m 68 |[39m       [90m// Verificar se o documento foi criado pelo próprio usuário[39m
09:53:09.436  [90m 69 |[39m       [90m// TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado[39m
09:53:09.436 [31m[1m>[22m[39m[90m 70 |[39m       hasAccess [33m=[39m documento[33m.[39muserId [33m===[39m user[33m.[39mid
09:53:09.436  [90m    |[39m                             [31m[1m^[22m[39m
09:53:09.436  [90m 71 |[39m     }
09:53:09.436  [90m 72 |[39m
09:53:09.436  [90m 73 |[39m     [36mif[39m ([33m![39mhasAccess) {[0m
09:53:09.459 Next.js build worker exited with code: 1 and signal: null
09:53:09.480 Error: Command "npm run build" exited with 1