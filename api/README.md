# Backend OpenAPI contract

`src/openapi.yaml` is the source for API generation. It describes the read-only
matches JSON document at `/OWNER/REPO/main/data/matches.json` with `getMatches`.
The path lives in `src/paths/matches.yaml`; Team, MatchScore, MatchStatus, Match
and MatchesResponse are reusable component schemas. The source has no server-side
filter parameters. Error responses do not assume a JSON body.

The app currently selects the explicit `matches` mock scenario using
`data/matches.json`. MATCHES_URL remains the configured request address; the
placeholder OWNER/REPO does not provide a working remote source.

Run from the repository root:

```sh
npm run api:lint
npm run api:bundle
npm run api:generate
npm run typecheck
```

Dependencies are installed as npm workspaces using the root lockfile.
See `../packages/api/README.md` for the generated client boundary.
