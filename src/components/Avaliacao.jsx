import Estrelas from './Estrelas';
import { formatarData } from '../formatos';

export default function Avaliacao({ item, mostrarMecanico = false }) {
  const cliente = item.cliente_nome || item.cliente?.nome || item.usuario_nome || 'Cliente';
  const servico = item.servico_nome || item.servico?.nome || '';
  const mecanico = item.recurso_nome || item.recurso?.nome || '';
  const data = item.criado_em || item.data || item.inicio;

  return (
    <div className="card mb-2">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <Estrelas nota={item.nota} />
          {data && <small className="text-muted">{formatarData(data)}</small>}
        </div>
        <p className="mb-1">
          <strong>{cliente}</strong>
          {servico ? ` — ${servico}` : ''}
          {mostrarMecanico && mecanico ? ` (Mecânico: ${mecanico})` : ''}
        </p>
        {item.comentario && <p className="mb-0 text-muted">{item.comentario}</p>}
      </div>
    </div>
  );
}