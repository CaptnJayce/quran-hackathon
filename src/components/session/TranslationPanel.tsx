interface Props {
	initialText: string
	onClose: () => void
}

export function TranslationPanel({ initialText, onClose }: Props) {
	const text = initialText.replace(/<[^>]+>/g, '')

	return (
		<div className="fixed inset-0 z-30 flex items-center justify-center p-4" onClick={onClose}>
			<div className="absolute inset-0 bg-black/30" />
			<div
				className="relative max-w-lg w-full px-5 py-4 bg-surface rounded-xl border border-border shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-3">
					<p className="text-ink-secondary text-sm leading-relaxed">{text}</p>
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
