import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import Foto from '../../components/Foto';
import FiltroAtivo from '../../components/FiltroAtivo';
import CarregarMais from '../../components/CarregarMais';

export default function Recursos() {
  const [ativo, setAtivo] = useState('');
  const query = ativo ? `/recursos/?ativo=${ativo}` : '/recursos/';
  const { dados, carregando, carregandoMais, erro, proximaPagina, recarregar, carregarMais } =
    useApi(query, { paginado: true });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Mecânicos</h2>
        <Link to="/admin/mecanicos/novo" className="btn btn-primary btn-sm">
          Novo mecânico
        </Link>
      </div>

      <FiltroAtivo valor={ativo} onChange={setAtivo} />

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro erro={erro} onRetry={recarregar} />
      ) : (dados || []).length === 0 ? (
        <p className="text-muted">Cadastre o primeiro mecânico</p>
      ) : (
        <>
          <div className="list-group mb-3">
            {dados.map((m) => (
              <Link
                key={m.id}
                to={`/admin/mecanicos/${m.id}`}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-3">
                  <Foto src={m.foto} alt={m.nome} tamanho={48} arredondado />
                  <div>
                    <div className="fw-bold">{m.nome}</div>
                    <small className="text-muted">Capacidade: {m.capacidade ?? 1}</small>
                  </div>
                </div>
                <span className={`badge ${m.ativo !== false ? 'bg-success' : 'bg-secondary'}`}>
                  {m.ativo !== false ? 'Ativo' : 'Inativo'}
                </span>
              </Link>
            ))}
          </div>
          <CarregarMais
            temMais={Boolean(proximaPagina)}
            carregando={carregandoMais}
            onClick={carregarMais}
          />
        </>
      )}
    </div>
  );
}