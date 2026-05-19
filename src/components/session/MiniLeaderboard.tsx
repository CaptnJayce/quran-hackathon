import type { Participant } from '../../types/room'

export function MiniLeaderboard({ participants, streakPlayers }: { participants: Participant[]; streakPlayers: Set<string> }) {
	const sorted = [...participants].sort((a, b) => b.points - a.points)

	return (
		<div className="fixed top-4 left-4 z-10 min-w-[200px] bg-surface/90 backdrop-blur-sm border border-border rounded-xl px-5 py-3 shadow-lg">
			<div className="flex flex-col gap-1.5">
				{sorted.map((p, i) => (
					<div key={p.id} className="flex items-center gap-2">
						<span className={`text-sm font-bold tabular-nums ${i === 0 ? 'text-accent' : 'text-ink-muted'}`}>
							{p.points}
						</span>
						<span className="text-sm text-ink truncate">
							{i === 0 ? '👑 ' : ''}{p.display_name}{streakPlayers.has(p.id) ? ' - ماشاءالله' : ''}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
