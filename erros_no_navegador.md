20:10:55.840 Running build in Washington, D.C., USA (East) – iad1
20:10:55.842 Build machine configuration: 2 cores, 8 GB
20:10:55.918 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 8e09ef5)
20:10:56.516 Cloning completed: 598.000ms
20:10:56.662 Found .vercelignore
20:10:56.703 Removed 49 ignored files defined in .vercelignore
20:10:56.703   /check-data.mjs
20:10:56.703   /cookies.txt
20:10:56.703   /dev-scripts/add-cpf-cargo-fields.ts
20:10:56.704   /dev-scripts/apply-correct-schema.ts
20:10:56.704   /dev-scripts/check-brevo-account.ts
20:10:56.704   /dev-scripts/check-data.ts
20:10:56.704   /dev-scripts/clean-duplicate-tables.ts
20:10:56.704   /dev-scripts/create-email-templates-table.ts
20:10:56.704   /dev-scripts/create-simple-data.ts
20:10:56.705   /dev-scripts/create-tables-direct.ts
20:10:57.597 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
20:10:58.177 Running "vercel build"
20:10:58.565 Vercel CLI 48.0.2
20:10:58.887 Installing dependencies...
20:11:00.603 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
20:11:00.622 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
20:11:00.639 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
20:11:00.662 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
20:11:00.664 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
20:11:00.700 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
20:11:01.170 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
20:11:01.761 
20:11:01.762 added 44 packages, and changed 1 package in 2s
20:11:01.762 
20:11:01.762 166 packages are looking for funding
20:11:01.763   run `npm fund` for details
20:11:01.794 Detected Next.js version: 15.5.3
20:11:01.799 Running "npm run build"
20:11:01.908 
20:11:01.909 > fenafar-nextjs@0.1.0 build
20:11:01.909 > next build --turbopack
20:11:01.909 
20:11:03.021    ▲ Next.js 15.5.3 (Turbopack)
20:11:03.022 
20:11:03.119    Creating an optimized production build ...
20:11:03.875  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
20:11:03.876  ⚠ See instructions if you need to configure Turbopack:
20:11:03.877   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
20:11:03.877 
20:11:20.639  ✓ Finished writing to disk in 38ms
20:11:20.691  ✓ Compiled successfully in 16.8s
20:11:20.698    Linting and checking validity of types ...
20:11:29.448 Failed to compile.
20:11:29.449 
20:11:29.449 ./src/app/api/documentos/[id]/download/route.ts:99:27
20:11:29.450 Type error: Property 'titulo' does not exist on type '{ sindicato: { id: string; admin: { id: string; } | null; }; } & { name: string; id: string; active: boolean; createdAt: Date; updatedAt: Date; sindicatoId: string; description: string | null; tipo: DocumentoTipo; fileUrl: string; fileSize: number | null; mimeType: string | null; }'.
20:11:29.450 
20:11:29.450 [0m [90m  97 |[39m       success[33m:[39m [36mtrue[39m[33m,[39m
20:11:29.450  [90m  98 |[39m       downloadUrl[33m:[39m signedUrl[33m.[39msignedUrl[33m,[39m
20:11:29.450 [31m[1m>[22m[39m[90m  99 |[39m       fileName[33m:[39m documento[33m.[39mtitulo[33m,[39m
20:11:29.450  [90m     |[39m                           [31m[1m^[22m[39m
20:11:29.450  [90m 100 |[39m       fileSize[33m:[39m documento[33m.[39mtamanho[33m,[39m
20:11:29.451  [90m 101 |[39m       mimeType[33m:[39m documento[33m.[39mmimeType[33m,[39m
20:11:29.451  [90m 102 |[39m       expiresAt[33m:[39m [36mnew[39m [33mDate[39m([33mDate[39m[33m.[39mnow() [33m+[39m [35m3600[39m [33m*[39m [35m1000[39m) [90m// 1 hora a partir de agora[39m[0m
20:11:29.476 Next.js build worker exited with code: 1 and signal: null
20:11:29.498 Error: Command "npm run build" exited with 1