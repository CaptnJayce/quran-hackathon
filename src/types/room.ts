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
	joined_at: string
}

export interface TurnState {
	room_id: string
	current_ayah: number
	current_turn: string // participant id
	audio_played: boolean
	updated_at: string
}
