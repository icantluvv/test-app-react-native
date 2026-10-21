import { useEffect, useState } from 'react'

const FAVORITES_STORAGE_KEY = 'matches:favorites:v1'

type FavoritesState = {
	favorites: string[]
	storageError: boolean
}

function readFavorites(): FavoritesState {
	try {
		const saved = globalThis.localStorage.getItem(FAVORITES_STORAGE_KEY)
		if (saved === null) return { favorites: [], storageError: false }
		let value: unknown
		try {
			value = JSON.parse(saved)
		} catch {
			return { favorites: [], storageError: false }
		}
		const favorites =
			Array.isArray(value) && value.every((id): id is string => typeof id === 'string')
				? [...new Set(value)]
				: []
		return { favorites, storageError: false }
	} catch {
		return { favorites: [], storageError: true }
	}
}

// Один экземпляр hook на экране; в storage сохраняются только ID матчей.
export function useFavorites() {
	const [{ favorites, storageError }, setState] = useState(readFavorites)

	useEffect(() => {
		if (storageError) return
		try {
			globalThis.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
		} catch {
			setState((previous) => ({ ...previous, storageError: true }))
		}
	}, [favorites, storageError])

	const isFavorite = (id: string) => favorites.includes(id)

	const toggle = (id: string) => {
		setState((previous) => ({
			...previous,
			favorites: previous.favorites.includes(id)
				? previous.favorites.filter((favoriteId) => favoriteId !== id)
				: [...previous.favorites, id],
		}))
	}

	return { favorites, isFavorite, toggle, storageError }
}
