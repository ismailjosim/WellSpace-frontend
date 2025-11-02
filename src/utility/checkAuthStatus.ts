const checkAuthStatus = async () => {
	let isAuthenticated = false
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}/auth/me`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('Failed to fetch auth status')
		}
		const data = await res.json()
		isAuthenticated = true
		return { isAuthenticated, user: data.data }
	} catch (error) {
		return { isAuthenticated, user: null }
	}
}

export default checkAuthStatus
