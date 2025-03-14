import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Image } from '@heroui/react'

import { useAuthStore } from '@/store/useAuthStore'
import DefaultLayout from '@/layouts/default'

export default function DashboardPage() {
	const navigate = useNavigate()
	const { user } = useAuthStore()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (user === null) {
			navigate('/')
		} else {
			setLoading(false)
		}
	}, [user, navigate])

	const handleGoToDashboard = async () => {
		navigate('/class')
	}

	if (loading) {
		return <div className="text-center mt-20">Loading...</div>
	}

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
				<div className="max-w-lg text-center flex flex-col items-center">
					<h1 className="text-2xl font-bold">Welcome, {user?.displayName}!</h1>
					<p className="text-gray-500 dark:text-gray-400">You are now logged in with Google.</p>

					<Image
						alt="User Avatar"
						className="w-24 h-24 rounded-full mt-4 object-cover shadow-lg"
						src={
							user?.photoURL || 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'
						}
					/>

					<Button
						className="mt-6 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
						onPress={handleGoToDashboard}
					>
						Access Class
					</Button>
				</div>
			</section>
		</DefaultLayout>
	)
}
