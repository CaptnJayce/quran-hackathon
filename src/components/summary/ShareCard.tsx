import { useState } from 'react'
import type { Participant } from '../../types/room'

interface Props {
	participants: Participant[]
	surahId: number | null
	juzNumber: number | null
}

export function ShareCard({ participants, surahId, juzNumber }: Props) {
	const [copied, setCopied] = useState(false)

	const total = participants.reduce((sum, p) => sum + p.ayahs_read, 0)
	const sessionLabel = surahId ? `Surah ${surahId}` : `Juz ${juzNumber}`

	const text = `We just completed ${sessionLabel} together on Halaq — ${total} ayahs, ${participants.length} readers. Alhamdulillah 🤲 Join us: halaq.app`

	function share() {
		if (navigator.share) {
			navigator.share({ text })
		} else {
			navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}

	return (
		<div className="w-full max-w-md bg-surface rounded-2xl p-5 flex flex-col gap-4">
			<p className="text-ink-secondary text-sm leading-relaxed">{text}</p>
			<button
				onClick={share}
				className="py-3 bg-accent hover:brightness-110 rounded-xl font-semibold transition-colors text-white"
			>
				{copied ? 'Copied!' : 'Share'}
			</button>
		</div>
	)
}
