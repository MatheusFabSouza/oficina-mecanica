import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import Avaliacao from '../../components/Avaliacao';
import CarregarMais from '../../components/CarregarMais';

export default function Avaliacoes() {
  const [recurso, setRecurso] = useState('');
  const [nota, setNota] = useState('');

  const params = new URLSearchParams();
  if (recurso) params.set('recurso', recurso);
  if (nota) params.set('nota', nota);
  const qs = params.toString();

  const mecanicos = useApi('/recursos/', { paginado: true });
  const avals = useApi(`/avaliacoes/${qs ? `?\${qs}` : ''}`, { paginado: true });

  return (
    <div>
      <h2 className="mb-3">Avaliações</h2>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <select
            className="form-select form-select-sm"
            value={recurso}
            onChange={(e) => setRecurso(e.target.value)}
          >
            <option value="">Todos os mecânicos</option>
            {(mecanicos.dados || []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select form-select-sm"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          >
            <option value="">Todas as notas</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </select>
        </div>
      </div>

      {avals.carregando ? (
        <Carregando />
      ) : avals.erro ? (
        <Erro erro={avals.erro} onRetry={avals.recarregar} />
      ) : (avals.dados || []).length === 0 ? (
        <p className="text-muted">Ainda sem avaliações</p>
      ) : (
        <>
          {avals.dados.map((item, idx) => (
            <Avaliacao key={item.id || idx} item={item} mostrarMecanico />
          ))}
          <CarregarMais
            temMais={Boolean(avals.proximaPagina)}
            carregando={avals.carregandoMais}
            onClick={avals.carregarMais}
          />
        </>
      )}
    </div>
  );
}