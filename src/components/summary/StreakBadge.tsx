export function StreakBadge({ streak }: { streak: number }) {
	return (
		<div className="flex items-center gap-3 px-6 py-4 bg-amber-100 border border-amber-300 rounded-2xl">
			<span className="text-3xl">🔥</span>
			<div>
				<p className="font-bold text-amber-800 text-lg">{streak}-day streak</p>
				<p className="text-stone-500 text-sm">Keep it going</p>
			</div>
		</div>
	)
}
