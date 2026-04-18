import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Room, Participant, TurnState } from '../types/room'

const POLL_INTERVAL = 3000

export function useRoom(roomId: string | undefined) {
	const [room, setRoom] = useState<Room | null>(null)
	const [participants, setParticipants] = useState<Participant[]>([])
	const [turnState, setTurnState] = useState<TurnState | null>(null)
	const [loaded, setLoaded] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

	async function fetchAll() {
		if (!roomId) return
		const [roomRes, participantsRes, turnRes] = await Promise.all([
			supabase.from('rooms').select('*').eq('id', roomId).maybeSingle(),
			supabase.from('participants').select('*').eq('room_id', roomId).order('turn_order'),
			supabase.from('turn_state').select('*').eq('room_id', roomId).maybeSingle(),
		])
		if (roomRes.error) setError(roomRes.error.message)
		else setRoom(roomRes.data)
		if (participantsRes.data) setParticipants(participantsRes.data)
		if (turnRes.data) setTurnState(turnRes.data)
	}

	useEffect(() => {
		if (!roomId) return

		fetchAll().then(() => setLoaded(true))

		// Polling fallback — keeps state fresh if WebSocket is unavailable
		pollRef.current = setInterval(fetchAll, POLL_INTERVAL)

		// Realtime subscription (best-effort on top of polling)
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
			.on(
				'postgres_changes',
				{ event: 'DELETE', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` },
				(payload) => setParticipants((prev) => prev.filter((p) => p.id !== (payload.old as Participant).id))
			)
			.subscribe()

		return () => {
			if (pollRef.current) clearInterval(pollRef.current)
			supabase.removeChannel(channel)
		}
	}, [roomId])

	return { room, participants, turnState, loaded, error }
}
