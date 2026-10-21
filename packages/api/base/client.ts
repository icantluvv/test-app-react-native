import type { ClientConfig } from './codegen/.kubb/client'
import type { ExpoTransportOptions } from './expo-transport'

import {
	client as generatedClient,
	createClient as createGeneratedClient,
} from './codegen/.kubb/client'
import { createExpoTransport } from './expo-transport'

export { setOnUnauthorized } from './client-handlers'
export { ResponseError } from './codegen/.kubb/client'
export type { RequestConfig, ClientConfig, TransportResult } from './codegen/.kubb/client'

const mockMode = process.env.EXPO_PUBLIC_API_MOCK_MODE === 'true'

// Configure the shared generated client once. Mock routes match method/path only.
generatedClient.setConfig({
	...generatedClient.getConfig(),
	baseURL: mockMode ? 'https://mock.example.test' : process.env.EXPO_PUBLIC_API_URL,
	transport: createExpoTransport(
		mockMode ? { mockScenario: 'matches', mockFallbackScenario: false } : {},
	),
})
export const client = generatedClient

export function createApiClient(
	config: Omit<ClientConfig, 'transport'> = {},
	transportOptions: ExpoTransportOptions = {},
) {
	return createGeneratedClient({ ...config, transport: createExpoTransport(transportOptions) })
}
