import { useState, useEffect, useRef } from 'react'
import { stopAudio } from '../lib/audioPlayer'

export function useAudio(url: string | null) {
	const [isPlaying, setIsPlaying] = useState(false)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		return () => { stopAudio() }
	}, [url])

	function play() {
		if (!url) return
		if (audioRef.current) {
			audioRef.current.pause()
		}
		const audio = new Audio(url)
		audio.crossOrigin = 'anonymous'
		audioRef.current = audio
		audio.onended = () => setIsPlaying(false)
		audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
	}

	function stop() {
		audioRef.current?.pause()
		audioRef.current = null
		setIsPlaying(false)
	}

	return { isPlaying, play, stop }
}
