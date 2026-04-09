import { useAuth } from '../../auth/AuthProvider'

export function Header() {
	const { user, logout } = useAuth()

	return (
		<header className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
			<span className="font-bold text-emerald-400 text-lg tracking-tight">Halaq</span>
			{user && (
				<button
					onClick={logout}
					className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
				>
					Sign out
				</button>
			)}
		</header>
	)
}
