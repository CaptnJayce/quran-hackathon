import type { WordMeaning } from '../types/quran'

const MCP_URL = 'https://mcp.quran.ai/mcp'

export async function getWordMeaning(
	surahNumber: number,
	ayahNumber: number,
	wordPosition: number
): Promise<WordMeaning> {
	const res = await fetch(MCP_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			method: 'tools/call',
			params: {
				name: 'get_word_by_position',
				arguments: {
					chapter_number: surahNumber,
					verse_number: ayahNumber,
					word_position: wordPosition,
				},
			},
		}),
	})

	if (!res.ok) throw new Error(`MCP error: ${res.status}`)
	const data = await res.json()
	const result = data.result

	return {
		arabic: result.text_uthmani ?? '',
		transliteration: result.transliteration?.text ?? '',
		translation: result.translation?.text ?? '',
		rootWord: result.char_type_name ?? '',
	}
}
