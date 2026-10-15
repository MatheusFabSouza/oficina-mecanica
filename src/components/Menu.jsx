import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Menu() {
  const { usuario, isAdmin, temPermissao } = useAuth();
  if (!usuario) return null;

  const nomeNegocio = usuario.organizacao?.nome || 'Oficina Mecânica';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <NavLink className="navbar-brand" to={isAdmin ? '/admin/agenda' : '/inicio'}>
          {nomeNegocio}
        </NavLink>
        <div className="navbar-nav d-flex flex-row flex-wrap gap-2">
          {isAdmin ? (
            <>
              <NavLink className="nav-link" to="/admin/agenda">
                Agenda
              </NavLink>
              <NavLink className="nav-link" to="/admin/a-confirmar">
                A confirmar
              </NavLink>
              <NavLink className="nav-link" to="/admin/negocio">
                Negócio
              </NavLink>
              <NavLink className="nav-link" to="/admin/mecanicos">
                Mecânicos
              </NavLink>
              <NavLink className="nav-link" to="/admin/servicos">
                Serviços
              </NavLink>
              <NavLink className="nav-link" to="/admin/avaliacoes">
                Avaliações
              </NavLink>
            </>
          ) : (
            <>
              <NavLink className="nav-link" to="/inicio">
                Início
              </NavLink>
              {temPermissao('api.add_agendamento') && (
                <NavLink className="nav-link" to="/agendar">
                  Agendar
                </NavLink>
              )}
              <NavLink className="nav-link" to="/meus-agendamentos">
                Meus serviços agendados
              </NavLink>
              <NavLink className="nav-link" to="/mecanicos">
                Mecânicos
              </NavLink>
            </>
          )}
          <NavLink className="nav-link" to="/perfil">
            Perfil
          </NavLink>
        </div>
      </div>
    </nav>
  );
}