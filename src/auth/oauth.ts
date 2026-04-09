const CLIENT_ID = import.meta.env.VITE_QF_CLIENT_ID as string
const AUTH_ENDPOINT = import.meta.env.VITE_QF_AUTH_ENDPOINT as string
const REDIRECT_URI = import.meta.env.VITE_QF_REDIRECT_URI as string

function generateRandom(length: number): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
	const array = new Uint8Array(length)
	crypto.getRandomValues(array)
	return Array.from(array, (b) => chars[b % chars.length]).join('')
}

async function sha256(plain: string): Promise<ArrayBuffer> {
	const encoder = new TextEncoder()
	return crypto.subtle.digest('SHA-256', encoder.encode(plain))
}

function base64URLEncode(buffer: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '')
}

export async function redirectToLogin() {
	const codeVerifier = generateRandom(64)
	const state = generateRandom(32)

	const challenge = base64URLEncode(await sha256(codeVerifier))

	// Store in sessionStorage — survives the redirect, gone when tab closes
	sessionStorage.setItem('pkce_verifier', codeVerifier)
	sessionStorage.setItem('pkce_state', state)

	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		response_type: 'code',
		scope: 'openid streak bookmark reading_session',
		code_challenge: challenge,
		code_challenge_method: 'S256',
		state,
	})

	window.location.href = `${AUTH_ENDPOINT}/oauth2/auth?${params.toString()}`
}

export interface TokenResponse {
	access_token: string
	id_token: string
	token_type: string
	expires_in: number
}

export async function exchangeCodeForToken(code: string, returnedState: string): Promise<TokenResponse> {
	const codeVerifier = sessionStorage.getItem('pkce_verifier')
	const savedState = sessionStorage.getItem('pkce_state')

	if (!codeVerifier || !savedState) throw new Error('PKCE state missing — session may have expired')
	if (returnedState !== savedState) throw new Error('State mismatch — possible CSRF')

	sessionStorage.removeItem('pkce_verifier')
	sessionStorage.removeItem('pkce_state')

	const res = await fetch(`${AUTH_ENDPOINT}/oauth2/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: CLIENT_ID,
			redirect_uri: REDIRECT_URI,
			code,
			code_verifier: codeVerifier,
		}),
	})

	if (!res.ok) {
		const err = await res.text()
		throw new Error(`Token exchange failed: ${err}`)
	}

	return res.json()
}

export function parseIdToken(idToken: string): { sub: string; name?: string; email?: string } {
	const payload = idToken.split('.')[1]
	return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
}
