export function StreakBadge({ streak }: { streak: number }) {
	return (
		<div className="flex items-center gap-3 px-6 py-4 bg-amber-900/30 border border-amber-700/50 rounded-2xl">
			<span className="text-3xl">🔥</span>
			<div>
				<p className="font-bold text-amber-400 text-lg">{streak}-day streak</p>
				<p className="text-stone-400 text-sm">Keep it going</p>
			</div>
		</div>
	)
}
