19:44:40.741 Running build in Washington, D.C., USA (East) – iad1
19:44:40.741 Build machine configuration: 2 cores, 8 GB
19:44:40.756 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 28f6712)
19:44:41.183 Cloning completed: 426.000ms
19:44:41.397 Found .vercelignore
19:44:41.424 Removed 49 ignored files defined in .vercelignore
19:44:41.424   /check-data.mjs
19:44:41.424   /cookies.txt
19:44:41.425   /dev-scripts/add-cpf-cargo-fields.ts
19:44:41.425   /dev-scripts/apply-correct-schema.ts
19:44:41.425   /dev-scripts/check-brevo-account.ts
19:44:41.425   /dev-scripts/check-data.ts
19:44:41.425   /dev-scripts/clean-duplicate-tables.ts
19:44:41.425   /dev-scripts/create-email-templates-table.ts
19:44:41.425   /dev-scripts/create-simple-data.ts
19:44:41.425   /dev-scripts/create-tables-direct.ts
19:44:41.998 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:44:42.540 Running "vercel build"
19:44:42.927 Vercel CLI 48.0.2
19:44:43.247 Installing dependencies...
19:44:44.699 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:44:44.706 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:44:44.731 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:44:44.750 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:44:44.759 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:44:44.783 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:44:45.246 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:44:45.784 
19:44:45.784 added 44 packages, and changed 1 package in 2s
19:44:45.784 
19:44:45.784 166 packages are looking for funding
19:44:45.785   run `npm fund` for details
19:44:45.817 Detected Next.js version: 15.5.3
19:44:45.822 Running "npm run build"
19:44:45.965 
19:44:45.965 > fenafar-nextjs@0.1.0 build
19:44:45.966 > next build --turbopack
19:44:45.966 
19:44:47.149    ▲ Next.js 15.5.3 (Turbopack)
19:44:47.155 
19:44:47.245    Creating an optimized production build ...
19:44:47.968  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:44:47.968  ⚠ See instructions if you need to configure Turbopack:
19:44:47.968   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:44:47.968 
19:45:04.804  ✓ Finished writing to disk in 40ms
19:45:04.842  ✓ Compiled successfully in 16.9s
19:45:04.849    Linting and checking validity of types ...
19:45:13.710 Failed to compile.
19:45:13.710 
19:45:13.710 ./src/app/api/convites/aceitar/[token]/route.ts:101:17
19:45:13.711 Type error: Property 'usado' does not exist on type '{ sindicato: { name: string; id: string; active: boolean; email: string; phone: string | null; createdAt: Date; updatedAt: Date; cnpj: string; address: string | null; city: string | null; state: string | null; zipCode: string | null; website: string | null; description: string | null; } | null; } & { ...; }'.
19:45:13.711 
19:45:13.711 [0m [90m  99 |[39m
19:45:13.711  [90m 100 |[39m     [90m// Verificar se convite já foi usado[39m
19:45:13.711 [31m[1m>[22m[39m[90m 101 |[39m     [36mif[39m (convite[33m.[39musado) {
19:45:13.712  [90m     |[39m                 [31m[1m^[22m[39m
19:45:13.712  [90m 102 |[39m       [36mreturn[39m [33mNextResponse[39m[33m.[39mjson(
19:45:13.712  [90m 103 |[39m         { error[33m:[39m [32m'Convite já foi utilizado'[39m }[33m,[39m
19:45:13.712  [90m 104 |[39m         { status[33m:[39m [35m400[39m }[0m
19:45:13.736 Next.js build worker exited with code: 1 and signal: null
19:45:13.758 Error: Command "npm run build" exited with 1