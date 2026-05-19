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
			<div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
		</div>
	)

	return (
		<div className="min-h-screen text-ink flex flex-col items-center justify-between px-4 py-10 gap-6">
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
						className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
					/>
					<button
						onClick={() => devName && devLogin(devName)}
						className="px-4 py-2 bg-accent hover:brightness-110 rounded-lg text-sm font-semibold transition-colors text-white"
					>
						Dev Login
					</button>
				</div>
			)}

			{user ? (
				<div className="flex flex-col gap-4 w-full max-w-sm">
					<p className="text-center text-ink-muted text-sm">Salaam, {user.displayName}</p>
					<button
						onClick={createRoom}
						className="w-full py-3 bg-accent hover:brightness-110 rounded-xl font-semibold transition-colors text-white"
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
