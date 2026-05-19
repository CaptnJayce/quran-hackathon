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
				className="w-full bg-surface border-t border-border rounded-t-2xl px-6 py-6 flex flex-col gap-3 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				{isLoading ? (
					<p className="text-ink-muted text-center">Looking up word...</p>
				) : (
					<>
						<div className="flex justify-between items-start">
							<p className="text-3xl font-quran text-ink" dir="rtl">{meaning.arabic}</p>
							<button onClick={onClose} className="text-ink-faint hover:text-ink text-lg">✕</button>
						</div>
						<p className="text-ink-faint text-sm italic">{meaning.transliteration}</p>
						<p className="text-ink">{meaning.translation}</p>
						{meaning.rootWord && (
							<p className="text-ink-faint text-xs">Type: {meaning.rootWord}</p>
						)}
					</>
				)}
			</div>
		</div>
	)
}
