import { useAuth } from '../../auth/AuthProvider'

export function Header() {
	const { user, logout } = useAuth()

	return (
		<header className="flex items-center justify-between px-4 py-3 border-b border-amber-200/60">
			<span className="font-bold text-emerald-600 text-lg tracking-tight">Halaq</span>
			{user && (
				<button
					onClick={logout}
					className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
				>
					Sign out
				</button>
			)}
		</header>
	)
}
