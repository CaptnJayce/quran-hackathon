import { supabase } from '../lib/supabase'
import type { Participant, TurnState } from '../types/room'

function getNextParticipant(participants: Participant[], currentTurnId: string): Participant {
	const idx = participants.findIndex((p) => p.id === currentTurnId)
	return participants[(idx + 1) % participants.length]
}

export function useTurn(roomId: string | undefined, participants: Participant[], turnState: TurnState | null) {
	const currentParticipant = participants.find((p) => p.id === turnState?.current_turn) ?? null

	async function advanceTurn(totalAyahs: number, onSessionEnd: () => void) {
		if (!roomId || !turnState) return

		const nextAyah = turnState.current_ayah + 1

		if (nextAyah > totalAyahs) {
			await supabase.from('rooms').update({ status: 'complete' }).eq('id', roomId)
			// Increment ayahs_read for current participant
			const current = participants.find((p) => p.id === turnState.current_turn)
			if (current) {
				await supabase
					.from('participants')
					.update({ ayahs_read: current.ayahs_read + 1 })
					.eq('id', current.id)
			}
			onSessionEnd()
			return
		}

		const next = getNextParticipant(participants, turnState.current_turn)

		// Increment ayahs_read for current reader
		const current = participants.find((p) => p.id === turnState.current_turn)
		if (current) {
			await supabase
				.from('participants')
				.update({ ayahs_read: current.ayahs_read + 1 })
				.eq('id', current.id)
		}

		await supabase
			.from('turn_state')
			.update({
				current_ayah: nextAyah,
				current_turn: next.id,
				audio_played: false,
				updated_at: new Date().toISOString(),
			})
			.eq('room_id', roomId)
	}

	async function markAudioPlayed() {
		if (!roomId) return
		await supabase.from('turn_state').update({ audio_played: true }).eq('room_id', roomId)
	}

	return { currentParticipant, advanceTurn, markAudioPlayed }
}
