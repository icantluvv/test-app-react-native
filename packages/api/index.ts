export * from './base/client'
export { createExpoTransport } from './base/expo-transport'
export type { ExpoTransportOptions } from './base/expo-transport'
export type { MockRoute, MockResponse } from './base/mock-scenarios'

export { getMatches } from './base/codegen/clients/getMatches'
export {
	useGetMatches,
	getMatchesQueryKey,
	getMatchesQueryOptions,
} from './base/codegen/hooks/useGetMatches'
export type { Match, MatchStatusKey, MatchesResponse, Team, MatchScore } from './base/codegen/types'
export { matchesResponseSchema } from './base/codegen/zod/matchesResponseSchema'
export { matchSchema } from './base/codegen/zod/matchSchema'

export { setMatchFavorite } from './base/codegen/clients/setMatchFavorite'
export {
	useSetMatchFavorite,
	setMatchFavoriteMutationKey,
	setMatchFavoriteMutationOptions,
} from './base/codegen/hooks/useSetMatchFavorite'
export type { ApiError } from './base/codegen/types/ApiError'
export type { MatchFavorite } from './base/codegen/types/MatchFavorite'
export type { SetMatchFavoriteRequest } from './base/codegen/types/SetMatchFavoriteRequest'
export type {
	SetMatchFavoriteOptions,
	SetMatchFavoriteResponse,
} from './base/codegen/types/SetMatchFavorite'
export { setMatchFavoriteRequestSchema } from './base/codegen/zod/setMatchFavoriteRequestSchema'
export { matchFavoriteSchema } from './base/codegen/zod/matchFavoriteSchema'
