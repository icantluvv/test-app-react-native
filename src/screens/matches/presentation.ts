import type { Match, MatchStatusKey } from '@repo/api'

export type MatchesFilter = 'all' | 'upcoming' | 'finished'

export const filters: { value: MatchesFilter; label: string }[] = [
	{ value: 'all', label: 'Все' },
	{ value: 'upcoming', label: 'Предстоящие' },
	{ value: 'finished', label: 'Завершённые' },
]

const statusLabels: Record<MatchStatusKey, string> = {
	scheduled: 'Предстоит',
	finished: 'Завершён',
	live: 'В прямом эфире',
	postponed: 'Перенесён',
}

export function filterMatches(matches: Match[], filter: MatchesFilter) {
	return matches.filter(
		({ status }) =>
			filter === 'all' ||
			(filter === 'upcoming' && (status === 'scheduled' || status === 'postponed')) ||
			(filter === 'finished' && status === 'finished'),
	)
}

export function matchStatusLabel(match: Match) {
	const label = statusLabels[match.status]
	return match.status === 'live' && match.minute !== undefined
		? `${label} · ${match.minute}-я минута`
		: label
}

export function matchStartLabel(startsAt: Match['startsAt']) {
	return startsAt === null
		? 'Дата уточняется'
		: new Intl.DateTimeFormat('ru-RU', {
				day: 'numeric',
				month: 'long',
				hour: '2-digit',
				minute: '2-digit',
			}).format(new Date(startsAt))
}
