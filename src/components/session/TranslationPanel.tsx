import { useState, useEffect } from 'react'
import { getVerseTranslation } from '../../lib/quranApi'

interface Props {
	verseKey: string
	initialText: string
}

export function TranslationPanel({ verseKey, initialText }: Props) {
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
		<div className="w-full max-w-lg px-4 py-3 bg-surface rounded-xl border border-border">
			{loading ? (
				<p className="text-ink-faint text-sm">Loading translation...</p>
			) : (
				<p className="text-ink-secondary text-sm leading-relaxed">{clean}</p>
			)}
		</div>
	)
}
