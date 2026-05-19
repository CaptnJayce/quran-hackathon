import type { Participant } from '../../types/room'

interface Props {
	participants: Participant[]
	currentTurnId: string
}

export function TurnIndicator({ participants, currentTurnId }: Props) {
	return (
		<div className="flex gap-3 flex-wrap justify-center">
			{participants.map((p) => {
				const isActive = p.id === currentTurnId
				return (
					<div
						key={p.id}
						className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'scale-110' : 'opacity-50'}`}
					>
						<div
							className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
								isActive ? 'border-emerald-500 bg-emerald-100 text-emerald-800' : 'border-amber-200/80 bg-white/70 text-stone-600'
							}`}
						>
							{p.display_name.charAt(0).toUpperCase()}
						</div>
						<span className="text-xs text-stone-500 max-w-[4rem] truncate">{p.display_name}</span>
					</div>
				)
			})}
		</div>
	)
}
