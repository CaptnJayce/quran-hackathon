import { useState } from 'react'
import type { Word, WordMeaning } from '../types/quran'

export function useWordLens() {
	const [meaning, setMeaning] = useState<WordMeaning | null>(null)

	function setMeaningFromWord(word: Word) {
		const translation = word.translation?.text
		const transliteration = word.transliteration?.text
		if (!translation && !transliteration) return
		setMeaning({
			arabic: word.text_uthmani,
			transliteration: transliteration ?? '',
			translation: translation ?? '',
			rootWord: word.char_type_name ?? '',
		})
	}

	function clear() {
		setMeaning(null)
	}

	return { meaning, setMeaningFromWord, clear }
}
