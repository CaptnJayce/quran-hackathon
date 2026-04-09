interface Props {
	disabled: boolean
	onStart: () => void
}

export function StartButton({ disabled, onStart }: Props) {
	return (
		<button
			onClick={onStart}
			disabled={disabled}
			className="w-full max-w-md py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-xl font-bold text-lg transition-colors"
		>
			Start Session
		</button>
	)
}
