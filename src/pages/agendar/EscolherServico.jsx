import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { formatarDuracao, formatarPreco } from '../../formatos';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import Foto from '../../components/Foto';

export default function EscolherServico() {
  const navigate = useNavigate();
  const location = useLocation();
  const mecanicoPreSelecionado = location.state?.mecanico || null;
  const { dados, carregando, erro, recarregar } = useApi('/servicos/', { paginado: true });

  if (carregando) return <Carregando />;
  if (erro) return <Erro erro={erro} onRetry={recarregar} />;

  const servicos = (dados || []).filter((s) => {
    if (s.ativo === false) return false;
    if (mecanicoPreSelecionado && Array.isArray(s.recursos)) {
      return s.recursos.includes(mecanicoPreSelecionado.id);
    }
    return true;
  });

  const escolher = (servico) => {
    if (mecanicoPreSelecionado) {
      navigate('/agendar/horario', {
        state: { servico, mecanico: mecanicoPreSelecionado },
      });
    } else {
      navigate('/agendar/mecanico', { state: { servico } });
    }
  };

  return (
    <div>
      <h2 className="mb-3">Escolher serviço</h2>
      {mecanicoPreSelecionado && (
        <div className="alert alert-info py-2">
          Agendando com o mecânico: <strong>{mecanicoPreSelecionado.nome}</strong>
        </div>
      )}
      {servicos.length === 0 ? (
        <p className="text-muted">Nenhum serviço disponível</p>
      ) : (
        <div className="row g-3">
          {servicos.map((servico) => (
            <div key={servico.id} className="col-md-6">
              <div className="card h-100">
                <div className="card-body d-flex gap-3 align-items-start">
                  <Foto src={servico.imagem || servico.foto} alt={servico.nome} tamanho={64} />
                  <div className="flex-grow-1">
                    <h5 className="card-title mb-1">{servico.nome}</h5>
                    {servico.descricao && (
                      <p className="text-muted small mb-1">{servico.descricao}</p>
                    )}
                    <div className="small mb-2">
                      {formatarDuracao(servico.duracao)} • {formatarPreco(servico.preco)}
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => escolher(servico)}
                    >
                      Escolher
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}