import type { Participant } from './room'

export interface ParticipantStats {
	participant: Participant
	ayahs_read: number
}

export interface SessionSummary {
	room_id: string
	surah_id: number | null
	juz_number: number | null
	total_ayahs: number
	participants: ParticipantStats[]
	group_streak: number
	completed_at: string
}
