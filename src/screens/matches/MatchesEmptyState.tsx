import { StyleSheet, Text, View } from 'react-native'

export function MatchesEmptyState() {
	return (
		<View style={styles.container}>
			<Text accessibilityRole="header" style={styles.title}>
				Нет запрашиваемых матчей
			</Text>
			<Text style={styles.description}>
				Выберите другой фильтр или обновите список матчей.
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		minHeight: 240,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
		paddingVertical: 40,
		gap: 12,
	},
	title: { fontSize: 22, fontWeight: '600', color: '#111827', textAlign: 'center' },
	description: {
		fontSize: 16,
		lineHeight: 24,
		color: '#6b7280',
		textAlign: 'center',
		maxWidth: 320,
	},
})
