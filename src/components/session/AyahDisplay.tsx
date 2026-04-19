import type { AyahWithTranslation, Word } from '../../types/quran'

interface Props {
	ayah: AyahWithTranslation
	readerName: string
	onWordTap: (word: Word) => void
}

export function AyahDisplay({ ayah, readerName, onWordTap }: Props) {
	return (
		<div className="flex flex-col items-center gap-4 max-w-lg w-full">
			<p className="text-stone-400 text-sm">{readerName} is reading</p>
			<p className="text-stone-500 text-xs font-mono">{ayah.verse_key}</p>
			<div
				className="text-right leading-loose text-3xl"
				dir="rtl"
				lang="ar"
				style={{ fontFamily: "'Amiri Quran', serif" }}
			>
				{ayah.words
					.filter((w) => w.char_type_name !== 'end')
					.map((word) => (
						<span
							key={word.id}
							onClick={() => onWordTap(word)}
							className="cursor-pointer hover:text-emerald-400 transition-colors px-1 rounded"
							title={word.translation?.text}
						>
							{word.text_uthmani}
						</span>
					))}
			</div>
		</div>
	)
}
