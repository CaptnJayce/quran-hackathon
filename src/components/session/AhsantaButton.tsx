interface Props {
	onAhsanta: () => void
	disabled: boolean
}

export function AhsantaButton({ onAhsanta, disabled }: Props) {
	return (
		<button
			onClick={onAhsanta}
			disabled={disabled}
			className="flex-1 py-4 text-lg font-bold rounded-xl border border-border text-ink-muted hover:text-accent hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
		>
			أحسنت
		</button>
	)
}
