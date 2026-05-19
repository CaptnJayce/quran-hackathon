import type { Participant } from '../../types/room'

export function StatsGrid({ participants }: { participants: Participant[] }) {
	const sorted = [...participants].sort((a, b) => b.ayahs_read - a.ayahs_read)
	const topScore = sorted[0]?.ayahs_read ?? 0

	return (
		<div className="w-full max-w-md flex flex-col gap-3">
			{sorted.map((p) => {
				const isTop = p.ayahs_read === topScore && topScore > 0
				return (
					<div
						key={p.id}
						className={`rounded-xl px-4 py-3 flex items-center justify-between ${
							isTop
								? 'bg-emerald-900/40 border border-emerald-600'
								: 'bg-stone-800 border border-stone-700'
						}`}
					>
						<div className="flex flex-col">
							<span className="text-stone-300 text-sm font-medium truncate">
								{isTop ? '👑 ' : ''}{p.display_name}
							</span>
							<span className="text-stone-500 text-xs">pts</span>
						</div>
						<span className={`text-3xl font-bold ${isTop ? 'text-emerald-400' : 'text-stone-300'}`}>
							{p.ayahs_read}
						</span>
					</div>
				)
			})}
		</div>
	)
}
