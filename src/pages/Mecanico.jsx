import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Carregando from '../components/Carregando';
import Erro from '../components/Erro';
import Foto from '../components/Foto';
import Avaliacao from '../components/Avaliacao';
import CarregarMais from '../components/CarregarMais';

export default function Mecanico() {
  const { id } = useParams();
  const navigate = useNavigate();

  const rec = useApi(`/recursos/${id}/`);
  const servs = useApi('/servicos/', { paginado: true });
  const avals = useApi(`/avaliacoes/?recurso=${id}`, { paginado: true });

  if (rec.carregando || servs.carregando || avals.carregando) return <Carregando />;

  if (rec.erro?.status === 404) {
    return (
      <div>
        <div className="alert alert-warning">Não encontrado</div>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/mecanicos')}
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  if (rec.erro || servs.erro || avals.erro) {
    return (
      <Erro
        erro={rec.erro || servs.erro || avals.erro}
        onRetry={() => {
          rec.recarregar();
          servs.recarregar();
          avals.recarregar();
        }}
      />
    );
  }

  const mecanico = rec.dados;
  const todosServicos = servs.dados || [];
  const servicosDoMecanico = todosServicos.filter((s) => {
    const idsDosServicos = Array.isArray(mecanico?.servicos)
      ? mecanico.servicos.map((item) => (item && typeof item === 'object' ? item.id : item))
      : [];
    const idsDosRecursos = Array.isArray(s.recursos)
      ? s.recursos.map((item) => (item && typeof item === 'object' ? item.id : item))
      : [];

    const servicoDoMecanico = idsDosServicos.some(
      (idServico) => idServico != null && String(idServico) === String(s.id)
    );
    const mecanicoDoServico = idsDosRecursos.some(
      (idRecurso) => idRecurso != null && String(idRecurso) === String(mecanico?.id)
    );

    return servicoDoMecanico || mecanicoDoServico;
  });

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <Foto src={mecanico?.foto} alt={mecanico?.nome} tamanho={80} arredondado />
            <div>
              <h2 className="mb-1">{mecanico?.nome}</h2>
              {mecanico?.bio && <p className="text-muted mb-2">{mecanico.bio}</p>}
              {servicosDoMecanico.length > 0 && (
                <div className="small">
                  <strong>Serviços:</strong>{' '}
                  {servicosDoMecanico.map((s) => s.nome).join(', ')}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/agendar', { state: { mecanico } })}
          >
            Agendar com este mecânico
          </button>
        </div>
      </div>

      <h4 className="mb-3">Avaliações</h4>
      {(avals.dados || []).length === 0 ? (
        <p className="text-muted">Ainda sem avaliações</p>
      ) : (
        <>
          {avals.dados.map((av, idx) => (
            <Avaliacao key={av.id || idx} item={av} />
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