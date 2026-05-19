import { useState } from 'react'
import type { Word, WordMeaning } from '../types/quran'
import { getWordMeaning } from '../lib/mcpClient'

export function useWordLens() {
	const [meaning, setMeaning] = useState<WordMeaning | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	async function fetchMeaning(word: Word, verseKey: string) {
		const [surahStr, ayahStr] = verseKey.split(':')
		const surahNumber = parseInt(surahStr)
		const ayahNumber = parseInt(ayahStr)

		setIsLoading(true)
		setMeaning(null)

		try {
			const mcpMeaning = await getWordMeaning(surahNumber, ayahNumber, word.position)
			setMeaning(mcpMeaning)
		} catch {
			setMeaning({
				arabic: word.text_uthmani,
				transliteration: word.transliteration?.text ?? '',
				translation: word.translation?.text ?? '',
				rootWord: word.char_type_name ?? '',
			})
		} finally {
			setIsLoading(false)
		}
	}

	function clear() {
		setMeaning(null)
		setIsLoading(false)
	}

	return { meaning, isLoading, fetchMeaning, clear }
}
