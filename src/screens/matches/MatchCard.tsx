import type { Match } from '@repo/api'

import { StyleSheet, Text, View } from 'react-native'

import { matchStartLabel, matchStatusLabel } from './presentation'

type MatchCardProps = { match: Match; loading?: false } | { match?: never; loading: true }

export function MatchCard({ match, loading = false }: MatchCardProps) {
	return (
		<View style={styles.card} aria-hidden={loading}>
			<Text
				selectable={!loading}
				style={[styles.status, loading && styles.statusPlaceholder]}
			>
				{match ? matchStatusLabel(match) : '\u00a0'}
			</Text>
			<View style={styles.teams}>
				<Text selectable={!loading} style={[styles.team, loading && styles.placeholder]}>
					{match?.home.name ?? '\u00a0'}
				</Text>
				<Text selectable={!loading} style={[styles.score, loading && styles.placeholder]}>
					{match
						? match.score === null
							? '—'
							: `${match.score.home}:${match.score.away}`
						: '0:0'}
				</Text>
				<Text
					selectable={!loading}
					style={[styles.team, styles.away, loading && styles.placeholder]}
				>
					{match?.away.name ?? '\u00a0'}
				</Text>
			</View>
			<Text selectable={!loading} style={[styles.date, loading && styles.datePlaceholder]}>
				{match ? matchStartLabel(match.startsAt) : '\u00a0'}
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
				<MatchCard key={key} loading />
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
	placeholder: { backgroundColor: '#e5e7eb', borderRadius: 4, color: 'transparent' },
	statusPlaceholder: { backgroundColor: '#e5e7eb', borderRadius: 4, width: '55%' },
	datePlaceholder: { backgroundColor: '#e5e7eb', borderRadius: 4, width: '55%' },
})
