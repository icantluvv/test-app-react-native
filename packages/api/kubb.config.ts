import { adapterOas } from '@kubb/adapter-oas'
import { pluginFetch } from '@kubb/plugin-fetch'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'
import { defineConfig } from 'kubb/config'

export default defineConfig({
	input: '../../api/src/openapi.yaml',
	output: { path: './base/codegen', clean: true },
	adapter: adapterOas(),
	plugins: [
		pluginTs(),
		pluginZod(),
		pluginFetch({ validator: 'zod' }),
		pluginReactQuery({ client: 'fetch', hooks: true }),
	],
})
