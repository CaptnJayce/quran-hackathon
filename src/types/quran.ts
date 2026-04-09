export interface Surah {
	id: number
	name_simple: string
	name_arabic: string
	name_complex: string
	translated_name: { name: string; language_name: string }
	verses_count: number
	revelation_place: string
}

export interface Ayah {
	id: number
	verse_number: number
	verse_key: string
	text_uthmani: string
	words: Word[]
}

export interface Word {
	id: number
	position: number
	text_uthmani: string
	transliteration: { text: string }
	translation: { text: string }
	char_type_name: string
}

export interface Translation {
	resource_id: number
	text: string
}

export interface AyahWithTranslation extends Ayah {
	translations: Translation[]
}

export interface AudioFile {
	url: string
	duration: number
	verse_timings?: VerseTiming[]
}

export interface VerseTiming {
	verse_key: string
	timestamp_from: number
	timestamp_to: number
}

export interface WordMeaning {
	arabic: string
	transliteration: string
	translation: string
	rootWord: string
}
