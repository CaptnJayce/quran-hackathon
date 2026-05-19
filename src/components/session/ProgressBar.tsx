interface Props {
	current: number
	total: number
}

export function ProgressBar({ current, total }: Props) {
	const pct = Math.round((current / total) * 100)

	return (
		<div className="w-full h-1 bg-border">
			<div
				className="h-full bg-accent transition-all duration-500"
				style={{ width: `${pct}%` }}
			/>
		</div>
	)
}
