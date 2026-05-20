export interface Room {
	id: string
	code: string
	host_id: string
	surah_id: number | null
	juz_number: number | null
	status: 'lobby' | 'active' | 'complete'
	created_at: string
}

export interface Participant {
	id: string
	room_id: string
	user_sub: string
	display_name: string
	turn_order: number
	ayahs_read: number
	points: number
	joined_at: string
}

export interface TurnState {
	room_id: string
	current_ayah: number
	current_turn: string // participant id
	audio_played: boolean
	skip_votes: number
	skip_voted_by: string[]
	ahsanta_votes: string[]
	ahsanta_count: number
	no_skip_counter: number
	popup_data: { amount: number; reason: string; name: string }[] | null
	updated_at: string
}
