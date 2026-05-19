import { useNavigate } from 'react-router-dom'

export function NextSessionCTA({ roomCode }: { roomCode: string }) {
	const navigate = useNavigate()

	return (
		<div className="flex flex-col items-center gap-3 w-full max-w-md">
			<button
				onClick={() => navigate('/')}
				className="w-full py-3 bg-surface-raised hover:brightness-110 rounded-xl font-semibold transition-colors text-ink cursor-pointer"
			>
				Start a new circle
			</button>
			<p className="text-ink-faint text-xs">Room code: {roomCode}</p>
		</div>
	)
}
