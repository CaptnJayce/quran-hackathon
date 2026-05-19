import { FiBookOpen, FiUsers, FiSearch } from 'react-icons/fi'

const features = [
	{
		icon: <FiBookOpen className="w-5 h-5" />,
		title: 'Read in turns',
		description: 'You get an ayah, then pass it on. Nobody watches while one person does all the work.',
	},
	{
		icon: <FiUsers className="w-5 h-5" />,
		title: 'Keep each other honest',
		description: "Your streak belongs to the whole circle. One person can't carry it alone, that's kind of the point.",
	},
	{
		icon: <FiSearch className="w-5 h-5" />,
		title: 'Look up any word',
		description: 'Tap a word to see what it means. Arabic, transliteration, root. No app-switching, no losing your place.',
	},
]

export function FeatureHighlights() {
	return (
		<div className="w-full max-w-sm flex flex-col gap-3">
			{features.map((f) => (
				<div key={f.title} className="flex items-start gap-3 bg-surface border border-border rounded-xl px-4 py-3">
					<div className="text-accent mt-0.5 shrink-0">{f.icon}</div>
					<div>
						<p className="text-ink text-sm font-medium">{f.title}</p>
						<p className="text-ink-faint text-xs leading-relaxed mt-0.5">{f.description}</p>
					</div>
				</div>
			))}
		</div>
	)
}
