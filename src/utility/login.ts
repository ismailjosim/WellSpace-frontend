const loginUser = async (email: string, password: string) => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('login failed')
		}
		const data = await res.json()
		return data
	} catch (error) {
		throw new Error(String(error))
	}
}
export default loginUser
