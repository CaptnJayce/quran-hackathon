interface Props {
	onAhsanta: () => void
	disabled: boolean
}

export function AhsantaButton({ onAhsanta, disabled }: Props) {
	return (
		<button
			onClick={onAhsanta}
			disabled={disabled}
			className="px-4 py-2 text-sm rounded-xl border border-border text-ink-muted hover:text-accent hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
		>
			أحسنت
		</button>
	)
}
