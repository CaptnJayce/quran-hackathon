import type { Participant } from '../../types/room'

interface Props {
	participant: Participant
	isHost: boolean
}

export function ParticipantCard({ participant, isHost }: Props) {
	return (
		<div className="flex items-center gap-3 px-4 py-3 bg-stone-800 rounded-xl">
			<div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold">
				{participant.display_name.charAt(0).toUpperCase()}
			</div>
			<span className="flex-1">{participant.display_name}</span>
			{isHost && (
				<span className="text-xs text-emerald-400 font-medium">Host</span>
			)}
		</div>
	)
}
