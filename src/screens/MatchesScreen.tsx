import type { MatchesFilter } from '../components/matches/presentation'

import { useGetMatches } from '@repo/api'
import { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

import { MatchCard } from '../components/matches/MatchCard'
import { MatchesEmptyState } from '../components/matches/MatchesEmptyState'
import { MatchesSkeleton } from '../components/matches/MatchesSkeleton'
import { filterMatches, filters } from '../components/matches/presentation'
import { UpdatedAgo } from '../components/UpdatedAgo'
import { useFavorites } from '../hooks/useFavorites'

export function MatchesScreen() {
	const query = useGetMatches()
	// Для сервера есть generated useSetMatchFavorite; в тестовом задании без backend
	// избранное сохраняется только в localStorage.
	const { favorites, isFavorite, toggle, storageError } = useFavorites()
	const [filter, setFilter] = useState<MatchesFilter>('all')
	const matches = query.data ? filterMatches(query.data.matches, filter) : []

	return (
		<FlatList
			style={styles.container}
			contentContainerStyle={styles.content}
			contentInsetAdjustmentBehavior="automatic"
			data={matches}
			extraData={favorites}
			keyExtractor={(match) => match.id}
			renderItem={({ item }) => (
				<MatchCard
					match={item}
					active={isFavorite(item.id)}
					onFavoritePress={() => toggle(item.id)}
				/>
			)}
			ListHeaderComponent={
				<View style={styles.header}>
					<Text style={styles.title}>
						Матчи тура{query.data ? ` · ${query.data.round}` : ''}
					</Text>
					<View style={styles.filters}>
						{filters.map(({ value, label }) => (
							<Pressable
								key={value}
								accessibilityRole="button"
								accessibilityState={{ selected: filter === value }}
								onPress={() => setFilter(value)}
								style={[styles.filter, filter === value && styles.selected]}
							>
								<Text
									style={
										filter === value ? styles.selectedText : styles.filterText
									}
								>
									{label}
								</Text>
							</Pressable>
						))}
					</View>
					<View style={styles.refresh}>
						<Pressable
							accessibilityRole="button"
							disabled={query.isFetching}
							accessibilityState={{ disabled: query.isFetching }}
							onPress={() => void query.refetch({ cancelRefetch: false })}
							style={[styles.button, query.isFetching && styles.disabled]}
						>
							<Text style={styles.selectedText}>
								{query.isError ? 'Повторить' : 'Обновить'}
							</Text>
						</Pressable>
						{query.isFetching && !query.isLoading ? (
							<ActivityIndicator accessibilityLabel="Обновление матчей" />
						) : null}
						{query.data !== undefined && (
							<UpdatedAgo since={new Date(query.dataUpdatedAt)} />
						)}
					</View>
					{storageError && (
						<Text selectable accessibilityRole="alert" style={styles.error}>
							Не удалось сохранить избранное на устройстве. Выбор будет доступен
							только до закрытия экрана.
						</Text>
					)}
					{query.isError && (
						<Text selectable accessibilityRole="alert" style={styles.error}>
							{query.data === undefined
								? 'Не удалось загрузить матчи. Попробуйте ещё раз.'
								: 'Не удалось обновить матчи. Показаны последние полученные данные.'}
						</Text>
					)}
				</View>
			}
			ListEmptyComponent={
				query.isLoading ? (
					<MatchesSkeleton />
				) : query.fetchStatus === 'paused' ? (
					<Text style={styles.message}>Ожидание подключения к сети</Text>
				) : query.data !== undefined ? (
					<View style={styles.empty}>
						<MatchesEmptyState />
					</View>
				) : null
			}
		/>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: {
		flexGrow: 1,
		padding: 16,
		paddingBottom: 40,
		gap: 12,
		width: '100%',
		maxWidth: 760,
		alignSelf: 'center',
	},
	empty: { flex: 1 },
	header: { gap: 16, paddingBottom: 4 },
	title: { fontSize: 24, fontWeight: '700', color: '#111827' },
	filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	filter: {
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: '#f3f4f6',
	},
	selected: { backgroundColor: '#1d4ed8' },
	filterText: { color: '#374151' },
	selectedText: { color: '#fff', fontWeight: '600' },
	refresh: { flexDirection: 'row', alignItems: 'center', gap: 12 },
	button: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: '#1d4ed8',
	},
	disabled: { opacity: 0.5 },
	error: { color: '#b91c1c', fontSize: 14 },
	message: { color: '#6b7280', fontSize: 16, paddingVertical: 32, textAlign: 'center' },
})
