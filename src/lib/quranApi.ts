import type { Surah, AyahWithTranslation, AudioFile } from '../types/quran'

const BASE = 'https://api.qurancdn.com/api/qdc'
const TRANSLATION_ID = 131 // Saheeh International

async function get<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}${path}`)
	if (!res.ok) throw new Error(`Quran API error: ${res.status} ${path}`)
	return res.json()
}

export async function getSurahs(): Promise<Surah[]> {
	const data = await get<{ chapters: Surah[] }>('/chapters?language=en')
	return data.chapters
}

export async function getSurah(id: number): Promise<Surah> {
	const data = await get<{ chapter: Surah }>(`/chapters/${id}`)
	return data.chapter
}

export async function getAyahsByChapter(surahId: number): Promise<AyahWithTranslation[]> {
	const [versesData, translationsData] = await Promise.all([
		get<{ verses: AyahWithTranslation[] }>(
			`/verses/by_chapter/${surahId}?words=true&word_fields=text_uthmani,transliteration,translation,char_type_name&per_page=300`
		),
		get<{ translations: { verse_number: number; text: string }[] }>(
			`/verses/by_chapter/${surahId}?translations=${TRANSLATION_ID}&per_page=300`
		),
	])

	return versesData.verses.map((verse, i) => ({
		...verse,
		translations: [
			{
				resource_id: TRANSLATION_ID,
				text: translationsData.translations[i]?.text ?? '',
			},
		],
	}))
}

export async function getAyahsByJuz(juzNumber: number): Promise<AyahWithTranslation[]> {
	const [versesData, translationsData] = await Promise.all([
		get<{ verses: AyahWithTranslation[] }>(
			`/verses/by_juz/${juzNumber}?words=true&word_fields=text_uthmani,transliteration,translation,char_type_name&per_page=500`
		),
		get<{ translations: { verse_number: number; text: string }[] }>(
			`/verses/by_juz/${juzNumber}?translations=${TRANSLATION_ID}&per_page=500`
		),
	])

	return versesData.verses.map((verse, i) => ({
		...verse,
		translations: [
			{
				resource_id: TRANSLATION_ID,
				text: translationsData.translations[i]?.text ?? '',
			},
		],
	}))
}

export async function getAudioForChapter(surahId: number, reciterId = 7): Promise<AudioFile> {
	const data = await get<{ audio_file: AudioFile }>(
		`/chapter_recitations/${reciterId}/${surahId}`
	)
	return data.audio_file
}
