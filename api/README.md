# Backend OpenAPI contract

`src/openapi.yaml` is the source for API generation. It describes the read-only
matches JSON document at `/OWNER/REPO/main/data/matches.json` with `getMatches`.
The path lives in `src/paths/matches.yaml`; Team, MatchScore, MatchStatus, Match
and MatchesResponse are reusable component schemas. The source has no server-side
filter parameters. Error responses do not assume a JSON body.

The planned PUT /favorites/{matchId} operation (`setMatchFavorite`) accepts
SetMatchFavoriteRequest with isFavorite, returns MatchFavorite (matchId/isFavorite)
and describes 400/404/500 ApiError responses. true adds, false removes; repeating
a request preserves the selected state. This is a future backend contract, not an
implemented service. Its operation-level server is an explicit placeholder;
the app stores favorites locally and never sends this request.

The app currently selects the explicit `matches` mock scenario using
`data/matches.json`, enabled by EXPO_PUBLIC_API_MOCK_MODE=true in .env.
Mock routes match method/path independently of the host. For network mode set
EXPO_PUBLIC_API_URL and disable mock mode; the document path remains in OpenAPI.

Run from the repository root:

```sh
npm run api:lint
npm run api:bundle
npm run api:generate
npm run typecheck
```

Dependencies are installed as npm workspaces using the root lockfile.
See `../packages/api/README.md` for the generated client boundary.
