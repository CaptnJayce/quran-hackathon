import { useNavigate } from 'react-router-dom'

export function NextSessionCTA({ roomCode }: { roomCode: string }) {
	const navigate = useNavigate()

	return (
		<div className="flex flex-col items-center gap-3 w-full max-w-md">
			<button
				onClick={() => navigate('/')}
				className="w-full py-3 bg-stone-700 hover:bg-stone-600 rounded-xl font-semibold transition-colors"
			>
				Start a new circle
			</button>
			<p className="text-stone-500 text-xs">Room code: {roomCode}</p>
		</div>
	)
}
