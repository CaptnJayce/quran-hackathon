import type { Participant } from '../../types/room'

export function StatsGrid({ participants }: { participants: Participant[] }) {
	const sorted = [...participants].sort((a, b) => b.points - a.points)
	const topScore = sorted[0]?.points ?? 0

	return (
		<div className="w-full max-w-md flex flex-col gap-3">
			{sorted.map((p) => {
				const isTop = p.points === topScore && topScore > 0
				return (
					<div
						key={p.id}
						className={`rounded-xl px-4 py-3 flex items-center justify-between ${
							isTop
								? 'bg-accent-bg/50 border border-accent'
								: 'bg-surface border border-border'
						}`}
					>
						<div className="flex flex-col">
							<span className="text-ink text-sm font-medium truncate">
								{isTop ? '👑 ' : ''}{p.display_name}
							</span>
							<span className="text-ink-muted text-xs">pts</span>
						</div>
						<span className={`text-3xl font-bold ${isTop ? 'text-accent' : 'text-ink'}`}>
							{p.points}
						</span>
					</div>
				)
			})}
		</div>
	)
}
