import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Room, Participant, TurnState } from '../types/room'

export function useRoom(roomId: string | undefined) {
	const [room, setRoom] = useState<Room | null>(null)
	const [participants, setParticipants] = useState<Participant[]>([])
	const [turnState, setTurnState] = useState<TurnState | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!roomId) return

		// Initial load
		Promise.all([
			supabase.from('rooms').select('*').eq('id', roomId).single(),
			supabase.from('participants').select('*').eq('room_id', roomId).order('turn_order'),
			supabase.from('turn_state').select('*').eq('room_id', roomId).single(),
		]).then(([roomRes, participantsRes, turnRes]) => {
			if (roomRes.error) setError(roomRes.error.message)
			else setRoom(roomRes.data)

			if (participantsRes.data) setParticipants(participantsRes.data)
			if (turnRes.data) setTurnState(turnRes.data)
		})

		// Realtime subscription on turn_state
		const channel = supabase
			.channel(`room:${roomId}`)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'turn_state', filter: `room_id=eq.${roomId}` },
				(payload) => setTurnState(payload.new as TurnState)
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
				(payload) => setRoom(payload.new as Room)
			)
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` },
				(payload) => setParticipants((prev) => [...prev, payload.new as Participant].sort((a, b) => a.turn_order - b.turn_order))
			)
			.subscribe()

		return () => { supabase.removeChannel(channel) }
	}, [roomId])

	return { room, participants, turnState, error }
}
