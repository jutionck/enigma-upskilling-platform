import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody } from '@heroui/react';
import { FcGoogle } from 'react-icons/fc';
import { auth, provider } from '@/config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeSwitch } from '@/components/theme-switch';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log('✅ User sudah login, redirect ke dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log('🛑 Error State Updated:', error);
  }, [error]);

  const handleGoogleSignIn = async () => {
    setError(null);
    console.log('🔄 Memulai proses login...');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('🔍 User Google Auth:', user);
      console.log('🔥 Firestore instance:', db);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        console.log('📂 Mencari user di Firestore dengan UID:', user.uid);

        const userDoc = await getDoc(userDocRef);
        console.log(
          '📃 Firestore Response:',
          userDoc.exists() ? userDoc.data() : 'User tidak ditemukan'
        );

        if (userDoc.exists()) {
          console.log('✅ User ditemukan di Firestore:', userDoc.data());

          const userData = userDoc.data();
          setUser({
            uid: user.uid,
            displayName: user.displayName || 'User',
            email: user.email || '',
            photoURL: user.photoURL || '',
            role: userData.role || 'user',
          });

          navigate('/dashboard');
        } else {
          console.log('❌ User tidak terdaftar di Firestore!');

          localStorage.setItem('notRegistered', 'true');

          navigate('/not-registered');

          await signOut(auth);
          console.log('🚪 User telah logout karena tidak terdaftar');
        }
      }
    } catch (error: any) {
      console.error('🔥 Login Failed:', error);
      setError('Login gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 transition-colors duration-300'>
      <div className='absolute top-4 right-4'>
        <ThemeSwitch />
      </div>

      <h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>
        Enigma Upskilling Platform
      </h1>

      <Card className='py-6 px-8 w-96 shadow-lg bg-white dark:bg-gray-800 dark:text-white transition-colors duration-300'>
        <CardBody className='flex flex-col items-center'>
          <Button
            className='flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300'
            onPress={handleGoogleSignIn}
          >
            <FcGoogle className='text-2xl' />
            <span>Sign in with Google</span>
          </Button>

          {error && (
            <p key={error} className='mt-4 text-red-500 text-sm'>
              {error}
            </p>
          )}
        </CardBody>
      </Card>

      <p className='text-sm text-gray-500 dark:text-gray-400 mt-6'>
        © {new Date().getFullYear()} Enigma Upskilling Platform. All rights
        reserved.
      </p>
    </div>
  );
}
