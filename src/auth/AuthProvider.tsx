import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { exchangeCodeForToken, parseIdToken } from './oauth'
import { setToken, clearToken } from './tokenStore'

const DEV_BYPASS = import.meta.env.DEV

interface User {
	sub: string
	displayName: string
}

interface AuthContextValue {
	user: User | null
	isLoading: boolean
	devLogin: (name: string) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (DEV_BYPASS) {
			setIsLoading(false)
			return
		}

		const params = new URLSearchParams(window.location.search)
		const code = params.get('code')
		const state = params.get('state')

		if (code && state) {
			setIsLoading(true)
			exchangeCodeForToken(code, state)
				.then(({ access_token, id_token }) => {
					setToken(access_token)
					const claims = parseIdToken(id_token)
					setUser({ sub: claims.sub, displayName: claims.name ?? 'Reader' })
					window.history.replaceState({}, '', window.location.pathname)
				})
				.catch((err) => {
					console.error('Auth error:', err)
				})
				.finally(() => setIsLoading(false))
		} else {
			setIsLoading(false)
		}
	}, [])

	function devLogin(name: string) {
		setUser({ sub: `dev-${name.toLowerCase()}`, displayName: name })
	}

	function logout() {
		clearToken()
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, isLoading, devLogin, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
