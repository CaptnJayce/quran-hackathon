import type { WordMeaning } from '../../types/quran'

interface Props {
	meaning: WordMeaning
	isLoading: boolean
	onClose: () => void
}

export function WordLens({ meaning, isLoading, onClose }: Props) {
	return (
		<div className="fixed inset-0 bg-black/60 flex items-end z-50" onClick={onClose}>
			<div
				className="w-full bg-stone-900 border-t border-stone-700 rounded-t-2xl px-6 py-6 flex flex-col gap-3"
				onClick={(e) => e.stopPropagation()}
			>
				{isLoading ? (
					<p className="text-stone-400 text-center">Looking up word...</p>
				) : (
					<>
						<div className="flex justify-between items-start">
							<p className="text-3xl font-quran" dir="rtl">{meaning.arabic}</p>
							<button onClick={onClose} className="text-stone-500 hover:text-stone-300 text-lg">✕</button>
						</div>
						<p className="text-stone-400 text-sm italic">{meaning.transliteration}</p>
						<p className="text-stone-200">{meaning.translation}</p>
						{meaning.rootWord && (
							<p className="text-stone-500 text-xs">Type: {meaning.rootWord}</p>
						)}
					</>
				)}
			</div>
		</div>
	)
}
