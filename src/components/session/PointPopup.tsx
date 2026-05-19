import { useEffect, useState, useRef } from 'react'

interface PopupItem {
	amount: number
	reason: string
	name: string
}

const LABELS: Record<string, string> = {
	read_ayah: 'reading',
	ahsanta: 'congratulations',
	streak_bonus: 'streak bonus',
}

export function PointPopup({ items }: { items: PopupItem[] }) {
	const [showing, setShowing] = useState<{ id: number; amount: number; reason: string; name: string; index: number }[]>([])
	const [fading, setFading] = useState<Set<number>>(new Set())
	const batchRef = useRef(0)

	useEffect(() => {
		if (items.length === 0) return

		const batch = ++batchRef.current
		setShowing([])
		setFading(new Set())

		items.forEach((item, i) => {
			setTimeout(() => {
				if (batch !== batchRef.current) return
				setShowing((prev) => [...prev, { id: Date.now() + i, ...item, index: i }])
			}, i * 100)
		})

		const staggerTotal = (items.length - 1) * 100

		const removalTimer = setTimeout(() => {
			if (batch !== batchRef.current) return
			items.forEach((_, j) => {
				setTimeout(() => {
					setFading((prev) => new Set(prev).add(j))
					setTimeout(() => {
						setShowing((prev) => prev.filter((s) => s.index !== j))
					}, 300)
				}, j * 100)
			})
		}, staggerTotal + 2000)

		return () => clearTimeout(removalTimer)
	}, [items])

	if (showing.length === 0) return null

	return (
		<div className="pointer-events-none flex flex-col items-center w-full">
			{showing.map((s) => (
				<div
					key={s.id}
					className={`whitespace-nowrap text-center text-accent font-bold text-base ${
						fading.has(s.index) ? 'opacity-0' : 'opacity-100'
					}`}
					style={{
						marginTop: s.index > 0 ? '2.5rem' : '0',
						transition: 'opacity 0.3s',
						animation: 'point-popup 0.4s ease-out forwards',
					}}
				>
					{s.name} gets +{s.amount} {s.reason === 'read_ayah' ? 'point' : 'points'} for {LABELS[s.reason] ?? s.reason}
				</div>
			))}
		</div>
	)
}
