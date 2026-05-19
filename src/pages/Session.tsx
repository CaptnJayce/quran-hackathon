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
	const { room, participants, turnState, loaded } = useRoom(id)
	const { currentParticipant, advanceTurn, skipVote, markAudioPlayed } = useTurn(id, participants, turnState)
	const { ayahs, isLoading } = useAyah(room?.surah_id ?? null, room?.juz_number ?? null)
	const { meaning, isLoading: wordLensLoading, fetchMeaning, clear } = useWordLens()
	const [showTranslation, setShowTranslation] = useState(false)

	const currentAyahIndex = (turnState?.current_ayah ?? 1) - 1
	const currentAyah = ayahs[currentAyahIndex] ?? null
	const isMyTurn = user?.sub === currentParticipant?.user_sub

	useEffect(() => {
		if (room?.status === 'complete') {
			navigate(`/summary/${id}`)
		}
	}, [room?.status, id, navigate])

	useEffect(() => {
		if (!loaded || !user) return
		const isParticipant = participants.some((p) => p.user_sub === user.sub)
		if (!isParticipant) navigate('/')
	}, [loaded, user, participants, navigate])

	useEffect(() => {
		if (!loaded || !turnState) return
		if (!currentParticipant && participants.length > 0) {
			advanceTurn(ayahs.length, () => navigate(`/summary/${id}`))
		}
	}, [loaded, currentParticipant, participants, turnState, advanceTurn, ayahs.length, id, navigate])

	const roomLoaded = loaded && room !== null
	const selectionMade = !!(room?.surah_id || room?.juz_number)
	const ayahsReady = !isLoading && ayahs.length > 0

	if (!roomLoaded || (selectionMade && !ayahsReady)) {
		const loadingMsg = room?.juz_number === 31
			? 'Loading Whole Quran — this may take a moment...'
			: 'Loading...'
		return (
			<div className="min-h-screen text-ink-muted flex flex-col items-center justify-center gap-3">
				<div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
				<p className="text-sm">{loadingMsg}</p>
			</div>
		)
	}

	if (!currentAyah) {
		return (
			<div className="min-h-screen text-ink-muted flex flex-col items-center justify-center gap-4 px-4 text-center">
				<p className="text-lg">No reading was selected for this session.</p>
					<button
						onClick={() => navigate('/')}
						className="px-4 py-2 bg-surface hover:brightness-95 text-ink rounded-lg text-sm transition-colors cursor-pointer"
				>
					Return home
				</button>
			</div>
		)
	}

	return (
		<div className="min-h-screen text-ink flex flex-col">
			<ProgressBar current={turnState?.current_ayah ?? 1} total={ayahs.length} />

			<div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
				<TurnIndicator participants={participants} currentTurnId={turnState?.current_turn ?? ''} />

				<AyahDisplay
					ayah={currentAyah}
					readerName={currentParticipant?.display_name ?? ''}
					onWordTap={(word) => fetchMeaning(word, currentAyah.verse_key)}
				/>

				{showTranslation && (
					<TranslationPanel text={currentAyah.translations?.[0]?.text ?? 'Translation not available.'} />
				)}
			</div>

			<div className="flex flex-col gap-3 px-4 pb-8">
				<div className="flex justify-between items-center">
					<button
						onClick={() => setShowTranslation((v) => !v)}
						className="text-sm text-ink-faint hover:text-ink transition-colors cursor-pointer"
					>
						{showTranslation ? 'Hide' : 'Show'} Translation
					</button>
					<AudioControls
						verseKey={currentAyah.verse_key}
						onPlay={markAudioPlayed}
					/>
				</div>

				{isMyTurn && (
					<DoneButton onDone={() => advanceTurn(ayahs.length, () => navigate(`/summary/${id}`))} />
				)}
				{!isMyTurn && currentParticipant && user && (
					<button
						onClick={() => skipVote(user.sub, () => navigate(`/summary/${id}`))}
						disabled={turnState?.skip_voted_by?.includes(user.sub)}
						className="w-full py-2 text-sm text-ink-faint hover:text-ink border border-border hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer"
					>
						Vote to Skip ({turnState?.skip_votes ?? 0}/{Math.ceil(participants.length / 2)} needed)
					</button>
				)}
			</div>

			{(meaning || wordLensLoading) && (
				<WordLens meaning={meaning} isLoading={wordLensLoading} onClose={clear} />
			)}
		</div>
	)
}
