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
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Foto src={org.dados?.logo} alt={org.dados?.nome || 'Oficina'} tamanho={64} />
        <div>
          <h2 className="mb-1">{org.dados?.nome || 'Oficina Mecânica'}</h2>
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
        <div className="card p-3">
          <p className="text-muted mb-2">Você não tem serviços agendados</p>
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