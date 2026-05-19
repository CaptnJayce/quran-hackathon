import type { ReactNode } from 'react'
import { Header } from './Header'

export function PageWrapper({ children, hideHeader = false }: { children: ReactNode; hideHeader?: boolean }) {
	return (
		<div className="min-h-screen text-ink">
			{!hideHeader && <Header />}
			{children}
		</div>
	)
}
