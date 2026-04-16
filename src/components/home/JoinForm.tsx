import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function JoinForm() {
	const [code, setCode] = useState('')
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()

	async function handleJoin(e: React.FormEvent) {
		e.preventDefault()
		setError(null)

		const { data: room } = await supabase
			.from('rooms')
			.select('id, status')
			.eq('code', code.toUpperCase())
			.single()

		if (!room) {
			setError('Room not found. Check the code and try again.')
			return
		}

		if (room.status === 'complete') {
			setError('That session has already ended.')
			return
		}

		navigate(`/room/${room.id}`)
	}

	return (
		<form onSubmit={handleJoin} className="flex flex-col gap-2">
			<input
				value={code}
				onChange={(e) => setCode(e.target.value)}
				placeholder="Enter room code (e.g. BQRS71)"
				maxLength={6}
				className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-lg font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans focus:outline-none focus:border-emerald-500"
			/>
			{error && <p className="text-red-400 text-sm text-center">{error}</p>}
			<button
				type="submit"
				disabled={code.length < 6}
				className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 rounded-xl font-semibold transition-colors"
			>
				Join Circle
			</button>
		</form>
	)
}
