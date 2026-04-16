const features = [
	{
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
				<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-4.14-3.36-7.5-7.5-7.5S4.5 7.86 4.5 12s3.36 7.5 7.5 7.5" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5M21 12a9 9 0 01-9 9" />
			</svg>
		),
		title: 'Read in turns',
		description: 'You get an ayah, then pass it on. Nobody watches while one person does all the work.',
	},
	{
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
				<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2" />
			</svg>
		),
		title: 'Keep each other honest',
		description: "Your streak belongs to the whole circle. One person can't carry it alone — that's kind of the point.",
	},
	{
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
				<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
			</svg>
		),
		title: 'Look up any word',
		description: 'Tap a word to see what it means. Arabic, transliteration, root. No app-switching, no losing your place.',
	},
]

export function FeatureHighlights() {
	return (
		<div className="w-full max-w-sm flex flex-col gap-3">
			{features.map((f) => (
				<div key={f.title} className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
					<div className="text-emerald-500 mt-0.5 shrink-0">{f.icon}</div>
					<div>
						<p className="text-zinc-200 text-sm font-medium">{f.title}</p>
						<p className="text-zinc-500 text-xs leading-relaxed mt-0.5">{f.description}</p>
					</div>
				</div>
			))}
		</div>
	)
}
