import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useTurn } from '../hooks/useTurn'
import { useAyah } from '../hooks/useAyah'
import { useWordLens } from '../hooks/useWordLens'
import { useAuth } from '../auth/AuthProvider'
import { AyahDisplay } from '../components/session/AyahDisplay'
import { TurnIndicator } from '../components/session/TurnIndicator'
import { TranslationPanel } from '../components/session/TranslationPanel'
import { AudioControls } from '../components/session/AudioControls'
import { WordLens } from '../components/session/WordLens'
import { ProgressBar } from '../components/session/ProgressBar'
import { DoneButton } from '../components/session/DoneButton'
import { useEffect, useState } from 'react'

export function Session() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { user } = useAuth()
	const { room, participants, turnState } = useRoom(id)
	const { currentParticipant, advanceTurn, markAudioPlayed } = useTurn(id, participants, turnState)
	const { ayahs, isLoading } = useAyah(room?.surah_id ?? null, room?.juz_number ?? null)
	const { meaning, isLoading: lensLoading, fetchMeaning, clear } = useWordLens()
	const [showTranslation, setShowTranslation] = useState(false)

	const currentAyahIndex = (turnState?.current_ayah ?? 1) - 1
	const currentAyah = ayahs[currentAyahIndex] ?? null
	const isMyTurn = user?.sub === currentParticipant?.user_sub

	useEffect(() => {
		if (room?.status === 'complete') {
			navigate(`/summary/${id}`)
		}
	}, [room?.status, id, navigate])

	if (isLoading || !currentAyah) {
		return <div className="min-h-screen bg-stone-950 text-stone-400 flex items-center justify-center">Loading...</div>
	}

	return (
		<div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
			<ProgressBar current={turnState?.current_ayah ?? 1} total={ayahs.length} />

			<div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
				<TurnIndicator participants={participants} currentTurnId={turnState?.current_turn ?? ''} />

				<AyahDisplay
					ayah={currentAyah}
					readerName={currentParticipant?.display_name ?? ''}
					onWordTap={(wordPosition) => {
						const [surahStr, ayahStr] = currentAyah.verse_key.split(':')
						fetchMeaning(Number(surahStr), Number(ayahStr), wordPosition)
					}}
				/>

				{showTranslation && currentAyah.translations[0] && (
					<TranslationPanel text={currentAyah.translations[0].text} />
				)}
			</div>

			<div className="flex flex-col gap-3 px-4 pb-8">
				<div className="flex justify-between items-center">
					<button
						onClick={() => setShowTranslation((v) => !v)}
						className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
					>
						{showTranslation ? 'Hide' : 'Show'} Translation
					</button>
					<AudioControls
						surahId={room?.surah_id ?? null}
						onEnded={markAudioPlayed}
					/>
				</div>

				{isMyTurn && (
					<DoneButton onDone={() => advanceTurn(ayahs.length, () => navigate(`/summary/${id}`))} />
				)}
			</div>

			{meaning && (
				<WordLens meaning={meaning} isLoading={lensLoading} onClose={clear} />
			)}
		</div>
	)
}
