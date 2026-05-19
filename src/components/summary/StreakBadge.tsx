export function StreakBadge({ streak }: { streak: number }) {
	return (
		<div className="flex items-center gap-3 px-6 py-4 bg-surface-raised border border-border rounded-2xl">
			<span className="text-3xl">🔥</span>
			<div>
				<p className="font-bold text-ink text-lg">{streak}-day streak</p>
				<p className="text-ink-muted text-sm">Keep it going</p>
			</div>
		</div>
	)
}
