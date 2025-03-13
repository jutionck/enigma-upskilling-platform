import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "@heroui/react";

import { ThemeSwitch } from "@/components/theme-switch";

export default function NotRegisteredPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const isNotRegistered = localStorage.getItem("notRegistered");

    if (!isNotRegistered) {
      navigate("/");
    }
  }, [navigate]);

  const handleBackToLogin = () => {
    localStorage.removeItem("notRegistered");
    navigate("/");
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      <Card className="py-6 px-8 w-96 shadow-lg bg-white dark:bg-gray-800 dark:text-white transition-colors duration-300">
        <CardBody className="flex flex-col items-center text-center">
          <h1 className="text-xl font-bold text-red-500 mb-4">Akses Ditolak</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Akun Anda belum terdaftar dalam sistem kami. Silakan hubungi admin
            untuk mendapatkan akses.
          </p>

          <Button
            className="w-full bg-blue-600 text-white mt-4"
            onPress={handleBackToLogin}
          >
            Kembali ke Login
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
