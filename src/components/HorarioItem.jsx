
import { Link } from 'react-router-dom';
import StatusHorario from './StatusHorario';
import { formatarDataHora } from '../formatos';

export default function HorarioItem({ item, destino, mostrarCliente = false, acoes }) {
  const servico = item.servico_nome || item.servico?.nome || `Serviço #${item.servico}`;
  const mecanico = item.recurso_nome || item.recurso?.nome || `Mecânico #${item.recurso}`;
  const cliente = item.cliente_nome || item.cliente?.nome || item.usuario?.nome;
  const link = destino || `/agendamentos/${item.id}`;

  return (
    <div className="card mb-2">
      <div className="card-body d-flex justify-content-between align-items-start gap-2">
        <div>
          <h6 className="mb-1">
            <Link to={link} className="text-decoration-none">
              {servico}
            </Link>
          </h6>
          <div className="small text-muted">
            <div>Mecânico: {mecanico}</div>
            <div>Data e horário: {formatarDataHora(item.inicio)}</div>
            {mostrarCliente && cliente && <div>Cliente: {cliente}</div>}
            {item.observacoes && <div>Veículo / Obs.: {item.observacoes}</div>}
          </div>
        </div>
        <div className="d-flex flex-column align-items-end gap-2">
          <StatusHorario status={item.status} />
          {acoes}
        </div>
      </div>
    </div>
  );
}