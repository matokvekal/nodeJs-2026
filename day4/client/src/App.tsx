import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyTicketsPage from './pages/MyTicketsPage';
import BuyTicketsPage from './pages/BuyTicketsPage';

function AppRoutes() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login"    element={!token ? <LoginPage />     : <Navigate to="/"      replace />} />
      <Route path="/register" element={!token ? <RegisterPage />  : <Navigate to="/"      replace />} />
      <Route path="/"         element={ token ? <MyTicketsPage /> : <Navigate to="/login" replace />} />
      <Route path="/buy"      element={ token ? <BuyTicketsPage />: <Navigate to="/login" replace />} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
