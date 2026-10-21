import { StyleSheet, View } from 'react-native'

import { MatchCard } from './MatchCard'

export function MatchesSkeleton() {
	return (
		<View
			accessibilityLabel="Загрузка матчей"
			accessibilityRole="progressbar"
			style={styles.skeletons}
		>
			{[0, 1, 2].map((key) => (
				<MatchCard key={key} loading />
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	skeletons: { gap: 12 },
})
