import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import { auth, provider } from "@/config/firebase";
import { db } from "@/config/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeSwitch } from "@/components/theme-switch";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {}, [error]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();

          setUser({
            uid: user.uid,
            displayName: user.displayName || "User",
            email: user.email,
            photoURL: user.photoURL || "",
            role: userData.role || "user",
          });

          navigate("/dashboard");
        } else {
          localStorage.setItem("notRegistered", "true");
          navigate("/not-registered");
          await signOut(auth);
        }
      } else {
        throw new Error("Email tidak ditemukan dari Google Auth.");
      }
    } catch (error: any) {
      setError("Login gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Enigma Upskilling Platform
      </h1>

      <Card className="py-6 px-8 w-96 shadow-lg bg-white dark:bg-gray-800 dark:text-white transition-colors duration-300">
        <CardBody className="flex flex-col items-center">
          <Button
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            onPress={handleGoogleSignIn}
          >
            <FcGoogle className="text-2xl" />
            <span>Sign in with Google</span>
          </Button>

          {error && (
            <p key={error} className="mt-4 text-red-500 text-sm">
              {error}
            </p>
          )}
        </CardBody>
      </Card>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
        © {new Date().getFullYear()} Enigma Upskilling Platform. All rights
        reserved.
      </p>
    </div>
  );
}
