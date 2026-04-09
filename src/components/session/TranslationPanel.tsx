interface Props {
	text: string
}

export function TranslationPanel({ text }: Props) {
	// Strip footnote markers like <sup>...</sup> from API text
	const clean = text.replace(/<[^>]+>/g, '')

	return (
		<div className="w-full max-w-lg px-4 py-3 bg-stone-800 rounded-xl border border-stone-700">
			<p className="text-stone-300 text-sm leading-relaxed">{clean}</p>
		</div>
	)
}
