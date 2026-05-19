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
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { usePoints } from '../hooks/usePoints'
import { useAhsanta } from '../hooks/useAhsanta'
import { MiniLeaderboard } from '../components/session/MiniLeaderboard'
import { AhsantaButton } from '../components/session/AhsantaButton'

export function Session() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { user } = useAuth()
	const { room, participants, turnState, loaded } = useRoom(id)
	const { currentParticipant, advanceTurn: rawAdvanceTurn, skipVote, markAudioPlayed } = useTurn(id, participants, turnState)
	const { addPoints } = usePoints(id)
	const { giveAhsanta } = useAhsanta(id)
	const { ayahs, isLoading } = useAyah(room?.surah_id ?? null, room?.juz_number ?? null)
	const { meaning, isLoading: wordLensLoading, fetchMeaning, clear } = useWordLens()
	const [showTranslation, setShowTranslation] = useState(false)
	const [popupItems, setPopupItems] = useState<{ amount: number; reason: string; name: string }[]>([])
	const [streakPlayers, setStreakPlayers] = useState<Set<string>>(new Set())

	const advanceTurn = useCallback(async () => {
		if (!currentParticipant) return

		const hadAhsanta = (turnState?.ahsanta_count ?? 0) > 0
		const earnedStreak = (turnState?.no_skip_counter ?? 0) >= 2
		const reader = currentParticipant

		await rawAdvanceTurn(ayahs.length, () => navigate(`/summary/${id}`))

		await addPoints(reader.id, 1, 'read_ayah')
		new Audio('/sfx/point-low.mp3').play()

		const items: { amount: number; reason: string; name: string }[] = [{ amount: 1, reason: 'read_ayah', name: reader.display_name }]

		if (hadAhsanta) {
			await addPoints(reader.id, 1, 'ahsanta')
			setTimeout(() => new Audio('/sfx/point-medium.mp3').play(), 100)
			items.push({ amount: 1, reason: 'ahsanta', name: reader.display_name })
		}
		if (earnedStreak) {
			await addPoints(reader.id, 2, 'streak_bonus')
			setTimeout(() => new Audio('/sfx/point-high.mp3').play(), 200)
			items.push({ amount: 2, reason: 'streak_bonus', name: reader.display_name })
			setStreakPlayers((prev) => new Set(prev).add(reader.id))
		}

		setPopupItems(items)
	}, [currentParticipant, turnState, rawAdvanceTurn, ayahs.length, id, navigate, addPoints])

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
			rawAdvanceTurn(ayahs.length, () => navigate(`/summary/${id}`))
		}
	}, [loaded, currentParticipant, participants, turnState, rawAdvanceTurn, ayahs.length, id, navigate])

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

	const gaveAhsanta = turnState?.ahsanta_votes?.includes(user?.sub ?? '') ?? false

	async function quitSession() {
		if (!id || !user) return
		if (user.sub === room?.host_id) {
			await supabase.from('rooms').update({ status: 'complete' }).eq('id', id)
		} else {
			await supabase.from('participants').delete().eq('room_id', id).eq('user_sub', user.sub)
		}
		navigate('/')
	}

	return (
		<div className="min-h-screen text-ink flex flex-col">
			<ProgressBar current={turnState?.current_ayah ?? 1} total={ayahs.length} />
			<MiniLeaderboard participants={participants} streakPlayers={streakPlayers} />
			<button
				onClick={quitSession}
				className="fixed top-4 right-16 z-10 px-4 py-2 text-sm rounded-xl border border-border text-ink-faint hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
			>
				Quit
			</button>

			<div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
				<div className="relative">
					<TurnIndicator participants={participants} currentTurnId={turnState?.current_turn ?? ''} popupItems={popupItems} />
				</div>

				<AyahDisplay
					ayah={currentAyah}
					readerName={currentParticipant?.display_name ?? ''}
					onWordTap={(word) => fetchMeaning(word, currentAyah.verse_key)}
				/>

				{showTranslation && (
					<TranslationPanel
						verseKey={currentAyah.verse_key}
						initialText={currentAyah.translations?.[0]?.text ?? 'Translation not available.'}
						onClose={() => setShowTranslation(false)}
					/>
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
					<DoneButton onDone={advanceTurn} />
				)}
				{!isMyTurn && currentParticipant && user && (
					<div className="flex gap-2">
						<AhsantaButton
							onAhsanta={() => giveAhsanta(user.sub, turnState!)}
							disabled={gaveAhsanta}
						/>
						<button
							onClick={() => skipVote(user.sub)}
							disabled={turnState?.skip_voted_by?.includes(user.sub)}
							className="flex-1 py-4 text-lg font-bold border border-border text-ink-faint hover:text-ink hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer"
						>
							Vote to Skip ({turnState?.skip_votes ?? 0}/{Math.ceil(participants.length / 2)} needed)
						</button>
					</div>
				)}
			</div>

			{(meaning || wordLensLoading) && (
				<WordLens meaning={meaning} isLoading={wordLensLoading} onClose={clear} />
			)}
		</div>
	)
}
