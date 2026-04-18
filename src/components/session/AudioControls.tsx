import { useEffect } from 'react'
import { useAudio } from '../../hooks/useAudio'

interface Props {
	surahId: number | null
	audioPlayed: boolean
	onPlay: () => void
}

export function AudioControls({ surahId, audioPlayed, onPlay }: Props) {
	const { isPlaying, play, stop, audioUrl } = useAudio(surahId, false)

	useEffect(() => {
		if (audioPlayed && !isPlaying && audioUrl) play()
		if (!audioPlayed && isPlaying) stop()
	}, [audioPlayed, audioUrl])

	function handlePlay() {
		if (!audioUrl) return
		play()
		onPlay()
	}

	if (!surahId) return null

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
