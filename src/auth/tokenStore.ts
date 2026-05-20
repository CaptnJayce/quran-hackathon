let _accessToken: string | null = null

export function setToken(token: string) {
	_accessToken = token
}

export function getToken(): string | null {
	return _accessToken
}

export function clearToken() {
	_accessToken = null
}

export function authHeaders(): Record<string, string> {
	if (!_accessToken) return {}
	return { Authorization: `Bearer ${_accessToken}` }
}
