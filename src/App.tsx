import { Route, Routes } from 'react-router-dom'

import LoginPage from '@/pages/login'
import DashboardPage from '@/pages/dashboard'
import { useAuthListener } from '@/hooks/useAuthListener'
import ClassPage from '@/pages/class'
import NotRegisteredPage from '@/pages/not-registered'

function App() {
	useAuthListener()

	return (
		<Routes>
			<Route element={<LoginPage />} path="/" />
			<Route element={<DashboardPage />} path="/dashboard" />
			<Route element={<ClassPage />} path="/class" />
			<Route element={<LoginPage />} path="/login" />
			<Route element={<NotRegisteredPage />} path="/not-registered" />
		</Routes>
	)
}

export default App
