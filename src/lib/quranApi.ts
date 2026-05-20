import type { Surah, AyahWithTranslation } from '../types/quran'

const BASE = 'https://api.qurancdn.com/api/qdc'

async function get<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}${path}`)
	if (!res.ok) throw new Error(`Quran API error: ${res.status} ${path}`)
	return res.json()
}

function translationFromWords(verse: { words: { char_type_name: string; translation?: { text: string } }[] }): string {
	return verse.words
		.filter((w) => w.char_type_name === 'word')
		.map((w) => w.translation?.text ?? '')
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim()
}

function attachTranslations(verses: (AyahWithTranslation & { words: { char_type_name: string; translation?: { text: string } }[] })[]): AyahWithTranslation[] {
	return verses.map((v) => ({
		...v,
		translations: [{ resource_id: 131, text: translationFromWords(v) }],
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
	const data = await get<{ verses: AyahWithTranslation[] }>(
		`/verses/by_chapter/${surahId}?words=true&translations=131&word_fields=text_uthmani,transliteration,translation,char_type_name&per_page=300`
	)
	return attachTranslations(data.verses)
}

export async function getAyahsByJuz(juzNumber: number): Promise<AyahWithTranslation[]> {
	const data = await get<{ verses: AyahWithTranslation[] }>(
		`/verses/by_juz/${juzNumber}?words=true&translations=131&word_fields=text_uthmani,transliteration,translation,char_type_name&per_page=500`
	)
	return attachTranslations(data.verses)
}

export async function getAllAyahs(): Promise<AyahWithTranslation[]> {
	const results = await Promise.all(
		Array.from({ length: 30 }, (_, i) =>
			get<{ verses: AyahWithTranslation[] }>(
				`/verses/by_juz/${i + 1}?words=true&translations=131&word_fields=text_uthmani,transliteration,translation,char_type_name&per_page=500`
			).then((d) => d.verses)
		)
	)
	return attachTranslations(results.flat())
}

export function getAudioUrlForAyah(verseKey: string): string {
	const [surah, ayah] = verseKey.split(':')
	const s = String(surah).padStart(3, '0')
	const a = String(ayah).padStart(3, '0')
	return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`
}
