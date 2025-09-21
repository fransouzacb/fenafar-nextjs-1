19:31:56.823 Running build in Washington, D.C., USA (East) – iad1
19:31:56.823 Build machine configuration: 2 cores, 8 GB
19:31:56.865 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 8e02900)
19:31:57.506 Cloning completed: 640.000ms
19:31:57.744 Found .vercelignore
19:31:57.930 Removed 48 ignored files defined in .vercelignore
19:31:57.931   /check-data.mjs
19:31:57.937   /cookies.txt
19:31:57.939   /dev-scripts/add-cpf-cargo-fields.ts
19:31:57.940   /dev-scripts/apply-correct-schema.ts
19:31:57.941   /dev-scripts/check-brevo-account.ts
19:31:57.942   /dev-scripts/check-data.ts
19:31:57.942   /dev-scripts/clean-duplicate-tables.ts
19:31:57.943   /dev-scripts/create-email-templates-table.ts
19:31:57.943   /dev-scripts/create-simple-data.ts
19:31:57.944   /dev-scripts/create-tables-direct.ts
19:31:58.809 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
19:31:59.392 Running "vercel build"
19:32:00.051 Vercel CLI 48.0.2
19:32:00.947 Installing dependencies...
19:32:02.502 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
19:32:02.513 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
19:32:02.518 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
19:32:02.558 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
19:32:02.559 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
19:32:02.591 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
19:32:03.109 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
19:32:03.638 
19:32:03.640 added 44 packages, and changed 1 package in 2s
19:32:03.640 
19:32:03.641 166 packages are looking for funding
19:32:03.641   run `npm fund` for details
19:32:03.687 Detected Next.js version: 15.5.3
19:32:03.693 Running "npm run build"
19:32:03.803 
19:32:03.804 > fenafar-nextjs@0.1.0 build
19:32:03.804 > next build --turbopack
19:32:03.804 
19:32:04.952    ▲ Next.js 15.5.3 (Turbopack)
19:32:04.952 
19:32:05.048    Creating an optimized production build ...
19:32:05.768  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
19:32:05.768  ⚠ See instructions if you need to configure Turbopack:
19:32:05.769   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
19:32:05.769 
19:32:22.954  ✓ Finished writing to disk in 55ms
19:32:23.004 
19:32:23.005 > Build error occurred
19:32:23.008 Error: Turbopack build failed with 10 errors:
19:32:23.009 ./src/app/api/convites/[id]/route.ts:94:1
19:32:23.009 Parsing ecmascript source code failed
19:32:23.009 [0m [90m 92 |[39m
19:32:23.010  [90m 93 |[39m     [36mconst[39m updatedConvite [33m=[39m [36mawait[39m prisma[33m.[39mconvite[33m.[39mupdate({
19:32:23.010 [31m[1m>[22m[39m[90m 94 |[39m [33m<<[39m[33m<<[39m[33m<<[39m[33m<[39m [33mHEAD[39m
19:32:23.010  [90m    |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.010  [90m 95 |[39m       where[33m:[39m { id }[33m,[39m
19:32:23.010  [90m 96 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.010  [90m 97 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }[33m,[39m[0m
19:32:23.010 
19:32:23.010 Merge conflict marker encountered.
19:32:23.010 
19:32:23.010 
19:32:23.010 ./src/app/api/convites/[id]/route.ts:94:1
19:32:23.010 Parsing ecmascript source code failed
19:32:23.010 [0m [90m 92 |[39m
19:32:23.010  [90m 93 |[39m     [36mconst[39m updatedConvite [33m=[39m [36mawait[39m prisma[33m.[39mconvite[33m.[39mupdate({
19:32:23.010 [31m[1m>[22m[39m[90m 94 |[39m [33m<<[39m[33m<<[39m[33m<<[39m[33m<[39m [33mHEAD[39m
19:32:23.010  [90m    |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.010  [90m 95 |[39m       where[33m:[39m { id }[33m,[39m
19:32:23.011  [90m 96 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.011  [90m 97 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }[33m,[39m[0m
19:32:23.011 
19:32:23.011 Merge conflict marker encountered.
19:32:23.011 
19:32:23.011 
19:32:23.011 ./src/app/api/convites/[id]/route.ts:96:1
19:32:23.011 Parsing ecmascript source code failed
19:32:23.011 [0m [90m 94 |[39m [33m<<[39m[33m<<[39m[33m<<[39m[33m<[39m [33mHEAD[39m
19:32:23.011  [90m 95 |[39m       where[33m:[39m { id }[33m,[39m
19:32:23.011 [31m[1m>[22m[39m[90m 96 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.011  [90m    |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.011  [90m 97 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }[33m,[39m
19:32:23.011  [90m 98 |[39m [33m>>>[39m[33m>>>[39m[33m>[39m [35m99657[39mc93a20c7d263a1b12685e3aff301f0e5081
19:32:23.011  [90m 99 |[39m       data[33m,[39m[0m
19:32:23.011 
19:32:23.012 Merge conflict marker encountered.
19:32:23.012 
19:32:23.012 
19:32:23.012 ./src/app/api/convites/[id]/route.ts:96:1
19:32:23.012 Parsing ecmascript source code failed
19:32:23.012 [0m [90m 94 |[39m [33m<<[39m[33m<<[39m[33m<<[39m[33m<[39m [33mHEAD[39m
19:32:23.013  [90m 95 |[39m       where[33m:[39m { id }[33m,[39m
19:32:23.013 [31m[1m>[22m[39m[90m 96 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.013  [90m    |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.013  [90m 97 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }[33m,[39m
19:32:23.013  [90m 98 |[39m [33m>>>[39m[33m>>>[39m[33m>[39m [35m99657[39mc93a20c7d263a1b12685e3aff301f0e5081
19:32:23.013  [90m 99 |[39m       data[33m,[39m[0m
19:32:23.013 
19:32:23.013 Merge conflict marker encountered.
19:32:23.013 
19:32:23.013 
19:32:23.013 ./src/app/api/convites/[id]/route.ts:98:1
19:32:23.013 Parsing ecmascript source code failed
19:32:23.013 [0m [90m  96 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.013  [90m  97 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }[33m,[39m
19:32:23.013 [31m[1m>[22m[39m[90m  98 |[39m [33m>>>[39m[33m>>>[39m[33m>[39m [35m99657[39mc93a20c7d263a1b12685e3aff301f0e5081
19:32:23.013  [90m     |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.013  [90m  99 |[39m       data[33m,[39m
19:32:23.013  [90m 100 |[39m       include[33m:[39m {
19:32:23.014  [90m 101 |[39m         sindicato[33m:[39m {[0m
19:32:23.014 
19:32:23.014 Merge conflict marker encountered.
19:32:23.014 
19:32:23.014 
19:32:23.014 ./src/app/api/convites/[id]/route.ts:98:1
19:32:23.014 Parsing ecmascript source code failed
19:32:23.014 [0m [90m  96 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.014  [90m  97 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }[33m,[39m
19:32:23.014 [31m[1m>[22m[39m[90m  98 |[39m [33m>>>[39m[33m>>>[39m[33m>[39m [35m99657[39mc93a20c7d263a1b12685e3aff301f0e5081
19:32:23.014  [90m     |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.014  [90m  99 |[39m       data[33m,[39m
19:32:23.014  [90m 100 |[39m       include[33m:[39m {
19:32:23.014  [90m 101 |[39m         sindicato[33m:[39m {[0m
19:32:23.014 
19:32:23.014 Merge conflict marker encountered.
19:32:23.014 
19:32:23.014 
19:32:23.014 ./src/app/api/convites/[id]/route.ts:159:1
19:32:23.014 Parsing ecmascript source code failed
19:32:23.014 [0m [90m 157 |[39m
19:32:23.014  [90m 158 |[39m     [36mawait[39m prisma[33m.[39mconvite[33m.[39m[36mdelete[39m({
19:32:23.014 [31m[1m>[22m[39m[90m 159 |[39m [33m<<[39m[33m<<[39m[33m<<[39m[33m<[39m [33mHEAD[39m
19:32:23.014  [90m     |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.015  [90m 160 |[39m       where[33m:[39m { id }
19:32:23.015  [90m 161 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.015  [90m 162 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }[0m
19:32:23.015 
19:32:23.015 Merge conflict marker encountered.
19:32:23.015 
19:32:23.015 
19:32:23.024 ./src/app/api/convites/[id]/route.ts:159:1
19:32:23.025 Parsing ecmascript source code failed
19:32:23.025 [0m [90m 157 |[39m
19:32:23.025  [90m 158 |[39m     [36mawait[39m prisma[33m.[39mconvite[33m.[39m[36mdelete[39m({
19:32:23.025 [31m[1m>[22m[39m[90m 159 |[39m [33m<<[39m[33m<<[39m[33m<<[39m[33m<[39m [33mHEAD[39m
19:32:23.026  [90m     |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.026  [90m 160 |[39m       where[33m:[39m { id }
19:32:23.027  [90m 161 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.027  [90m 162 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }[0m
19:32:23.027 
19:32:23.027 Merge conflict marker encountered.
19:32:23.027 
19:32:23.027 
19:32:23.027 ./src/app/api/convites/[id]/route.ts:161:1
19:32:23.029 Parsing ecmascript source code failed
19:32:23.029 [0m [90m 159 |[39m [33m<<[39m[33m<<[39m[33m<<[39m[33m<[39m [33mHEAD[39m
19:32:23.029  [90m 160 |[39m       where[33m:[39m { id }
19:32:23.029 [31m[1m>[22m[39m[90m 161 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.029  [90m     |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.029  [90m 162 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }
19:32:23.029  [90m 163 |[39m [33m>>>[39m[33m>>>[39m[33m>[39m [35m99657[39mc93a20c7d263a1b12685e3aff301f0e5081
19:32:23.037  [90m 164 |[39m     })[0m
19:32:23.037 
19:32:23.037 Merge conflict marker encountered.
19:32:23.037 
19:32:23.037 
19:32:23.037 ./src/app/api/convites/[id]/route.ts:161:1
19:32:23.037 Parsing ecmascript source code failed
19:32:23.037 [0m [90m 159 |[39m [33m<<[39m[33m<<[39m[33m<<[39m[33m<[39m [33mHEAD[39m
19:32:23.037  [90m 160 |[39m       where[33m:[39m { id }
19:32:23.038 [31m[1m>[22m[39m[90m 161 |[39m [33m===[39m[33m===[39m[33m=[39m
19:32:23.038  [90m     |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
19:32:23.038  [90m 162 |[39m       where[33m:[39m { id[33m:[39m ([36mawait[39m params)[33m.[39mid }
19:32:23.038  [90m 163 |[39m [33m>>>[39m[33m>>>[39m[33m>[39m [35m99657[39mc93a20c7d263a1b12685e3aff301f0e5081
19:32:23.038  [90m 164 |[39m     })[0m
19:32:23.038 
19:32:23.038 Merge conflict marker encountered.
19:32:23.038 
19:32:23.038 
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:94:1)
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:94:1)
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:96:1)
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:96:1)
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:98:1)
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:98:1)
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:159:1)
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:159:1)
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:161:1)
19:32:23.038     at <unknown> (./src/app/api/convites/[id]/route.ts:161:1)
19:32:23.094 Error: Command "npm run build" exited with 1