import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import Foto from '../../components/Foto';

export default function EscolherMecanico() {
  const location = useLocation();
  const navigate = useNavigate();
  const servico = location.state?.servico;

  const { dados, carregando, erro, recarregar } = useApi(
    servico ? `/recursos/?servicos=${servico.id}` : null,
    { paginado: true, auto: Boolean(servico) }
  );

  if (!servico) return <Navigate to="/agendar" replace />;
  if (carregando) return <Carregando />;
  if (erro) return <Erro erro={erro} onRetry={recarregar} />;

  const mecanicos = (dados || []).filter((m) => m.ativo !== false);

  const escolher = (mecanico) => {
    navigate('/agendar/horario', { state: { servico, mecanico } });
  };

  return (
    <div>
      <h2 className="mb-1">Escolher mecânico</h2>
      <p className="text-muted mb-3">Serviço: {servico.nome}</p>

      {mecanicos.length === 0 ? (
        <p className="text-muted">Nenhum mecânico realiza este serviço</p>
      ) : (
        <>
          <div className="card mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Qualquer um</h6>
                <small className="text-muted">Mostra horários de todos os mecânicos disponíveis</small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => escolher(null)}
              >
                Escolher
              </button>
            </div>
          </div>

          <div className="row g-3">
            {mecanicos.map((mecanico) => (
              <div key={mecanico.id} className="col-md-6">
                <div className="card h-100">
                  <div className="card-body d-flex gap-3 align-items-start">
                    <Foto src={mecanico.foto} alt={mecanico.nome} tamanho={64} arredondado />
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{mecanico.nome}</h5>
                      {mecanico.bio && <p className="text-muted small mb-2">{mecanico.bio}</p>}
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => escolher(mecanico)}
                        >
                          Escolher
                        </button>
                        <Link
                          to={`/mecanicos/${mecanico.id}`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Ver avaliações
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}