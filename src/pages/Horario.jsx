import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useApi } from '../hooks/useApi';
import { api } from '../api/client';
import { formatarDataHora, formatarDuracao } from '../formatos';
import Carregando from '../components/Carregando';
import Erro from '../components/Erro';
import StatusHorario from '../components/StatusHorario';
import ConfirmarAcao from '../components/ConfirmarAcao';
import Estrelas from '../components/Estrelas';

export default function Horario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { temPermissao, isAdmin } = useAuth();
  const { dados: item, carregando, erro, recarregar } = useApi(`/agendamentos/${id}/`);
  const [erroAcao, setErroAcao] = useState(null);
  const [executando, setExecutando] = useState(false);

  if (carregando) return <Carregando />;

  if (erro?.status === 404) {
    return (
      <div>
        <div className="alert alert-warning">Não encontrado</div>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate(isAdmin ? '/admin/agenda' : '/meus-agendamentos')}
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  if (erro) return <Erro erro={erro} onRetry={recarregar} />;
  if (!item) return null;

  const executarAcao = async (acao) => {
    setExecutando(true);
    setErroAcao(null);
    try {
      await api.post(`/agendamentos/${id}/${acao}/`);
      await recarregar();
    } catch (err) {
      setErroAcao(err);
    } finally {
      setExecutando(false);
    }
  };

  const podeConfirmar =
    temPermissao('api.confirmar_agendamento') && item.status === 'solicitado';
  const podeConcluir =
    temPermissao('api.concluir_agendamento') && item.status === 'confirmado';
  const podeCancelar =
    temPermissao('api.cancelar_agendamento') &&
    (item.status === 'solicitado' || item.status === 'confirmado');
  const podeAvaliar =
    temPermissao('api.avaliar_agendamento') &&
    item.status === 'concluido' &&
    !item.nota;

  const servico = item.servico_nome || item.servico?.nome || `Serviço #${item.servico}`;
  const mecanico = item.recurso_nome || item.recurso?.nome || `Mecânico #${item.recurso}`;
  const cliente = item.cliente_nome || item.cliente?.nome || item.usuario?.nome;
  const duracao = item.duracao || item.servico?.duracao;

  return (
    <div className="mx-auto" style={{ maxWidth: 600 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Detalhe do serviço agendado</h2>
        <StatusHorario status={item.status} />
      </div>

      <Erro erro={erroAcao} />

      <div className="card mb-3">
        <div className="card-body">
          <p className="mb-1">
            <strong>Serviço:</strong> {servico}
          </p>
          <p className="mb-1">
            <strong>Mecânico:</strong> {mecanico}
          </p>
          {cliente && (
            <p className="mb-1">
              <strong>Cliente:</strong> {cliente}
            </p>
          )}
          <p className="mb-1">
            <strong>Data e horário:</strong> {formatarDataHora(item.inicio)}
          </p>
          {duracao && (
            <p className="mb-1">
              <strong>Duração:</strong> {formatarDuracao(duracao)}
            </p>
          )}
          {item.observacoes && (
            <p className="mb-0">
              <strong>Observações / Veículo:</strong> {item.observacoes}
            </p>
          )}
        </div>
      </div>

      {item.nota && (
        <div className="card mb-3">
          <div className="card-body">
            <h6 className="mb-1">Avaliação</h6>
            <Estrelas nota={item.nota} />
            {item.comentario && <p className="mb-0 mt-1 text-muted">{item.comentario}</p>}
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap gap-2">
        {podeConfirmar && (
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => executarAcao('confirmar')}
            disabled={executando}
          >
            Confirmar
          </button>
        )}
        {podeConcluir && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => executarAcao('concluir')}
            disabled={executando}
          >
            Concluir
          </button>
        )}
        {podeCancelar && (
          <ConfirmarAcao
            rotulo="Cancelar"
            onConfirmar={() => executarAcao('cancelar')}
            disabled={executando}
          />
        )}
        {podeAvaliar && (
          <Link to={`/agendamentos/${item.id}/avaliar`} className="btn btn-warning btn-sm">
            Avaliar
          </Link>
        )}
      </div>
    </div>
  );
}