import { useState, useEffect } from 'react'
import { getAudioForChapter } from '../lib/quranApi'
import { playAudio, stopAudio } from '../lib/audioPlayer'

export function useAudio(surahId: number | null, autoPlay: boolean, onEnded?: () => void) {
	const [audioUrl, setAudioUrl] = useState<string | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)

	useEffect(() => {
		if (!surahId) return
		getAudioForChapter(surahId)
			.then((file) => setAudioUrl(file.url))
			.catch(console.error)
		return () => stopAudio()
	}, [surahId])

	function play() {
		if (!audioUrl) return
		setIsPlaying(true)
		playAudio(audioUrl, () => {
			setIsPlaying(false)
			onEnded?.()
		})
	}

	function stop() {
		stopAudio()
		setIsPlaying(false)
	}

	useEffect(() => {
		if (autoPlay && audioUrl) play()
	}, [autoPlay, audioUrl])

	return { isPlaying, play, stop, audioUrl }
}
