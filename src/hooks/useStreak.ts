import { useState } from 'react'
import { authHeaders } from '../auth/tokenStore'

const QF_API = 'https://api.quran.foundation/api/v4'

export function useStreak() {
	const [streak, setStreak] = useState<number | null>(null)

	async function fetchStreak() {
		try {
			const res = await fetch(`${QF_API}/auth/v1/streak`, {
				headers: authHeaders(),
			})
			if (!res.ok) return
			const data = await res.json()
			setStreak(data.streak_count ?? data.current_streak ?? null)
		} catch {
			// streak is non-critical — fail silently
		}
	}

	async function recordStreak() {
		try {
			await fetch(`${QF_API}/auth/v1/streak`, {
				method: 'POST',
				headers: { ...authHeaders(), 'Content-Type': 'application/json' },
			})
			await fetchStreak()
		} catch {
			// non-critical
		}
	}

	return { streak, fetchStreak, recordStreak }
}
