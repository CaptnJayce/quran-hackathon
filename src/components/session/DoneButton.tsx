interface Props {
	onDone: () => void
}

export function DoneButton({ onDone }: Props) {
	return (
		<button
			onClick={onDone}
			className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg transition-colors active:scale-95"
		>
			Done — Next Ayah
		</button>
	)
}
