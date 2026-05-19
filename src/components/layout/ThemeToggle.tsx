import { useEffect, useState } from 'react'

const STORAGE_KEY = 'halaq-theme'

function getInitialTheme(): boolean {
	if (typeof window === 'undefined') return false
	const stored = localStorage.getItem(STORAGE_KEY)
	if (stored === 'dark') return true
	if (stored === 'light') return false
	return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeToggle() {
	const [dark, setDark] = useState(false)

	useEffect(() => {
		const initial = getInitialTheme()
		setDark(initial)
		document.documentElement.classList.toggle('dark', initial)
	}, [])

	function toggle() {
		const next = !dark
		setDark(next)
		document.documentElement.classList.toggle('dark', next)
		localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
	}

	return (
		<button
			onClick={toggle}
			className="w-9 h-9 flex items-center justify-center rounded-full bg-surface shadow-sm border border-border text-ink-faint hover:text-ink transition-colors"
			aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
		>
			{dark ? (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
			) : (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
					<path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
				</svg>
			)}
		</button>
	)
}
