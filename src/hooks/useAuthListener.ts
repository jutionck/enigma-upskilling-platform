import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { auth, db } from '@/config/firebase'
import { useAuthStore } from '@/store/useAuthStore'

export const useAuthListener = () => {
	const { setUser } = useAuthStore()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const userDocRef = doc(db, 'users', user.uid)
				const userDoc = await getDoc(userDocRef)

				const role = userDoc.exists() ? userDoc.data().role : 'user'

				const userData = {
					uid: user.uid,
					displayName: user.displayName || 'User',
					email: user.email || '',
					photoURL: user.photoURL || '',
					role,
				}

				setUser(userData)
			} else {
				setUser(null)
			}
		})

		return () => unsubscribe()
	}, [setUser])
}
