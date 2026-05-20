import { useState, useEffect, useRef } from 'react'

export function useAudio(url: string | null) {
	const [isPlaying, setIsPlaying] = useState(false)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		return () => {
			audioRef.current?.pause()
			audioRef.current = null
		}
	}, [url])

	function play() {
		if (!url) return
		if (audioRef.current) {
			audioRef.current.pause()
		}
		const audio = new Audio(url)
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
