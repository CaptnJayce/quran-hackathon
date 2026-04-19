import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useAuth } from '../auth/AuthProvider'
import { SurahSelector } from '../components/lobby/SurahSelector'
import { JuzSelector } from '../components/lobby/JuzSelector'
import { ParticipantCard } from '../components/lobby/ParticipantCard'
import { InviteLink } from '../components/lobby/InviteLink'
import { StartButton } from '../components/lobby/StartButton'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { getSurah } from '../lib/quranApi'

export function Lobby() {
	const { id } = useParams<{ id: string }>()
	const { user } = useAuth()
	const navigate = useNavigate()
	const { room, participants, error } = useRoom(id)
	const [surahName, setSurahName] = useState<string | null>(null)

	useEffect(() => {
		if (room?.surah_id) {
			getSurah(room.surah_id).then((s) => setSurahName(s.name_simple)).catch(() => setSurahName(`Surah ${room.surah_id}`))
		} else {
			setSurahName(null)
		}
	}, [room?.surah_id])

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

	async function leaveRoom() {
		if (!id || !user) return
		if (user.sub === room?.host_id) {
			await supabase.from('rooms').update({ status: 'complete' }).eq('id', id)
		} else {
			await supabase.from('participants').delete().eq('room_id', id).eq('user_sub', user.sub)
		}
		navigate('/')
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
		navigate(`/session/${id}`)
	}

	if (error) return <div className="p-8 text-red-400">Error: {error}</div>
	if (!room) return <div className="p-8 text-stone-400">Loading...</div>

	const isHost = user?.sub === room.host_id

	return (
		<div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center px-4 py-8 gap-6">
			<div className="w-full max-w-md flex items-center justify-between">
				<h1 className="text-2xl font-bold">Waiting Room</h1>
				<button
					onClick={leaveRoom}
					className="text-sm text-stone-500 hover:text-red-400 transition-colors"
				>
					{isHost ? 'Cancel Room' : 'Leave'}
				</button>
			</div>
			<InviteLink code={room.code} />

			{isHost ? (
				<div className="w-full max-w-md flex flex-col gap-4">
					<SurahSelector selected={room.surah_id} onSelect={selectSurah} />
					<JuzSelector selected={room.juz_number} onSelect={selectJuz} />
				</div>
			) : (room.surah_id || room.juz_number) ? (
				<div className="w-full max-w-md px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-300 text-sm text-center">
					{room.surah_id
						? `Reading: ${surahName ?? `Surah ${room.surah_id}`}`
						: `Reading: Juz ${room.juz_number}`}
				</div>
			) : (
				<div className="w-full max-w-md px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-500 text-sm text-center">
					Waiting for host to select a surah or juz...
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
