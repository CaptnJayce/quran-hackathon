import { useAudio } from '../../hooks/useAudio'
import { getAudioUrlForAyah } from '../../lib/quranApi'

interface Props {
	verseKey: string | null
	onPlay?: () => void
}

export function AudioControls({ verseKey, onPlay }: Props) {
	const url = verseKey ? getAudioUrlForAyah(verseKey) : null
	const { isPlaying, play, stop } = useAudio(url)

	function handlePlay() {
		play()
		onPlay?.()
	}

	if (!verseKey) return null

	return (
		<button
			onClick={isPlaying ? stop : handlePlay}
			className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200 transition-colors"
		>
			{isPlaying ? (
				<>
					<span className="w-4 h-4 flex items-center justify-center">⏸</span>
					Pause recitation
				</>
			) : (
				<>
					<span className="w-4 h-4 flex items-center justify-center">▶</span>
					Play recitation
				</>
			)}
		</button>
	)
}
