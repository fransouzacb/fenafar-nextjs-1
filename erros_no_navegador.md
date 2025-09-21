20:05:15.936 Running build in Washington, D.C., USA (East) – iad1
20:05:15.936 Build machine configuration: 2 cores, 8 GB
20:05:15.953 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 6a01306)
20:05:16.313 Cloning completed: 360.000ms
20:05:16.477 Found .vercelignore
20:05:16.506 Removed 49 ignored files defined in .vercelignore
20:05:16.507   /check-data.mjs
20:05:16.507   /cookies.txt
20:05:16.507   /dev-scripts/add-cpf-cargo-fields.ts
20:05:16.508   /dev-scripts/apply-correct-schema.ts
20:05:16.508   /dev-scripts/check-brevo-account.ts
20:05:16.508   /dev-scripts/check-data.ts
20:05:16.508   /dev-scripts/clean-duplicate-tables.ts
20:05:16.508   /dev-scripts/create-email-templates-table.ts
20:05:16.509   /dev-scripts/create-simple-data.ts
20:05:16.509   /dev-scripts/create-tables-direct.ts
20:05:17.090 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
20:05:17.680 Running "vercel build"
20:05:18.054 Vercel CLI 48.0.2
20:05:18.363 Installing dependencies...
20:05:19.802 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
20:05:19.810 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
20:05:19.844 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
20:05:19.867 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
20:05:19.869 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
20:05:19.892 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
20:05:20.381 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
20:05:20.917 
20:05:20.917 added 44 packages, and changed 1 package in 2s
20:05:20.918 
20:05:20.918 166 packages are looking for funding
20:05:20.918   run `npm fund` for details
20:05:20.948 Detected Next.js version: 15.5.3
20:05:20.953 Running "npm run build"
20:05:21.341 
20:05:21.342 > fenafar-nextjs@0.1.0 build
20:05:21.342 > next build --turbopack
20:05:21.342 
20:05:22.608    ▲ Next.js 15.5.3 (Turbopack)
20:05:22.610 
20:05:22.705    Creating an optimized production build ...
20:05:23.428  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
20:05:23.429  ⚠ See instructions if you need to configure Turbopack:
20:05:23.429   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
20:05:23.429 
20:05:39.496  ✓ Finished writing to disk in 41ms
20:05:39.550  ✓ Compiled successfully in 16.1s
20:05:39.555    Linting and checking validity of types ...
20:05:47.880 Failed to compile.
20:05:47.880 
20:05:47.880 ./src/app/api/documentos/[id]/download/route.ts:64:29
20:05:47.880 Type error: Property 'userId' does not exist on type '{ sindicato: { id: string; admin: { id: string; } | null; }; } & { name: string; id: string; active: boolean; createdAt: Date; updatedAt: Date; sindicatoId: string; description: string | null; tipo: DocumentoTipo; fileUrl: string; fileSize: number | null; mimeType: string | null; }'.
20:05:47.880 
20:05:47.880 [0m [90m 62 |[39m       [90m// Verificar se o documento foi criado pelo próprio usuário[39m
20:05:47.880  [90m 63 |[39m       [90m// TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado[39m
20:05:47.881 [31m[1m>[22m[39m[90m 64 |[39m       hasAccess [33m=[39m documento[33m.[39muserId [33m===[39m user[33m.[39mid
20:05:47.881  [90m    |[39m                             [31m[1m^[22m[39m
20:05:47.881  [90m 65 |[39m     }
20:05:47.881  [90m 66 |[39m
20:05:47.881  [90m 67 |[39m     [36mif[39m ([33m![39mhasAccess) {[0m
20:05:47.905 Next.js build worker exited with code: 1 and signal: null
20:05:47.925 Error: Command "npm run build" exited with 1