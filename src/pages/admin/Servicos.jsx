import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { formatarDuracao, formatarPreco } from '../../formatos';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import Foto from '../../components/Foto';
import FiltroAtivo from '../../components/FiltroAtivo';
import CarregarMais from '../../components/CarregarMais';

export default function Servicos() {
  const [ativo, setAtivo] = useState('');
  const query = ativo ? `/servicos/?ativo=${ativo}` : '/servicos/';
  const { dados, carregando, carregandoMais, erro, proximaPagina, recarregar, carregarMais } =
    useApi(query, { paginado: true });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Serviços</h2>
        <Link to="/admin/servicos/novo" className="btn btn-primary btn-sm">
          Novo serviço
        </Link>
      </div>

      <FiltroAtivo valor={ativo} onChange={setAtivo} />

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro erro={erro} onRetry={recarregar} />
      ) : (dados || []).length === 0 ? (
        <p className="text-muted">Cadastre o primeiro serviço</p>
      ) : (
        <>
          <div className="list-group mb-3">
            {dados.map((s) => (
              <Link
                key={s.id}
                to={`/admin/servicos/${s.id}`}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-3">
                  <Foto src={s.imagem || s.foto} alt={s.nome} tamanho={48} />
                  <div>
                    <div className="fw-bold">{s.nome}</div>
                    <small className="text-muted">
                      {formatarDuracao(s.duracao)} • {formatarPreco(s.preco)}
                    </small>
                  </div>
                </div>
                <span className={`badge ${s.ativo !== false ? 'bg-success' : 'bg-secondary'}`}>
                  {s.ativo !== false ? 'Ativo' : 'Inativo'}
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