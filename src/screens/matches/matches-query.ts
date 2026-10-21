import { createApiClient, matchSchema, matchesResponseSchema, useGetMatches } from '@repo/api'
import { z } from 'zod'

import { MATCHES_URL } from '../../config'

const matchesClient = createApiClient({}, { mockScenario: 'matches', mockFallbackScenario: false })
// Kubb owns the operation path; the app config owns the actual source address.
matchesClient.interceptors.request.use((request) => ({ ...request, url: MATCHES_URL }))

// Kubb's default datetime accepts UTC only; the contract also permits offsets.
const responseSchema = matchesResponseSchema
	.extend({
		matches: z.array(
			matchSchema.extend({ startsAt: z.iso.datetime({ offset: true }).nullable() }),
		),
	})
	.refine(({ matches }) => new Set(matches.map(({ id }) => id)).size === matches.length, {
		message: 'Match IDs must be unique',
		path: ['matches'],
	})

export function useMatches() {
	return useGetMatches({
		client: {
			client: matchesClient,
			validator: { response: responseSchema },
		},
		query: {
			retry: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
	})
}
