import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { DIAS_SEMANA, formatarHora } from '../../formatos';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';

export default function Horarios() {
  const { id } = useParams();
  const mecanico = useApi(`/recursos/${id}/`);
  const disp = useApi(`/disponibilidades/?recurso=${id}`, { paginado: true });

  const [editandoId, setEditandoId] = useState(null);
  const [diaSemana, setDiaSemana] = useState(0);
  const [inicio, setInicio] = useState('08:00');
  const [fim, setFim] = useState('12:00');
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState(null);

  if (mecanico.carregando || disp.carregando) return <Carregando />;
  if (mecanico.erro || disp.erro) {
    return (
      <Erro
        erro={mecanico.erro || disp.erro}
        onRetry={() => {
          mecanico.recarregar();
          disp.recarregar();
        }}
      />
    );
  }

  const lista = disp.dados || [];

  const iniciarEdicao = (item) => {
    setEditandoId(item.id);
    setDiaSemana(item.dia_semana ?? item.dia ?? 0);
    setInicio(formatarHora(item.inicio || item.hora_inicio));
    setFim(formatarHora(item.fim || item.hora_fim));
    setErroForm(null);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setDiaSemana(0);
    setInicio('08:00');
    setFim('12:00');
    setErroForm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroForm(null);
    const payload = {
      recurso: Number(id),
      dia_semana: Number(diaSemana),
      dia: Number(diaSemana),
      inicio,
      fim,
      hora_inicio: inicio,
      hora_fim: fim,
    };

    try {
      if (editandoId) {
        await api.patch(`/disponibilidades/${editandoId}/`, payload);
      } else {
        await api.post('/disponibilidades/', payload);
      }
      cancelarEdicao();
      await disp.recarregar();
    } catch (err) {
      setErroForm(err);
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async (itemId) => {
    setErroForm(null);
    try {
      await api.delete(`/disponibilidades/${itemId}/`);
      await disp.recarregar();
    } catch (err) {
      setErroForm(err);
    }
  };

  const msgErro =
    erroForm?.geral ||
    Object.values(erroForm?.campos || {}).join(' ') ||
    null;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0">Horários do mecânico</h2>
          <small className="text-muted">{mecanico.dados?.nome}</small>
        </div>
        <Link to={`/admin/mecanicos/${id}`} className="btn btn-outline-secondary btn-sm">
          Voltar ao mecânico
        </Link>
      </div>

      <Erro erro={msgErro} />

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <h6 className="mb-3">{editandoId ? 'Editar faixa de horário' : 'Adicionar faixa de horário'}</h6>
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Dia da semana</label>
            <select
              className="form-select"
              value={diaSemana}
              onChange={(e) => setDiaSemana(Number(e.target.value))}
            >
              {DIAS_SEMANA.map((d) => (
                <option key={d.valor} value={d.valor}>
                  {d.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Início</label>
            <input
              type="time"
              className="form-control"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Fim</label>
            <input
              type="time"
              className="form-control"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2 d-flex gap-1">
            <button type="submit" className="btn btn-primary w-100" disabled={salvando}>
              {editandoId ? 'Salvar' : 'Adicionar'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={cancelarEdicao}
              >
                X
              </button>
            )}
          </div>
        </div>
      </form>

      {lista.length === 0 ? (
        <div className="alert alert-warning">Sem horários: ninguém consegue agendar</div>
      ) : (
        DIAS_SEMANA.map((dia) => {
          const faixas = lista.filter((item) => (item.dia_semana ?? item.dia) === dia.valor);
          if (faixas.length === 0) return null;
          return (
            <div key={dia.valor} className="card mb-2">
              <div className="card-body">
                <h6 className="mb-2">{dia.nome}</h6>
                <div className="d-flex flex-column gap-2">
                  {faixas.map((f) => (
                    <div
                      key={f.id}
                      className="d-flex justify-content-between align-items-center border rounded p-2"
                    >
                      <span>
                        {formatarHora(f.inicio || f.hora_inicio)} às{' '}
                        {formatarHora(f.fim || f.hora_fim)}
                      </span>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => iniciarEdicao(f)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemover(f.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}