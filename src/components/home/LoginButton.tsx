import { useState } from 'react'
import { useAuth } from '../../auth/AuthProvider'

export function LoginButton() {
	const { devLogin } = useAuth()
	const [name, setName] = useState('')

	return (
		<div className="flex gap-2">
			<input
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Your name"
				className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl focus:outline-none focus:border-emerald-500"
				onKeyDown={(e) => e.key === 'Enter' && name.trim() && devLogin(name.trim())}
			/>
			<button
				onClick={() => name.trim() && devLogin(name.trim())}
				className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold transition-colors"
			>
				Enter
			</button>
		</div>
	)
}
