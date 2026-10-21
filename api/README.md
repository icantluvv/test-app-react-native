# Backend OpenAPI contract

`src/openapi.yaml` is the only source for API generation. The contract intentionally
has no operations, application schemas, authentication scheme, or backend address.

Add real endpoint definitions under `src/paths/` and reusable schemas under
`src/components/schemas/`, then reference them from `src/openapi.yaml`. Specify
unique `operationId` values, request parameters, success and error responses.
Do not copy database schemas into the mobile client contract.

Run from the repository root:

```sh
npm run api:lint
npm run api:bundle
npm run api:generate
npm run typecheck
```

Dependencies are installed as npm workspaces using the root lockfile.
See `../packages/api/README.md` for the generated client boundary.
