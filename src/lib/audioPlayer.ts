let audio: HTMLAudioElement | null = null

export function playAudio(url: string, onEnded?: () => void): HTMLAudioElement {
	if (audio) {
		audio.pause()
		audio.src = ''
	}
	audio = new Audio(url)
	if (onEnded) audio.addEventListener('ended', onEnded, { once: true })
	audio.play().catch(console.error)
	return audio
}

export function pauseAudio() {
	audio?.pause()
}

export function stopAudio() {
	if (audio) {
		audio.pause()
		audio.src = ''
		audio = null
	}
}

export function preloadAudio(url: string) {
	const preload = new Audio()
	preload.preload = 'auto'
	preload.src = url
}
