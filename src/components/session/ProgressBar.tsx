interface Props {
	current: number
	total: number
}

export function ProgressBar({ current, total }: Props) {
	const pct = Math.round((current / total) * 100)

	return (
		<div className="w-full h-1 bg-stone-800">
			<div
				className="h-full bg-emerald-500 transition-all duration-500"
				style={{ width: `${pct}%` }}
			/>
		</div>
	)
}
