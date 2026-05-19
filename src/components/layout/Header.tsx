import { useAuth } from '../../auth/AuthProvider'

export function Header() {
	const { user, logout } = useAuth()

	return (
		<header className="flex items-center justify-between px-4 py-3 border-b border-border">
			<span className="font-bold text-accent text-lg tracking-tight">Halaqah</span>
			{user && (
				<button
					onClick={logout}
					className="text-sm text-ink-faint hover:text-ink transition-colors cursor-pointer"
				>
					Sign out
				</button>
			)}
		</header>
	)
}
