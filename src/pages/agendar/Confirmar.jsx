import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { formatarDataHora, formatarDuracao, formatarPreco } from '../../formatos';
import Erro from '../../components/Erro';

export default function Confirmar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { servico, mecanico, data, inicio } = location.state || {};

  const [observacoes, setObservacoes] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  if (!servico || !mecanico || !inicio) {
    return <Navigate to="/agendar" replace />;
  }

  const handleConfirmar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const criado = await api.post('/agendamentos/', {
        servico: servico.id,
        recurso: mecanico.id,
        inicio,
        observacoes,
      });
      navigate('/agendar/enviado', {
        replace: true,
        state: { agendamento: criado, servico, mecanico },
      });
    } catch (err) {
      if (err.status === 400 && (err.campos?.inicio || err.geral)) {
        const msg = err.campos?.inicio || err.geral;
        navigate('/agendar/horario', {
          replace: true,
          state: { servico, mecanico, data, erroHorario: msg },
        });
      } else {
        setErro(err);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 520 }}>
      <h2 className="mb-3">Confirmar agendamento</h2>
      <Erro erro={erro?.geral} />

      <div className="card mb-3">
        <div className="card-body">
          <p className="mb-1">
            <strong>Serviço:</strong> {servico.nome}
          </p>
          <p className="mb-1">
            <strong>Mecânico:</strong> {mecanico.nome}
          </p>
          <p className="mb-1">
            <strong>Data e horário:</strong> {formatarDataHora(inicio)}
          </p>
          <p className="mb-1">
            <strong>Duração:</strong> {formatarDuracao(servico.duracao)}
          </p>
          <p className="mb-0">
            <strong>Preço:</strong> {formatarPreco(servico.preco)}
          </p>
        </div>
      </div>

      <form onSubmit={handleConfirmar}>
        <div className="mb-3">
          <label className="form-label">Veículo e observações (modelo e placa)</label>
          <textarea
            className={`form-control ${erro?.campos?.observacoes ? 'is-invalid' : ''}`}
            rows={3}
            placeholder="Fiat Argo ABC1D23: barulho na suspensão dianteira"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            required
          />
          {erro?.campos?.observacoes && (
            <div className="invalid-feedback">{erro.campos.observacoes}</div>
          )}
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando ? 'Confirmando...' : 'Confirmar'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
            disabled={enviando}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}