import type { ResolvedRequest } from './codegen/.kubb/client'

import { mockScenarios } from './mock-scenarios'

export async function tryGetMockResponse(request: ResolvedRequest, scenario: string) {
	const routes = mockScenarios[scenario]
	if (!routes) return undefined
	const pathname = new URL(request.url).pathname.replace(/\/+$/, '') || '/'
	const route = routes.find((route) => {
		route.pattern.lastIndex = 0
		return (
			route.method.toUpperCase() === request.method.toUpperCase() &&
			route.pattern.test(pathname)
		)
	})
	if (!route) return undefined
	const result = await route.create(request)
	const status = result.status ?? 200
	const headers = new Headers(result.headers)
	headers.set('x-mock-mode', 'true')
	if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
	return new Response(
		[204, 205, 304].includes(status) || result.data === undefined
			? null
			: JSON.stringify(result.data),
		{ status, headers },
	)
}

export async function getMockResponse(request: ResolvedRequest, scenario: string) {
	const response = await tryGetMockResponse(request, scenario)
	if (!response)
		throw new Error(
			`Mock response is not configured for ${request.method} ${new URL(request.url).pathname} in ${scenario}`,
		)
	return response
}
