import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { hojeISO } from '../formatos';
import Carregando from '../components/Carregando';
import Erro from '../components/Erro';
import Foto from '../components/Foto';
import HorarioItem from '../components/HorarioItem';

export default function Inicio() {
  const org = useApi('/organizacao/');
  const agendamentos = useApi(`/agendamentos/?data_inicio=${hojeISO()}`, { paginado: true });

  if (org.carregando || agendamentos.carregando) return <Carregando />;
  if (org.erro || agendamentos.erro) {
    return (
      <Erro
        erro={org.erro || agendamentos.erro}
        onRetry={() => {
          org.recarregar();
          agendamentos.recarregar();
        }}
      />
    );
  }

  const agora = new Date();
  const proximo = (agendamentos.dados || []).find(
    (item) =>
      (item.status === 'solicitado' || item.status === 'confirmado') &&
      new Date(item.inicio) >= agora
  );

  return (
    <div className="container py-4">
      {/* Bloco do Topo / Banner da Oficina */}
      <div className="card shadow-sm p-4 mb-4 text-center">
        <div className="mb-3 d-flex justify-content-center">
          <Foto 
            src={org.dados?.logo} 
            alt={org.dados?.nome || 'Oficina'} 
            className="banner-oficina-topo img-fluid rounded" 
          />
        </div>
        <div>
          <h2 className="mb-2 fw-bold">{org.dados?.nome || 'Oficina Mecânica'}</h2>
          {org.dados?.descricao && <p className="text-muted mb-0">{org.dados.descricao}</p>}
        </div>
      </div>

      <h4 className="mb-3">Próximo serviço agendado</h4>
      {proximo ? (
        <div className="mb-3">
          <HorarioItem item={proximo} />
          <Link to="/agendar" className="btn btn-primary mt-2">
            Agendar
          </Link>
        </div>
      ) : (
        <div className="card p-4 shadow-sm">
          <p className="text-muted mb-3">Você não tem serviços agendados</p>
          <div>
            <Link to="/agendar" className="btn btn-primary">
              Agendar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}