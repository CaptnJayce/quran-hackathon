import { useState, useCallback } from 'react'
import { authHeaders } from '../auth/tokenStore'

const QF_AUTH_BASE = 'https://api.quran.foundation'

export function useStreak() {
	const [streak, setStreak] = useState<number | null>(null)

	const fetchStreak = useCallback(async () => {
		try {
			const res = await fetch(`${QF_AUTH_BASE}/auth/v1/streak`, {
				headers: authHeaders(),
			})
			if (!res.ok) return
			const data = await res.json()
			setStreak(data.streak_count ?? data.current_streak ?? null)
		} catch {
			// streak is non-critical — fail silently
		}
	}, [])

	const recordStreak = useCallback(async () => {
		try {
			await fetch(`${QF_AUTH_BASE}/auth/v1/streak`, {
				method: 'POST',
				headers: { ...authHeaders(), 'Content-Type': 'application/json' },
			})
			await fetchStreak()
		} catch {
			// non-critical
		}
	}, [fetchStreak])

	return { streak, fetchStreak, recordStreak }
}
