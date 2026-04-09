import { useEffect, useState } from 'react'
import { getSurahs } from '../../lib/quranApi'
import type { Surah } from '../../types/quran'

interface Props {
	selected: number | null
	onSelect: (id: number) => void
}

export function SurahSelector({ selected, onSelect }: Props) {
	const [surahs, setSurahs] = useState<Surah[]>([])

	useEffect(() => {
		getSurahs().then(setSurahs).catch(console.error)
	}, [])

	return (
		<div className="flex flex-col gap-2">
			<label className="text-stone-400 text-sm font-medium uppercase tracking-wide">Select Surah</label>
			<select
				value={selected ?? ''}
				onChange={(e) => onSelect(Number(e.target.value))}
				className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl focus:outline-none focus:border-emerald-500"
			>
				<option value="" disabled>Choose a Surah...</option>
				{surahs.map((s) => (
					<option key={s.id} value={s.id}>
						{s.id}. {s.name_simple} — {s.name_arabic} ({s.verses_count} ayahs)
					</option>
				))}
			</select>
		</div>
	)
}
