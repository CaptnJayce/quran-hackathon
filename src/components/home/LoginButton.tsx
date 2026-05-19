import { useState } from 'react'
import { redirectToLogin } from '../../auth/oauth'
import { useAuth } from '../../auth/AuthProvider'

export function LoginButton() {
	const { devLogin } = useAuth()
	const isDev = import.meta.env.DEV
	const [name, setName] = useState('')

	if (isDev) {
		return (
			<div className="flex gap-2">
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Your name"
					className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-accent"
					onKeyDown={(e) => e.key === 'Enter' && name.trim() && devLogin(name.trim())}
				/>
				<button
					onClick={() => name.trim() && devLogin(name.trim())}
					className="px-4 py-3 bg-accent hover:brightness-110 rounded-xl font-semibold transition-colors text-white"
				>
					Dev Login
				</button>
			</div>
		)
	}

	return (
		<button
			onClick={redirectToLogin}
			className="w-full py-3 bg-accent hover:brightness-110 rounded-xl font-semibold transition-colors text-white"
		>
			Sign in with Quran Foundation
		</button>
	)
}
