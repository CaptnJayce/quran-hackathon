import { redirectToLogin } from '../../auth/oauth'

export function LoginButton() {
	return (
		<button
			onClick={() => void redirectToLogin()}
			className="w-full px-4 py-3 bg-accent hover:brightness-110 rounded-xl font-semibold transition-colors cursor-pointer text-white"
		>
			Sign in with Quran Foundation
		</button>
	)
}
