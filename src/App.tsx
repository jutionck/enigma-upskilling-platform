import { Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import { useAuthListener } from '@/hooks/useAuthListener';
import ClassPage from '@/pages/class';
import NotRegisteredPage from '@/pages/not-registered';

function App() {
  useAuthListener();
  return (
    <Routes>
      <Route element={<LoginPage />} path='/' />
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/class' element={<ClassPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/not-registered' element={<NotRegisteredPage />} />
    </Routes>
  );
}

export default App;
