import { Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import { useAuthListener } from '@/hooks/useAuthListener';
import ClassPage from '@/pages/class';

function App() {
  useAuthListener();
  return (
    <Routes>
      <Route element={<LoginPage />} path='/' />
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/class' element={<ClassPage />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  );
}

export default App;
