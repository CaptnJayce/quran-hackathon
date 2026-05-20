import { useEffect, useState } from 'react'

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
	const [phase, setPhase] = useState<'initial' | 'entered' | 'exiting'>('initial')

	useEffect(() => {
		if (items.length === 0) return
		setPhase('initial')

		const enterTimer = setTimeout(() => setPhase('entered'), 16)

		const totalStagger = (items.length - 1) * 100
		const exitTimer = setTimeout(() => setPhase('exiting'), totalStagger + 2000)

		return () => {
			clearTimeout(enterTimer)
			clearTimeout(exitTimer)
		}
	}, [items])

	if (items.length === 0) return null

	const entered = phase === 'entered' || phase === 'exiting'

	return (
		<div className="pointer-events-none flex flex-col items-center gap-10 w-full">
			{items.map((item, i) => {
				const delay = phase === 'entered' ? `${i * 100}ms` : '0ms'
				return (
					<div
						key={i}
						className="whitespace-nowrap text-center text-accent font-bold text-base"
						style={{
							opacity: phase === 'initial' ? 0 : phase === 'exiting' ? 0 : 1,
							transform: entered ? 'translateY(-40px)' : 'translateY(0)',
							transition: phase === 'initial' ? 'none' : `opacity 0.4s ease-out ${delay}, transform 0.4s ease-out ${delay}`,
							willChange: 'transform, opacity',
						}}
					>
						{item.name} gets +{item.amount} {item.reason === 'read_ayah' ? 'point' : 'points'} for {LABELS[item.reason] ?? item.reason}
					</div>
				)
			})}
		</div>
	)
}
