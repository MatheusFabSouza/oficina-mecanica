import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Carregando from './Carregando';

export default function Publica() {
  const { usuario, carregando, isAdmin } = useAuth();

  if (carregando) return <Carregando />;
  if (usuario) {
    return <Navigate to={isAdmin ? '/admin/agenda' : '/inicio'} replace />;
  }

  return (
    <main className="container py-4">
      <Outlet />
    </main>
  );
}