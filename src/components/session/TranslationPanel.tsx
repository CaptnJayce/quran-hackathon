import { useState, useEffect } from 'react'
import { getVerseTranslation } from '../../lib/quranApi'

interface Props {
	verseKey: string
	initialText: string
	onClose: () => void
}

export function TranslationPanel({ verseKey, initialText, onClose }: Props) {
	const [text, setText] = useState(initialText)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (initialText !== 'Translation not available.') return
		setLoading(true)
		getVerseTranslation(verseKey).then((t) => {
			if (t) setText(t)
			setLoading(false)
		})
	}, [verseKey, initialText])

	const clean = text.replace(/<[^>]+>/g, '')

	return (
		<div className="fixed inset-0 z-30 flex items-center justify-center p-4" onClick={onClose}>
			<div className="absolute inset-0 bg-black/30" />
			<div
				className="relative max-w-lg w-full px-5 py-4 bg-surface rounded-xl border border-border shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-3">
					{loading ? (
						<p className="text-ink-faint text-sm">Loading translation...</p>
					) : (
						<p className="text-ink-secondary text-sm leading-relaxed">{clean}</p>
					)}
					<button
						onClick={onClose}
						className="shrink-0 text-ink-faint hover:text-ink transition-colors cursor-pointer"
					>
						✕
					</button>
				</div>
			</div>
		</div>
	)
}
