18:15:25.551 Running build in Washington, D.C., USA (East) – iad1
18:15:25.552 Build machine configuration: 2 cores, 8 GB
18:15:25.569 Cloning github.com/fransouzacb/fenafar-nextjs-1 (Branch: main, Commit: 46695d1)
18:15:25.909 Cloning completed: 340.000ms
18:15:27.021 Restored build cache from previous deployment (DWo1sCB5eaZ7DCEU7M4uNueK9LwB)
18:15:27.570 Running "vercel build"
18:15:27.961 Vercel CLI 48.0.2
18:15:28.312 Installing dependencies...
18:15:29.894 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
18:15:29.917 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
18:15:29.939 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
18:15:29.958 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
18:15:29.966 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
18:15:29.990 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
18:15:30.484 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
18:15:31.019 
18:15:31.020 added 44 packages, and changed 1 package in 2s
18:15:31.021 
18:15:31.021 166 packages are looking for funding
18:15:31.021   run `npm fund` for details
18:15:31.054 Detected Next.js version: 15.5.3
18:15:31.059 Running "npm run build"
18:15:31.191 
18:15:31.191 > fenafar-nextjs@0.1.0 build
18:15:31.191 > next build --turbopack
18:15:31.192 
18:15:32.309    ▲ Next.js 15.5.3 (Turbopack)
18:15:32.309 
18:15:32.453    Creating an optimized production build ...
18:15:51.003  ✓ Finished writing to disk in 43ms
18:15:51.031  ✓ Compiled successfully in 17.8s
18:15:51.036    Linting and checking validity of types ...
18:15:58.526 
18:15:58.527 Failed to compile.
18:15:58.527 
18:15:58.527 ./src/app/(auth)/convites/aceitar/[token]/page.tsx
18:15:58.527 58:10  Warning: 'isLoading' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:15:58.527 83:6  Warning: React Hook useEffect has a missing dependency: 'loadConvite'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
18:15:58.527 213:13  Warning: 'data' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:15:58.527 222:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.527 
18:15:58.527 ./src/app/(dashboard)/admin/convites/page.tsx
18:15:58.527 21:3  Warning: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.527 62:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 64:10  Warning: 'sindicatos' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 506:41  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 509:39  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 531:39  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 534:37  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 
18:15:58.528 ./src/app/(dashboard)/admin/email-templates/page.tsx
18:15:58.528 41:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 44:10  Warning: 'editingTemplate' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 
18:15:58.528 ./src/app/(dashboard)/admin/membros/page.tsx
18:15:58.528 13:3  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 14:3  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.528 
18:15:58.528 ./src/app/(dashboard)/admin/page.tsx
18:15:58.529 35:10  Warning: 'isLoading' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:15:58.529 
18:15:58.529 ./src/app/(dashboard)/admin/sindicatos/page.tsx
18:15:58.529 23:3  Warning: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.529 203:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.529 
18:15:58.529 ./src/app/(sindicato)/sindicato/documentos/page.tsx
18:15:58.529 5:29  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.529 5:41  Warning: 'CardTitle' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.529 13:3  Warning: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.529 15:3  Warning: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.530 18:3  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.530 22:3  Warning: 'Building2' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.530 80:6  Warning: React Hook useEffect has a missing dependency: 'loadDocumentos'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
18:15:58.530 150:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.530 172:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.530 196:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.530 
18:15:58.530 ./src/app/api/convites/[id]/route.ts
18:15:58.530 112:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.530 154:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.530 281:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.530 
18:15:58.530 ./src/app/api/convites/aceitar/[token]/route.ts
18:15:58.530 5:8  Warning: 'bcrypt' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.530 236:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.530 
18:15:58.530 ./src/app/api/convites/route.ts
18:15:58.531 158:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.531 
18:15:58.531 ./src/app/api/documentos/[id]/download/route.ts
18:15:58.531 99:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.531 
18:15:58.531 ./src/app/api/documentos/[id]/route.ts
18:15:58.531 84:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.531 188:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.531 285:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.531 
18:15:58.531 ./src/app/api/documentos/route.ts
18:15:58.531 36:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.531 114:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.531 
18:15:58.531 ./src/app/api/documentos/upload/route.ts
18:15:58.531 53:11  Warning: 'descricao' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:15:58.532 165:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.532 212:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.532 
18:15:58.532 ./src/app/api/email-templates/[id]/route.ts
18:15:58.532 118:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.560 
18:15:58.560 ./src/app/api/email-templates/route.ts
18:15:58.561 5:10  Warning: 'EmailTemplate' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.561 102:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.561 
18:15:58.561 ./src/app/api/sindicato/stats/route.ts
18:15:58.561 130:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.562 
18:15:58.562 ./src/app/api/sindicatos/[id]/route.ts
18:15:58.562 22:17  Error: A `require()` style import is forbidden.  @typescript-eslint/no-require-imports
18:15:58.562 23:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.562 125:17  Error: A `require()` style import is forbidden.  @typescript-eslint/no-require-imports
18:15:58.563 126:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.563 269:17  Error: A `require()` style import is forbidden.  @typescript-eslint/no-require-imports
18:15:58.563 270:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.563 
18:15:58.563 ./src/app/api/sindicatos/route.ts
18:15:58.563 87:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.563 
18:15:58.564 ./src/components/forms/convite-form.tsx
18:15:58.564 161:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.564 
18:15:58.572 ./src/components/forms/login-form.tsx
18:15:58.573 83:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.573 
18:15:58.573 ./src/components/forms/sindicato-form.tsx
18:15:58.573 8:10  Warning: 'Alert' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.574 8:17  Warning: 'AlertDescription' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.574 172:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.574 
18:15:58.574 ./src/components/layouts/dashboard-layout.tsx
18:15:58.574 5:10  Warning: 'Card' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.574 86:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.575 
18:15:58.575 ./src/components/profile/universal-profile.tsx
18:15:58.575 9:56  Warning: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.575 17:36  Warning: 'userRole' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.575 21:10  Warning: 'isUploadingAvatar' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:15:58.575 
18:15:58.575 ./src/components/providers/auth-provider.tsx
18:15:58.576 6:10  Warning: 'UserRole' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.576 
18:15:58.576 ./src/lib/auth.ts
18:15:58.576 21:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.576 
18:15:58.576 ./src/lib/email.ts
18:15:58.576 23:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.577 207:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.577 
18:15:58.577 ./src/lib/utils.ts
18:15:58.577 169:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.577 169:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:15:58.577 
18:15:58.577 ./src/middleware.ts
18:15:58.577 3:10  Warning: 'UserRole' is defined but never used.  @typescript-eslint/no-unused-vars
18:15:58.578 
18:15:58.578 ./src/types/auth.ts
18:15:58.578 21:18  Error: An interface declaring no members is equivalent to its supertype.  @typescript-eslint/no-empty-object-type
18:15:58.578 
18:15:58.578 info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
18:15:58.584 Error: Command "npm run build" exited with 1