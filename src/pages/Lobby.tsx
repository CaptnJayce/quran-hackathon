import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useAuth } from '../auth/AuthProvider'
import { SurahSelector } from '../components/lobby/SurahSelector'
import { JuzSelector } from '../components/lobby/JuzSelector'
import { ParticipantCard } from '../components/lobby/ParticipantCard'
import { InviteLink } from '../components/lobby/InviteLink'
import { StartButton } from '../components/lobby/StartButton'
import { supabase } from '../lib/supabase'
import { useEffect } from 'react'

export function Lobby() {
	const { id } = useParams<{ id: string }>()
	const { user } = useAuth()
	const navigate = useNavigate()
	const { room, participants, error } = useRoom(id)

	// Redirect when session goes active
	useEffect(() => {
		if (room?.status === 'active') {
			navigate(`/session/${id}`)
		}
	}, [room?.status, id, navigate])

	async function selectSurah(surahId: number) {
		if (!id) return
		await supabase.from('rooms').update({ surah_id: surahId, juz_number: null }).eq('id', id)
	}

	async function selectJuz(juzNumber: number) {
		if (!id) return
		await supabase.from('rooms').update({ juz_number: juzNumber, surah_id: null }).eq('id', id)
	}

	async function startSession() {
		if (!id || !room || !user || room.host_id !== user.sub) return

		// Init turn_state
		const firstParticipant = participants[0]
		if (!firstParticipant) return

		await supabase.from('turn_state').upsert({
			room_id: id,
			current_ayah: 1,
			current_turn: firstParticipant.id,
			audio_played: false,
			updated_at: new Date().toISOString(),
		})

		await supabase.from('rooms').update({ status: 'active' }).eq('id', id)
	}

	if (error) return <div className="p-8 text-red-400">Error: {error}</div>
	if (!room) return <div className="p-8 text-stone-400">Loading...</div>

	const isHost = user?.sub === room.host_id

	return (
		<div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center px-4 py-8 gap-6">
			<h1 className="text-2xl font-bold">Waiting Room</h1>
			<InviteLink code={room.code} />

			{isHost && (
				<div className="w-full max-w-md flex flex-col gap-4">
					<SurahSelector selected={room.surah_id} onSelect={selectSurah} />
					<JuzSelector selected={room.juz_number} onSelect={selectJuz} />
				</div>
			)}

			<div className="w-full max-w-md flex flex-col gap-2">
				<h2 className="text-stone-400 text-sm font-medium uppercase tracking-wide">Participants</h2>
				{participants.map((p) => (
					<ParticipantCard key={p.id} participant={p} isHost={p.user_sub === room.host_id} />
				))}
			</div>

			{isHost && (
				<StartButton
					disabled={!room.surah_id && !room.juz_number}
					onStart={startSession}
				/>
			)}
		</div>
	)
}
