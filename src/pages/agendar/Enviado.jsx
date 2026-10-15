import { Link, Navigate, useLocation } from 'react-router-dom';
import StatusHorario from '../../components/StatusHorario';
import { formatarDataHora } from '../../formatos';

export default function Enviado() {
  const location = useLocation();
  const { agendamento, servico, mecanico } = location.state || {};

  if (!agendamento) return <Navigate to="/inicio" replace />;

  return (
    <div className="mx-auto text-center py-4" style={{ maxWidth: 500 }}>
      <h2 className="mb-2">Agendamento enviado</h2>
      <p className="text-muted mb-3">
        O seu pedido foi registado e aguarda a confirmação do administrador da oficina.
      </p>

      <div className="card text-start mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>{agendamento.servico_nome || servico?.nome}</strong>
            <StatusHorario status={agendamento.status || 'solicitado'} />
          </div>
          <div className="small text-muted">
            <div>Mecânico: {agendamento.recurso_nome || mecanico?.nome}</div>
            <div>Data e horário: {formatarDataHora(agendamento.inicio)}</div>
            {agendamento.observacoes && <div>Veículo / Obs.: {agendamento.observacoes}</div>}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-2">
        <Link to={`/agendamentos/${agendamento.id}`} className="btn btn-primary">
          Ver serviço agendado
        </Link>
        <Link to="/inicio" className="btn btn-outline-secondary">
          Início
        </Link>
      </div>
    </div>
  );
}