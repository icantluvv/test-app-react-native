import { useEffect, useState } from 'react'
import { AppState, StyleSheet, Text } from 'react-native'

import { MINUTE_FORMS } from '../constants/time.constants'

type Props = {
	// Момент последней успешной загрузки данных.
	since: Date
}

const pluralRules = new Intl.PluralRules('ru-RU')

export function UpdatedAgo({ since }: Props) {
	const timestamp = since.getTime()
	const [now, setNow] = useState(Date.now)

	useEffect(() => {
		const update = () => setNow(Date.now())
		update()
		const interval = setInterval(update, 1000)
		const subscription = AppState.addEventListener('change', (state) => {
			if (state === 'active') update()
		})
		return () => {
			clearInterval(interval)
			subscription.remove()
		}
	}, [timestamp])

	const seconds = Math.max(0, Math.floor((now - timestamp) / 1000))
	const minutes = Math.floor(seconds / 60)
	const elapsed =
		seconds < 60 ? `${seconds} сек` : `${minutes} ${MINUTE_FORMS[pluralRules.select(minutes)]}`
	return <Text style={styles.text}>Обновлено {elapsed} назад</Text>
}

const styles = StyleSheet.create({
	text: { fontSize: 13, color: '#6b7280' },
})
