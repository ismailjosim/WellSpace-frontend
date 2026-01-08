import { getCookie } from '@/services/auth/tokenHandlers'
import { getNewAccessToken } from '../services/auth/authService'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

const serverFetchHelper = async (
	endpoint: string,
	options: RequestInit,
): Promise<Response> => {
	const { headers, ...restOptions } = options
	const accessToken = await getCookie('accessToken')

	//to stop recursion loop
	if (endpoint !== '/auth/refresh-token') {
		await getNewAccessToken()
	}

	const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
		headers: {
			Cookie: accessToken ? `accessToken=${accessToken}` : '',
			...headers,
			// * if send token inside Authorization
			// ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			// ...(accessToken ? { Authorization: accessToken } : {}),
		},
		...restOptions,
	})

	return res
}

export const serverFetch = {
	get: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
		serverFetchHelper(endpoint, {
			method: 'GET',
			...options,
		}),

	post: (endpoint: string, options: RequestInit = {}) =>
		serverFetchHelper(endpoint, {
			method: 'POST',
			...options,
		}),

	put: (endpoint: string, options: RequestInit = {}) =>
		serverFetchHelper(endpoint, {
			method: 'PUT',
			...options,
		}),

	patch: (endpoint: string, options: RequestInit = {}) =>
		serverFetchHelper(endpoint, {
			method: 'PATCH',
			...options,
		}),

	delete: (endpoint: string, options: RequestInit = {}) =>
		serverFetchHelper(endpoint, {
			method: 'DELETE',
			...options,
		}),
}

// serverFetch.get('/auth/me')
// serverFetch.post('/auth/register',{body: JSON.stringify({})})
