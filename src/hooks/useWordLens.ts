import { useState } from 'react'
import { getWordMeaning } from '../lib/mcpClient'
import type { WordMeaning } from '../types/quran'

export function useWordLens() {
	const [meaning, setMeaning] = useState<WordMeaning | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function fetchMeaning(surahNumber: number, ayahNumber: number, wordPosition: number) {
		setIsLoading(true)
		setError(null)
		setMeaning(null)
		try {
			const result = await getWordMeaning(surahNumber, ayahNumber, wordPosition)
			setMeaning(result)
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Unknown error')
		} finally {
			setIsLoading(false)
		}
	}

	function clear() {
		setMeaning(null)
		setError(null)
	}

	return { meaning, isLoading, error, fetchMeaning, clear }
}
