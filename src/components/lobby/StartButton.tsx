interface Props {
	disabled: boolean
	onStart: () => void
}

export function StartButton({ disabled, onStart }: Props) {
	return (
		<button
			onClick={onStart}
			disabled={disabled}
			className="w-full max-w-md py-4 bg-accent hover:brightness-110 disabled:opacity-40 rounded-xl font-bold text-lg transition-colors text-white"
		>
			Start Session
		</button>
	)
}
