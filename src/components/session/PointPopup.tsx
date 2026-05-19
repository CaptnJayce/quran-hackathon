import { useEffect, useState, useRef } from 'react'

interface PopupItem {
	amount: number
	reason: string
}

export function PointPopup({ items }: { items: PopupItem[] }) {
	const [showing, setShowing] = useState<{ id: number; amount: number; reason: string }[]>([])
	const batchRef = useRef(0)

	useEffect(() => {
		if (items.length === 0) return

		const batch = ++batchRef.current
		setShowing([])

		items.forEach((item, i) => {
			setTimeout(() => {
				if (batch !== batchRef.current) return
				const id = Date.now() + i
				setShowing((prev) => [...prev, { id, ...item }])
				setTimeout(() => {
					setShowing((prev) => prev.filter((s) => s.id !== id))
				}, 1700)
			}, i * 300)
		})
	}, [items])

	return (
		<div className="fixed inset-0 pointer-events-none z-20">
			{showing.map((s) => (
				<div
					key={s.id}
					className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-point-popup text-accent font-bold text-lg"
				>
					+{s.amount} {s.reason === 'streak_bonus' ? 'for streak!' : s.reason === 'ahsanta' ? 'from congratulations!' : 'point!'}
				</div>
			))}
		</div>
	)
}
