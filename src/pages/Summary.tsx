import { useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useStreak } from '../hooks/useStreak'
import { StatsGrid } from '../components/summary/StatsGrid'
import { StreakBadge } from '../components/summary/StreakBadge'
import { ShareCard } from '../components/summary/ShareCard'
import { NextSessionCTA } from '../components/summary/NextSessionCTA'
import { useEffect } from 'react'

export function Summary() {
	const { id } = useParams<{ id: string }>()
	const { room, participants } = useRoom(id)
	const { streak, fetchStreak, recordStreak } = useStreak()

	useEffect(() => {
		recordStreak()
		fetchStreak()
	}, [])

	if (!room) return <div className="min-h-screen bg-stone-950 text-stone-400 flex items-center justify-center">Loading...</div>

	return (
		<div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center px-4 py-10 gap-8">
			<div className="text-center">
				<p className="text-stone-400 text-sm mb-1">Session complete</p>
				<h1 className="text-3xl font-bold">JazakAllahu Khairan</h1>
			</div>

			<StatsGrid participants={participants} />
			{streak !== null && <StreakBadge streak={streak} />}
			<ShareCard participants={participants} surahId={room.surah_id} juzNumber={room.juz_number} />
			<NextSessionCTA roomCode={room.code} />
		</div>
	)
}
