import type { Participant } from '../../types/room'

export function StatsGrid({ participants }: { participants: Participant[] }) {
	return (
		<div className="w-full max-w-md grid grid-cols-2 gap-3">
			{participants.map((p) => (
				<div key={p.id} className="bg-surface rounded-xl px-4 py-3 flex flex-col">
					<span className="text-ink-muted text-sm truncate">{p.display_name}</span>
					<span className="text-2xl font-bold text-accent">{p.ayahs_read}</span>
					<span className="text-ink-faint text-xs">ayahs read</span>
				</div>
			))}
		</div>
	)
}
