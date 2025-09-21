20:07:31.534 Running build in Washington, D.C., USA (East) – iad1
20:07:31.535 Build machine configuration: 2 cores, 8 GB
20:07:31.549 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 03ace29)
20:07:31.844 Cloning completed: 293.000ms
20:07:31.951 Found .vercelignore
20:07:31.961 Removed 49 ignored files defined in .vercelignore
20:07:31.961   /check-data.mjs
20:07:31.961   /cookies.txt
20:07:31.961   /dev-scripts/add-cpf-cargo-fields.ts
20:07:31.961   /dev-scripts/apply-correct-schema.ts
20:07:31.961   /dev-scripts/check-brevo-account.ts
20:07:31.962   /dev-scripts/check-data.ts
20:07:31.962   /dev-scripts/clean-duplicate-tables.ts
20:07:31.962   /dev-scripts/create-email-templates-table.ts
20:07:31.962   /dev-scripts/create-simple-data.ts
20:07:31.962   /dev-scripts/create-tables-direct.ts
20:07:32.706 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
20:07:33.248 Running "vercel build"
20:07:33.632 Vercel CLI 48.0.2
20:07:33.965 Installing dependencies...
20:07:36.442 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
20:07:36.443 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
20:07:36.474 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
20:07:36.490 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
20:07:36.496 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
20:07:36.523 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
20:07:36.974 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
20:07:37.605 
20:07:37.606 added 44 packages, and changed 1 package in 3s
20:07:37.607 
20:07:37.607 166 packages are looking for funding
20:07:37.607   run `npm fund` for details
20:07:37.636 Detected Next.js version: 15.5.3
20:07:37.641 Running "npm run build"
20:07:37.747 
20:07:37.748 > fenafar-nextjs@0.1.0 build
20:07:37.748 > next build --turbopack
20:07:37.748 
20:07:38.855    ▲ Next.js 15.5.3 (Turbopack)
20:07:38.856 
20:07:38.952    Creating an optimized production build ...
20:07:39.655  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
20:07:39.655  ⚠ See instructions if you need to configure Turbopack:
20:07:39.656   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
20:07:39.656 
20:07:55.954  ✓ Finished writing to disk in 41ms
20:07:56.009  ✓ Compiled successfully in 16.4s
20:07:56.015    Linting and checking validity of types ...
20:08:04.681 Failed to compile.
20:08:04.681 
20:08:04.681 ./src/app/api/documentos/[id]/download/route.ts:86:34
20:08:04.681 Type error: Property 'arquivo' does not exist on type '{ sindicato: { id: string; admin: { id: string; } | null; }; } & { name: string; id: string; active: boolean; createdAt: Date; updatedAt: Date; sindicatoId: string; description: string | null; tipo: DocumentoTipo; fileUrl: string; fileSize: number | null; mimeType: string | null; }'.
20:08:04.681 
20:08:04.681 [0m [90m 84 |[39m     [36mconst[39m { data[33m:[39m signedUrl[33m,[39m error[33m:[39m urlError } [33m=[39m [36mawait[39m supabaseAdmin[33m.[39mstorage
20:08:04.681  [90m 85 |[39m       [33m.[39m[36mfrom[39m([32m'fenafar-documents'[39m)
20:08:04.681 [31m[1m>[22m[39m[90m 86 |[39m       [33m.[39mcreateSignedUrl(documento[33m.[39marquivo[33m,[39m [35m3600[39m) [90m// 1 hora[39m
20:08:04.682  [90m    |[39m                                  [31m[1m^[22m[39m
20:08:04.682  [90m 87 |[39m
20:08:04.682  [90m 88 |[39m     [36mif[39m (urlError) {
20:08:04.682  [90m 89 |[39m       console[33m.[39merror([32m'❌ Erro ao gerar URL assinada:'[39m[33m,[39m urlError)[0m
20:08:04.707 Next.js build worker exited with code: 1 and signal: null
20:08:04.728 Error: Command "npm run build" exited with 1