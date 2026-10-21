import type { ResolvedRequest } from './codegen/.kubb/client'

import matchesData from '../../../data/matches.json'

export interface MockResponse {
	data?: unknown
	status?: number
	headers?: HeadersInit
}

export interface MockRoute {
	method: string
	pattern: RegExp
	create: (request: ResolvedRequest) => MockResponse | Promise<MockResponse>
}

// Populate only with operations from this project's real API contract.
export const mockScenarios: Record<string, readonly MockRoute[]> = {
	default: [],
	matches: [
		{
			method: 'GET',
			pattern: /^\/OWNER\/REPO\/main\/data\/matches\.json$/,
			create: async () => {
				// Simulate an asynchronous source so the loading state is visible.
				await new Promise<void>((resolve) => setTimeout(resolve, 350))
				return { data: matchesData }
			},
		},
	],
}
