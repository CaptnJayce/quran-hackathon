interface Props {
	onDone: () => void
}

export function DoneButton({ onDone }: Props) {
	return (
		<button
			onClick={onDone}
			className="w-full py-4 bg-accent hover:brightness-110 rounded-xl font-bold text-lg transition-colors active:scale-95 text-white"
		>
			Done — Next Ayah
		</button>
	)
}
