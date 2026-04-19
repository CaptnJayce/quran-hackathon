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
	const data = await get<{ verses: AyahWithTranslation[] }>(
		`/verses/by_chapter/${surahId}?words=true&translations=${TRANSLATION_ID}&word_fields=text_uthmani,transliteration,translation,char_type_name&per_page=300`
	)
	return data.verses
}

export async function getAyahsByJuz(juzNumber: number): Promise<AyahWithTranslation[]> {
	const data = await get<{ verses: AyahWithTranslation[] }>(
		`/verses/by_juz/${juzNumber}?words=true&translations=${TRANSLATION_ID}&word_fields=text_uthmani,transliteration,translation,char_type_name&per_page=500`
	)
	return data.verses
}

export function getAudioUrlForAyah(verseKey: string): string {
	const [surah, ayah] = verseKey.split(':')
	const s = String(surah).padStart(3, '0')
	const a = String(ayah).padStart(3, '0')
	return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`
}
