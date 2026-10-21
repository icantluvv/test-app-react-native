import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { MatchesScreen } from './src/screens/MatchesScreen'

export default function App() {
	const [queryClient] = useState(() => new QueryClient())
	return (
		<QueryClientProvider client={queryClient}>
			<View style={styles.root}>
				<MatchesScreen />
				<StatusBar style="auto" />
			</View>
		</QueryClientProvider>
	)
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		paddingTop: 48,
		backgroundColor: '#fff',
	},
})
