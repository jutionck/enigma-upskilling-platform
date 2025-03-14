import { create } from 'zustand'

interface User {
	uid: string
	displayName: string
	email: string
	photoURL: string
	role: string
}

interface AuthState {
	user: User | null
	setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
}))
