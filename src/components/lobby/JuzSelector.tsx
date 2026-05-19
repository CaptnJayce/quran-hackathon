interface Props {
	selected: number | null
	onSelect: (juz: number) => void
}

export function JuzSelector({ selected, onSelect }: Props) {
	return (
		<div className="flex flex-col gap-2">
			<label className="text-stone-500 text-sm font-medium uppercase tracking-wide">Select Juz</label>
			<select
				value={selected ?? ''}
				onChange={(e) => onSelect(Number(e.target.value))}
				className="w-full px-4 py-3 bg-white/70 border border-amber-200/80 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-800"
			>
				<option value="" disabled>Choose a Juz...</option>
				{Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
					<option key={juz} value={juz}>Juz {juz}</option>
				))}
			</select>
		</div>
	)
}
