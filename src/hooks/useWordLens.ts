import { useState } from 'react'
import type { Word, WordMeaning } from '../types/quran'

export function useWordLens() {
	const [meaning, setMeaning] = useState<WordMeaning | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	async function fetchMeaning(word: Word) {
		setIsLoading(true)
		setMeaning({
			arabic: word.text_uthmani,
			transliteration: word.transliteration?.text ?? '',
			translation: word.translation?.text ?? '',
			rootWord: word.char_type_name ?? '',
		})
		setIsLoading(false)
	}

	function clear() {
		setMeaning(null)
		setIsLoading(false)
	}

	return { meaning, isLoading, fetchMeaning, clear }
}
