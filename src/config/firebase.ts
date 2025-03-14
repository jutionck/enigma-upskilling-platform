import { initializeApp } from 'firebase/app'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	setPersistence,
	browserLocalPersistence,
	getRedirectResult,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

const db = getFirestore(app)

auth.useDeviceLanguage()

setPersistence(auth, browserLocalPersistence)
	.then(() => console.log('Firebase auth persistence set to local'))
	.catch((error) => console.error('Failed to set auth persistence:', error))

export { auth, provider, signInWithPopup, getRedirectResult, signOut, db }
