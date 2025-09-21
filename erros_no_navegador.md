19:36:05.445 Running build in Washington, D.C., USA (East) – iad1
19:36:05.446 Build machine configuration: 2 cores, 8 GB
19:36:05.460 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: c1ce6b2)
19:36:05.860 Cloning completed: 399.000ms
19:36:06.023 Found .vercelignore
19:36:06.060 Removed 49 ignored files defined in .vercelignore
19:36:06.060   /check-data.mjs
19:36:06.060   /cookies.txt
19:36:06.060   /dev-scripts/add-cpf-cargo-fields.ts
19:36:06.060   /dev-scripts/apply-correct-schema.ts
19:36:06.060   /dev-scripts/check-brevo-account.ts
19:36:06.060   /dev-scripts/check-data.ts
19:36:06.060   /dev-scripts/clean-duplicate-tables.ts
19:36:06.060   /dev-scripts/create-email-templates-table.ts
19:36:06.060   /dev-scripts/create-simple-data.ts
19:36:06.060   /dev-scripts/create-tables-direct.ts
19:36:06.769 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:36:07.345 Running "vercel build"
19:36:07.725 Vercel CLI 48.0.2
19:36:08.045 Installing dependencies...
19:36:09.525 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:36:09.528 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:36:09.545 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:36:09.572 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:36:09.573 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:36:09.607 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:36:10.059 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:36:10.567 
19:36:10.568 added 44 packages, and changed 1 package in 2s
19:36:10.569 
19:36:10.569 166 packages are looking for funding
19:36:10.569   run `npm fund` for details
19:36:10.600 Detected Next.js version: 15.5.3
19:36:10.604 Running "npm run build"
19:36:10.706 
19:36:10.706 > fenafar-nextjs@0.1.0 build
19:36:10.707 > next build --turbopack
19:36:10.707 
19:36:11.736    ▲ Next.js 15.5.3 (Turbopack)
19:36:11.736 
19:36:11.826    Creating an optimized production build ...
19:36:12.550  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:36:12.550  ⚠ See instructions if you need to configure Turbopack:
19:36:12.551   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:36:12.551 
19:36:27.279  ✓ Finished writing to disk in 37ms
19:36:27.329  ✓ Compiled successfully in 14.8s
19:36:27.337    Linting and checking validity of types ...
19:36:35.458 Failed to compile.
19:36:35.458 
19:36:35.459 ./src/app/api/convites/[id]/route.ts:226:17
19:36:35.459 Type error: Property 'usado' does not exist on type '{ sindicato: { name: string; id: string; cnpj: string; } | null; criadoPor: { name: string | null; id: string; email: string; }; } & { id: string; active: boolean; email: string; role: UserRole; ... 5 more ...; acceptedAt: Date | null; }'.
19:36:35.459 
19:36:35.459 [0m [90m 224 |[39m     }
19:36:35.459  [90m 225 |[39m
19:36:35.459 [31m[1m>[22m[39m[90m 226 |[39m     [36mif[39m (convite[33m.[39musado) {
19:36:35.459  [90m     |[39m                 [31m[1m^[22m[39m
19:36:35.459  [90m 227 |[39m       [36mreturn[39m [33mNextResponse[39m[33m.[39mjson(
19:36:35.459  [90m 228 |[39m         { error[33m:[39m [32m'Convite já foi utilizado'[39m }[33m,[39m
19:36:35.459  [90m 229 |[39m         { status[33m:[39m [35m400[39m }[0m
19:36:35.483 Next.js build worker exited with code: 1 and signal: null
19:36:35.502 Error: Command "npm run build" exited with 1