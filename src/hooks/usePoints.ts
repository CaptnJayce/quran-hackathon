import { supabase } from '../lib/supabase'

export function usePoints(roomId: string | undefined) {
	async function addPoints(participantId: string, amount: number, reason: string): Promise<void> {
		if (!roomId) return

		const { data: current } = await supabase
			.from('participants')
			.select('points')
			.eq('id', participantId)
			.maybeSingle()

		const currentPoints = current?.points ?? 0

		await Promise.all([
			supabase.from('points').insert({
				participant_id: participantId,
				room_id: roomId,
				amount,
				reason,
			}),
			supabase
				.from('participants')
				.update({ points: currentPoints + amount })
				.eq('id', participantId),
		])
	}

	return { addPoints }
}
