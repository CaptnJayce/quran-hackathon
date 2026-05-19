import type { Participant } from '../../types/room'

interface Props {
	participant: Participant
	isHost: boolean
}

export function ParticipantCard({ participant, isHost }: Props) {
	return (
		<div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl">
			<div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-white">
				{participant.display_name.charAt(0).toUpperCase()}
			</div>
			<span className="flex-1 text-ink">{participant.display_name}</span>
			{isHost && (
				<span className="text-xs text-accent font-medium">Host</span>
			)}
		</div>
	)
}
