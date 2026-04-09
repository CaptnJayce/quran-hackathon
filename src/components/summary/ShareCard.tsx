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
		<div className="w-full max-w-md bg-stone-800 rounded-2xl p-5 flex flex-col gap-4">
			<p className="text-stone-300 text-sm leading-relaxed">{text}</p>
			<button
				onClick={share}
				className="py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold transition-colors"
			>
				{copied ? 'Copied!' : 'Share'}
			</button>
		</div>
	)
}
