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

// Import the package public API before consuming generated hooks: this configures
// their default client as well as direct operation calls. No env lookup at import.
generatedClient.setConfig({ ...generatedClient.getConfig(), transport: createExpoTransport() })
export const client = generatedClient

export function createApiClient(
	config: Omit<ClientConfig, 'transport'> = {},
	transportOptions: ExpoTransportOptions = {},
) {
	return createGeneratedClient({ ...config, transport: createExpoTransport(transportOptions) })
}
