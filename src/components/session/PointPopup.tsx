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
	const [displayItems, setDisplayItems] = useState<(PopupItem & { batchId: number })[]>([])
	const [exiting, setExiting] = useState(false)
	const batchRef = useRef(0)
	const autoExitRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const domCleanupRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		if (items.length > 0) {
			if (autoExitRef.current) clearTimeout(autoExitRef.current)
			if (domCleanupRef.current) clearTimeout(domCleanupRef.current)
			batchRef.current++
			const batchId = batchRef.current
			setExiting(false)
			setDisplayItems(items.map((item) => ({ ...item, batchId })))
			autoExitRef.current = setTimeout(() => {
				setExiting(true)
				domCleanupRef.current = setTimeout(() => {
					setDisplayItems([])
					setExiting(false)
				}, 400)
			}, 2500)
		} else {
			if (autoExitRef.current) clearTimeout(autoExitRef.current)
			if (domCleanupRef.current) clearTimeout(domCleanupRef.current)
			setExiting(true)
			domCleanupRef.current = setTimeout(() => {
				setDisplayItems([])
				setExiting(false)
			}, 400)
		}

		return () => {
			if (autoExitRef.current) clearTimeout(autoExitRef.current)
			if (domCleanupRef.current) clearTimeout(domCleanupRef.current)
		}
	}, [items])

	if (displayItems.length === 0) return null

	return (
		<div className="pointer-events-none flex flex-col items-center w-full gap-2">
			{displayItems.map((item, i) => (
				<div
					key={`${item.batchId}-${item.reason}-${i}`}
					className="whitespace-nowrap text-center text-accent font-bold text-base"
					style={{
						animation: exiting
							? 'point-popup-out 0.35s ease-in forwards'
							: `point-popup-in 0.35s ease-out ${i * 120}ms both`,
					}}
				>
					{item.name} gets +{item.amount} {item.reason === 'read_ayah' ? 'point' : 'points'} for {LABELS[item.reason] ?? item.reason}
				</div>
			))}
		</div>
	)
}
