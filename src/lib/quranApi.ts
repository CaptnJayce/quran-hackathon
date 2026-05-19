import type { Surah, AyahWithTranslation } from '../types/quran'

const BASE = 'https://api.qurancdn.com/api/qdc'
const TRANSLATION_ID = 131 // Saheeh International

async function get<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}${path}`)
	if (!res.ok) throw new Error(`Quran API error: ${res.status} ${path}`)
	return res.json()
}

interface CloudAyah {
	number: number
	text: string
	surah: { number: number }
	numberInSurah: number
}

async function fetchTranslationMap(surahId?: number, juzNumber?: number): Promise<Map<string, string>> {
	const edition = 'en.sahih'
	const path = surahId
		? `https://api.alquran.cloud/v1/surah/${surahId}/${edition}`
		: `https://api.alquran.cloud/v1/juz/${juzNumber}/${edition}`
	const res = await fetch(path)
	if (!res.ok) return new Map()
	const data = await res.json()
	const ayahs: CloudAyah[] = data?.data?.ayahs ?? []
	const map = new Map<string, string>()
	for (const a of ayahs) {
		map.set(`${a.surah.number}:${a.numberInSurah}`, a.text)
	}
	return map
}

function mergeTranslations(verses: AyahWithTranslation[], translationMap: Map<string, string>): AyahWithTranslation[] {
	return verses.map((v) => ({
		...v,
		translations: translationMap.has(v.verse_key)
			? [{ resource_id: TRANSLATION_ID, text: translationMap.get(v.verse_key)! }]
			: [],
	}))
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
	const [verses, translationMap] = await Promise.all([
		get<{ verses: AyahWithTranslation[] }>(
			`/verses/by_chapter/${surahId}?words=true&translations=${TRANSLATION_ID}&word_fields=text_uthmani,transliteration,translation,char_type_name&per_page=300`
		).then((d) => d.verses),
		fetchTranslationMap(surahId),
	])
	return mergeTranslations(verses, translationMap)
}

async function getAyahsByJuzWords(juzNumber: number): Promise<AyahWithTranslation[]> {
	const data = await get<{ verses: AyahWithTranslation[] }>(
		`/verses/by_juz/${juzNumber}?words=true&translations=${TRANSLATION_ID}&word_fields=text_uthmani,transliteration,translation,char_type_name&per_page=500`
	)
	return data.verses
}

export async function getAyahsByJuz(juzNumber: number): Promise<AyahWithTranslation[]> {
	const [verses, translationMap] = await Promise.all([
		getAyahsByJuzWords(juzNumber),
		fetchTranslationMap(undefined, juzNumber),
	])
	return mergeTranslations(verses, translationMap)
}

export async function getAllAyahs(): Promise<AyahWithTranslation[]> {
	const results = await Promise.all(
		Array.from({ length: 30 }, (_, i) => getAyahsByJuzWords(i + 1))
	)
	return results.flat()
}

export async function getVerseTranslation(verseKey: string): Promise<string | null> {
	const [surah] = verseKey.split(':')
	const edition = 'en.sahih'
	try {
		const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/${edition}`)
		if (!res.ok) return null
		const data = await res.json()
		const ayahs: CloudAyah[] = data?.data?.ayahs ?? []
		return ayahs.find((a) => `${a.surah.number}:${a.numberInSurah}` === verseKey)?.text ?? null
	} catch {
		return null
	}
}

export function getAudioUrlForAyah(verseKey: string): string {
	const [surah, ayah] = verseKey.split(':')
	const s = String(surah).padStart(3, '0')
	const a = String(ayah).padStart(3, '0')
	return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`
}
