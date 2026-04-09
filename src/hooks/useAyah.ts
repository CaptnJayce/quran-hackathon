import { useEffect, useState } from 'react'
import { getAyahsByChapter, getAyahsByJuz } from '../lib/quranApi'
import type { AyahWithTranslation } from '../types/quran'

export function useAyah(surahId: number | null, juzNumber: number | null) {
	const [ayahs, setAyahs] = useState<AyahWithTranslation[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!surahId && !juzNumber) return
		setIsLoading(true)
		setError(null)

		const fetch = surahId
			? getAyahsByChapter(surahId)
			: getAyahsByJuz(juzNumber!)

		fetch
			.then(setAyahs)
			.catch((e) => setError(e.message))
			.finally(() => setIsLoading(false))
	}, [surahId, juzNumber])

	return { ayahs, isLoading, error }
}
