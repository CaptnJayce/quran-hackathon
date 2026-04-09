import { useAudio } from '../../hooks/useAudio'

interface Props {
	surahId: number | null
	onEnded?: () => void
}

export function AudioControls({ surahId, onEnded }: Props) {
	const { isPlaying, play, stop } = useAudio(surahId, false, onEnded)

	if (!surahId) return null

	return (
		<button
			onClick={isPlaying ? stop : play}
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
