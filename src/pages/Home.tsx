import { HeroSection } from '../components/home/HeroSection'
import { LoginButton } from '../components/home/LoginButton'
import { JoinForm } from '../components/home/JoinForm'
import { FeatureHighlights } from '../components/home/FeatureHighlights'
import { TeamSection } from '../components/home/TeamSection'
import { useAuth } from '../auth/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useState } from 'react'

export function Home() {
	const { user, devLogin, isLoading } = useAuth()
	const navigate = useNavigate()
	const [devName, setDevName] = useState('')

	async function createRoom() {
		if (!user) return
		const code = Math.random().toString(36).slice(2, 8).toUpperCase()

		const { data: room, error } = await supabase
			.from('rooms')
			.insert({ code, host_id: user.sub, status: 'lobby' })
			.select()
			.single()

		if (error || !room) {
			console.error('Failed to create room:', error)
			return
		}

		await supabase.from('participants').insert({
			room_id: room.id,
			user_sub: user.sub,
			display_name: user.displayName,
			turn_order: 0,
		})

		navigate(`/room/${room.id}`)
	}

	if (isLoading) return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
		</div>
	)

	return (
		<div className="min-h-screen text-stone-800 flex flex-col items-center justify-between px-4 py-10 gap-6">
			<div className="flex flex-col items-center gap-6 w-full">
				<HeroSection />
				<FeatureHighlights />
			</div>

			{import.meta.env.DEV && !user && (
				<div className="flex gap-2 w-full max-w-sm">
					<input
						value={devName}
						onChange={(e) => setDevName(e.target.value)}
						placeholder="Dev name"
						className="flex-1 px-3 py-2 bg-white/70 border border-amber-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
					/>
					<button
						onClick={() => devName && devLogin(devName)}
						className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-colors"
					>
						Dev Login
					</button>
				</div>
			)}

			{user ? (
				<div className="flex flex-col gap-4 w-full max-w-sm">
					<p className="text-center text-stone-500 text-sm">Salaam, {user.displayName}</p>
					<button
						onClick={createRoom}
						className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold transition-colors text-white"
					>
						Create a Circle
					</button>
					<JoinForm />
				</div>
			) : (
				<div className="flex flex-col gap-4 w-full max-w-sm">
					<LoginButton />
					<JoinForm />
				</div>
			)}

			<TeamSection />
		</div>
	)
}
