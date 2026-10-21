# Generated backend API for Expo

Pipeline: `api/src/openapi.yaml` → Kubb → TypeScript types, Zod validators,
Fetch operations, TanStack Query options/keys and hooks in `base/codegen/`.
Kubb and its plugins are development tools; they are not imported by the app.

## Current state

The backend contract is empty. No business endpoints, database clients, old mocks,
Next.js authentication, SSR adapters, or query hooks are retained. `index.ts` exports the configured Expo `client`, `createApiClient`, handlers,
and mock types. The three files under `base/codegen/.kubb/` are freshly
generated transport/serialization/validation helpers, with no business operations.
After generation with real operations, export the needed generated modules here;
never edit generated files.

```sh
npm run api:generate
npm run typecheck
```

Use Node >=22.12 for Kubb. Plugin versions are independent and pinned in the
workspace manifest; all dependencies resolve through the root package-lock.json.

## Expo integration when an endpoint is added

- Mount one stable `QueryClient` with `QueryClientProvider` in `App.tsx`.
- Import through the package public API: it configures the generated default
  client with the Expo transport. The transport explicitly imports `fetch` from
  `expo/fetch`. Relative operation URLs use `process.env.EXPO_PUBLIC_API_URL`.
  For an isolated client use `createApiClient({ baseURL: absoluteURL })` and pass
  it through generated operation/hook options (`client: { client: apiClient }`
  for hooks). No Next.js env,
  `window` detection, same-origin routing or server client is required.
- Do not put credentials in public env variables or query keys. Authentication
  must follow the actual backend contract; no cookie or Bearer policy is assumed.
- Keep cache policy, invalidation, UI mapping and loading/error/empty states in
  feature code, outside `base/codegen/`. Generated ordinary queries should forward
  AbortSignal; HTTP and schema errors should become query errors.
- SDK 57 supplies global Expo Fetch on native. Fetch is available on web too.
  No custom native module or development build is required for this pipeline.
- For foreground refresh use React Native AppState with Query focusManager;
  for reconnect support wire onlineManager to a compatible network-status source.
  Browser focus events alone do not implement these behaviors on native.
- A phone cannot reach a computer backend through `localhost`. Use a reachable
  LAN address or HTTPS development endpoint. Web requests also need correct CORS.

No provider is mounted yet because the screen does not consume backend queries.
No global retry/freshness defaults are imposed without product requirements.

## Handwritten client modules

- `base/client.ts`: public/default client and isolated client factory.
- `base/expo-transport.ts`: explicit Expo Fetch adapter, response decoding, retry.
- `base/client-handlers.ts`: replaceable/resettable app-level auth handlers.
- `base/mock-client.ts`: resolves an explicitly selected mock scenario.
- `base/mock-scenarios.ts`: empty route registry belonging to this app.

Configure `EXPO_PUBLIC_API_URL` with a reachable absolute HTTP(S) backend URL.
No environment value is required until the first relative-URL request is sent.
Public env variables contain no secrets. Supply auth headers with the generated
client's request interceptors or its `auth` resolver according to the backend.
Credentials are not forced to `include`.

`setOnUnauthorized` receives the resolved request. Return fresh headers to permit
one replay; return null/void to let the original 401 become a query error.
Concurrent 401s share a refresh promise. The handler must refresh using a separate
client with `{ unauthorizedRetry: false }` to avoid recursive refresh. It may
choose not to retry auth endpoints or non-idempotent writes. Stream bodies are
never replayed. Handlers can be removed by passing null.

For mocks use `createApiClient({ baseURL: 'https://mock.example.test' },
{ mockScenario: 'default' })`. Add real-contract routes to `mockScenarios.default`.
Forced mock mode never falls through to the real network.
By default, real GET/HEAD calls fall back to a matching default mock on network
failure or 5xx. Configure `mockFallbackScenario` to select a scenario or set it to
false to disable fallback. Without a matching route, the original failure stays.
Mutations, 4xx (including 401), cancellation and invalid response schemas do not
trigger fallback. Mock responses carry `x-mock-mode: true` and pass through the
same generated HTTP/Zod error handling.

Query/path/JSON/multipart serialization belongs to generated Kubb serializers.
Do not reintroduce the old `.kubb/config.ts` or duplicate `search-params.ts`.
The built-in multipart serializer skips null/undefined, repeats array values,
formats Dates, preserves Blobs, and supports per-part JSON media types through
OpenAPI encoding. A prebuilt FormData is passed through unchanged; do not manually
set its Content-Type/boundary. For native picker file objects (`uri/name/type`),
build a native FormData explicitly rather than letting a plain object become JSON.
An upload integration must be checked against its actual backend schema.

Verified 2026-10-21: Kubb 5.11.6, adapter-oas 5.11.6, plugin-ts 5.0.14,
plugin-zod 5.4.12, plugin-fetch 5.7.0, plugin-react-query 5.5.4,
TanStack Query 5.104.5, Zod 4.6.7 (npm latest metadata and installed types).
References: https://docs.expo.dev/versions/v57.0.0/sdk/expo/ and
https://tanstack.com/query/latest/docs/framework/react/react-native .
