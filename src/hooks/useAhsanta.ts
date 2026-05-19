import { supabase } from '../lib/supabase'
import type { TurnState } from '../types/room'

export function useAhsanta(roomId: string | undefined) {
	async function giveAhsanta(userSub: string, turnState: TurnState): Promise<void> {
		if (!roomId) return
		if (turnState.ahsanta_votes.includes(userSub)) return

		const newVoters = [...turnState.ahsanta_votes, userSub]

		await supabase
			.from('turn_state')
			.update({
				ahsanta_votes: newVoters,
				ahsanta_count: turnState.ahsanta_count + 1,
			})
			.eq('room_id', roomId)
	}

	return { giveAhsanta }
}
