import { HeroSection } from '../components/home/HeroSection'
import { LoginButton } from '../components/home/LoginButton'
import { JoinForm } from '../components/home/JoinForm'
import { FeatureHighlights } from '../components/home/FeatureHighlights'
import { TeamSection } from '../components/home/TeamSection'
import { useAuth } from '../auth/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Home() {
	const { user } = useAuth()
	const navigate = useNavigate()

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

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between px-4 py-10 gap-6">
			<div className="flex flex-col items-center gap-6 w-full">
				<HeroSection />
				<FeatureHighlights />
			</div>

			{user ? (
				<div className="flex flex-col gap-4 w-full max-w-sm">
					<p className="text-center text-zinc-400 text-sm">Salaam, {user.displayName}</p>
					<button
						onClick={createRoom}
						className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold transition-colors"
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
