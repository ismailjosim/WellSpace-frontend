import { getCookie } from '@/services/auth/tokenHandlers'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

const serverFetchHelper = async (
	endpoint: string,
	options: RequestInit,
): Promise<Response> => {
	const { headers, ...restOptions } = options
	const accessToken = await getCookie('accessToken')
	const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
		headers: {
			...headers,
			// * if send token inside Authorization
			// ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			// ...(accessToken ? { Authorization: accessToken } : {}),

			Cookie: accessToken ? `accessToken=${accessToken}` : '',
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
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(options.headers || {}),
			},
			...options,
		}),

	put: (endpoint: string, options: RequestInit = {}) =>
		serverFetchHelper(endpoint, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(options.headers || {}),
			},
			...options,
		}),

	patch: (endpoint: string, options: RequestInit = {}) =>
		serverFetchHelper(endpoint, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(options.headers || {}),
			},
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
