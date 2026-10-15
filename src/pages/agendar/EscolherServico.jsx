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
  const respostaApi = useApi('/servicos/', { paginado: true });

  console.log("RESPOSTA COMPLETA DA API /servicos/:", respostaApi);

  if (respostaApi.carregando) return <Carregando />;
  if (respostaApi.erro) return <Erro erro={respostaApi.erro} onRetry={respostaApi.recarregar} />;

  const dados = respostaApi.dados;

  let listaServicos = [];
  if (Array.isArray(dados)) {
    listaServicos = dados;
  } else if (dados && Array.isArray(dados.results)) {
    listaServicos = dados.results;
  } else if (dados && Array.isArray(dados.data)) {
    listaServicos = dados.data;
  } else if (dados && typeof dados === 'object') {
    
    const possibleArray = Object.values(dados).find(val => Array.isArray(val));
    if (possibleArray) listaServicos = possibleArray;
  }

  console.log("Lista de serviços processada:", listaServicos);

  const servicos = listaServicos.filter((s) => {

    if (s.ativo === false) return false;
    
    if (mecanicoPreSelecionado && Array.isArray(s.recursos)) {
      return s.recursos.some((r) => {
        const rId = typeof r === 'object' && r !== null ? r.id : r;
        return Number(rId) === Number(mecanicoPreSelecionado.id);
      });
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
        <div className="alert alert-warning">
          Nenhum serviço disponível no momento. (Total na lista bruta: {listaServicos.length})
        </div>
      ) : (
        <div className="row g-3">
          {servicos.map((servico) => {
            const duracaoMinutos = servico.duracao_min ?? servico.duracao ?? 0;
            
            return (
              <div key={servico.id} className="col-md-6">
                <div className="card h-100">
                  <div className="card-body d-flex gap-3 align-items-start">
                    <Foto src={servico.imagem || servico.foto} alt={servico.nome} tamanho={64} />
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{servico.nome}</h5>
                      {servico.descricao && (
                        <p className="text-muted small mb-1">{servico.descricao}</p>
                      )}
                      <div className="small mb-2 text-secondary">
                        <span>{formatarDuracao(duracaoMinutos)}</span> &bull; <span>{formatarPreco(servico.preco)}</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
}