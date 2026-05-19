interface Props {
	text: string
}

export function TranslationPanel({ text }: Props) {
	// Strip footnote markers like <sup>...</sup> from API text
	const clean = text.replace(/<[^>]+>/g, '')

	return (
		<div className="w-full max-w-lg px-4 py-3 bg-surface rounded-xl border border-border">
			<p className="text-ink-secondary text-sm leading-relaxed">{clean}</p>
		</div>
	)
}
