import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDailyStreak(userSub: string | undefined) {
	const [streak, setStreak] = useState<number>(0)

	const fetchStreak = useCallback(async () => {
		if (!userSub) return
		const { data } = await supabase
			.from('streak_progress')
			.select('current_streak, max_streak, last_active_date')
			.eq('user_sub', userSub)
			.maybeSingle()

		if (data) setStreak(data.current_streak)
	}, [userSub])

	useEffect(() => {
		if (!userSub) return
		fetchStreak()
	}, [userSub, fetchStreak])

	const recordDailyStreak = useCallback(async (): Promise<void> => {
		if (!userSub) return

		const { data: existing } = await supabase
			.from('streak_progress')
			.select('current_streak, max_streak, last_active_date')
			.eq('user_sub', userSub)
			.maybeSingle()

		const today = new Date().toISOString().split('T')[0]

		if (!existing) {
			await supabase.from('streak_progress').insert({
				user_sub: userSub,
				current_streak: 1,
				max_streak: 1,
				last_active_date: today,
			})
			setStreak(1)
			return
		}

		const lastDate = existing.last_active_date

		if (lastDate === today) return

		const yesterday = new Date()
		yesterday.setDate(yesterday.getDate() - 1)
		const yesterdayStr = yesterday.toISOString().split('T')[0]

		const newStreak = lastDate === yesterdayStr ? existing.current_streak + 1 : 1

		await supabase
			.from('streak_progress')
			.update({
				current_streak: newStreak,
				max_streak: Math.max(newStreak, existing.max_streak),
				last_active_date: today,
			})
			.eq('user_sub', userSub)

		setStreak(newStreak)
	}, [userSub])

	return { streak, recordDailyStreak }
}
