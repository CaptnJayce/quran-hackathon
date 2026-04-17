import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../auth/AuthProvider'

export function JoinForm() {
	const [code, setCode] = useState('')
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()
	const { user } = useAuth()

	async function handleJoin(e: React.FormEvent) {
		e.preventDefault()
		setError(null)

		if (!user) {
			setError('You must be signed in to join a circle.')
			return
		}

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

		const { count } = await supabase
			.from('participants')
			.select('*', { count: 'exact', head: true })
			.eq('room_id', room.id)

		await supabase.from('participants').insert({
			room_id: room.id,
			user_sub: user.sub,
			display_name: user.displayName,
			turn_order: count ?? 0,
		})

		navigate(`/room/${room.id}`)
	}

	return (
		<form onSubmit={handleJoin} className="flex flex-col gap-2">
			<input
				value={code}
				onChange={(e) => setCode(e.target.value)}
				placeholder="Enter room code (e.g. BQRS71)"
				maxLength={6}
				className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-center text-lg font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans focus:outline-none focus:border-emerald-500"
			/>
			{error && <p className="text-red-400 text-sm text-center">{error}</p>}
			<button
				type="submit"
				disabled={code.length < 6}
				className="w-full py-3 bg-stone-700 hover:bg-stone-600 disabled:opacity-40 rounded-xl font-semibold transition-colors"
			>
				Join Circle
			</button>
		</form>
	)
}
