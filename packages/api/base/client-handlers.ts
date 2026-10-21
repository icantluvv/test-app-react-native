import type { ResolvedRequest } from './codegen/.kubb/client'

// Return fresh headers to authorize exactly one retry. null/void means no retry.
export type UnauthorizedHandler = (request: ResolvedRequest) => Promise<HeadersInit | null | void>

let onUnauthorized: UnauthorizedHandler | null = null
let refresh: Promise<HeadersInit | null | void> | undefined

export function setOnUnauthorized(handler: UnauthorizedHandler | null) {
	onUnauthorized = handler
}

export function handleUnauthorized(request: ResolvedRequest) {
	if (!onUnauthorized) return Promise.resolve(null)
	// Concurrent 401s share one refresh. The callback must use a separate auth
	// transport/client, not this retrying client, to avoid recursive refresh.
	refresh ??= Promise.resolve()
		.then(() => onUnauthorized?.(request))
		.finally(() => {
			refresh = undefined
		})
	return refresh
}
