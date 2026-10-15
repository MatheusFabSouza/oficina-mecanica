import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { hojeISO, formatarHora } from '../../formatos';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import SeletorData from '../../components/SeletorData';

function agruparPorMecanico(dados, mecanicoSelecionado) {
  if (!dados) return [];
  const lista = Array.isArray(dados) ? dados : dados.results || [];
  if (lista.length === 0) return [];

  if (lista[0]?.horarios && Array.isArray(lista[0].horarios)) {
    return lista
      .map((item) => ({
        id: item.recurso?.id ?? item.recurso_id ?? item.id,
        nome: item.recurso?.nome ?? item.recurso_nome ?? item.nome ?? 'Mecânico',
        horarios: item.horarios,
      }))
      .filter((g) => g.horarios.length > 0);
  }

  if (typeof lista[0] === 'string') {
    if (!mecanicoSelecionado) return [];
    return [
      {
        id: mecanicoSelecionado.id,
        nome: mecanicoSelecionado.nome,
        horarios: lista,
      },
    ];
  }

  const mapa = new Map();
  lista.forEach((slot) => {
    const id = slot.recurso?.id ?? slot.recurso_id ?? slot.recurso ?? mecanicoSelecionado?.id;
    const nome =
      slot.recurso?.nome ??
      slot.recurso_nome ??
      mecanicoSelecionado?.nome ??
      `Mecânico #${id}`;
    const horario = slot.inicio || slot.horario || slot.hora;
    if (!id || !horario) return;
    if (!mapa.has(id)) {
      mapa.set(id, { id, nome, horarios: [] });
    }
    mapa.get(id).horarios.push(horario);
  });

  return Array.from(mapa.values());
}

export default function EscolherHorario() {
  const location = useLocation();
  const navigate = useNavigate();
  const servico = location.state?.servico;
  const mecanico = location.state?.mecanico || null;
  const erroAnterior = location.state?.erroHorario || null;

  const [data, setData] = useState(location.state?.data || hojeISO());

  const query = servico
    ? `/horarios-livres/?servico=${servico.id}&data=${data}${
        mecanico ? `&recurso=${mecanico.id}` : ''
      }`
    : null;

  const { dados, carregando, erro, recarregar } = useApi(query, {
    auto: Boolean(servico),
  });

  if (!servico) return <Navigate to="/agendar" replace />;

  const grupos = agruparPorMecanico(dados, mecanico);

  const selecionarHorario = (grupo, slot) => {
    const horaStr = typeof slot === 'string' ? slot : slot.inicio || slot.horario;
    const inicioISO = horaStr.includes('T')
      ? horaStr
      : `${data}T${horaStr.slice(0, 5)}:00`;

    navigate('/agendar/confirmar', {
      state: {
        servico,
        mecanico: { id: grupo.id, nome: grupo.nome },
        data,
        inicio: inicioISO,
      },
    });
  };

  const sugerirProximoDia = () => {
    const d = new Date(`${data}T00:00:00`);
    d.setDate(d.getDate() + 1);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    setData(`${ano}-${mes}-${dia}`);
  };

  return (
    <div>
      <h2 className="mb-1">Escolher data e horário</h2>
      <p className="text-muted mb-3">
        Serviço: {servico.nome}
        {mecanico ? ` • Mecânico: ${mecanico.nome}` : ''}
      </p>

      {erroAnterior && <Erro erro={erroAnterior} />}

      <SeletorData valor={data} onChange={setData} min={hojeISO()} />

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro erro={erro} onRetry={recarregar} />
      ) : grupos.length === 0 ? (
        <div className="card p-3">
          <p className="text-muted mb-2">Sem horários livres neste dia</p>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={sugerirProximoDia}
            >
              Tentar no próximo dia
            </button>
          </div>
        </div>
      ) : (
        grupos.map((grupo) => (
          <div key={grupo.id} className="card mb-3">
            <div className="card-body">
              <h6 className="mb-2">{grupo.nome}</h6>
              <div className="d-flex flex-wrap gap-2">
                {grupo.horarios.map((slot, idx) => {
                  const valor = typeof slot === 'string' ? slot : slot.inicio || slot.horario;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => selecionarHorario(grupo, slot)}
                    >
                      {formatarHora(valor)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}