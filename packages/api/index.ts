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
