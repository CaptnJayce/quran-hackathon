import { useState } from 'react'
import type { Word, WordMeaning } from '../types/quran'

export function useWordLens() {
	const [meaning, setMeaning] = useState<WordMeaning | null>(null)

	function setMeaningFromWord(word: Word) {
		setMeaning({
			arabic: word.text_uthmani,
			transliteration: word.transliteration?.text ?? '',
			translation: word.translation?.text ?? '',
			rootWord: word.char_type_name ?? '',
		})
	}

	function clear() {
		setMeaning(null)
	}

	return { meaning, setMeaningFromWord, clear }
}
