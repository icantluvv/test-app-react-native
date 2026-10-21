import type { Match } from '@repo/api'

import { StyleSheet, Text, View } from 'react-native'

import { matchStartLabel, matchStatusLabel } from './presentation'

export function MatchCard({ match }: { match: Match }) {
	return (
		<View style={styles.card}>
			<Text selectable style={styles.status}>
				{matchStatusLabel(match)}
			</Text>
			<View style={styles.teams}>
				<Text selectable style={styles.team}>
					{match.home.name}
				</Text>
				<Text selectable style={styles.score}>
					{match.score === null ? '—' : `${match.score.home}:${match.score.away}`}
				</Text>
				<Text selectable style={[styles.team, styles.away]}>
					{match.away.name}
				</Text>
			</View>
			<Text selectable style={styles.date}>
				{matchStartLabel(match.startsAt)}
			</Text>
		</View>
	)
}

export function MatchesSkeleton() {
	return (
		<View
			accessibilityLabel="Загрузка матчей"
			accessibilityRole="progressbar"
			style={styles.skeletons}
		>
			{[0, 1, 2].map((key) => (
				<View key={key} style={styles.card}>
					<View style={[styles.placeholder, styles.short]} />
					<View style={styles.placeholder} />
					<View style={[styles.placeholder, styles.short]} />
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		padding: 16,
		gap: 14,
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 12,
		backgroundColor: '#fff',
	},
	teams: { flexDirection: 'row', alignItems: 'center', gap: 12 },
	team: { flex: 1, fontSize: 16, color: '#111827' },
	away: { textAlign: 'right' },
	score: { fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'], color: '#111827' },
	status: { fontSize: 13, fontWeight: '600', color: '#374151' },
	date: { fontSize: 13, color: '#6b7280' },
	skeletons: { gap: 12 },
	placeholder: { height: 20, backgroundColor: '#e5e7eb', borderRadius: 4 },
	short: { width: '55%', height: 14 },
})
