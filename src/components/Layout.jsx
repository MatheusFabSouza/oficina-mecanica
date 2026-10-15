import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Menu from './Menu';
import Carregando from './Carregando';

export default function Layout({ permissao }) {
  const { usuario, carregando, temPermissao } = useAuth();

  if (carregando) return <Carregando />;
  if (!usuario) return <Navigate to="/login" replace />;

  if (permissao && !temPermissao(permissao)) {
    return (
      <>
        <Menu />
        <div className="container">
          <div className="alert alert-danger">Você não tem permissão para esta ação</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <main className="container pb-5">
        <Outlet />
      </main>
    </>
  );
}