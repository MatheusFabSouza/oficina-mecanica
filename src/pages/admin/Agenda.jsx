import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { hojeISO } from '../../formatos';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import SeletorData from '../../components/SeletorData';
import ListaHorarios from '../../components/ListaHorarios';

export default function Agenda() {
  const [data, setData] = useState(hojeISO());
  const [recursoId, setRecursoId] = useState('');
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const mecanicos = useApi('/recursos/', { paginado: true });

  const carregarAgenda = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const filtroRecurso = recursoId ? `&recurso=\${recursoId}` : '';
      const url = `/agendamentos/?data_inicio=\${data}&data_fim=${data}${filtroRecurso}`;
      const lista = await api.getAllPages(url);
      setItens(lista);
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  }, [data, recursoId]);

  useEffect(() => {
    carregarAgenda();
  }, [carregarAgenda]);

  return (
    <div>
      <h2 className="mb-3">Agenda do dia</h2>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <SeletorData valor={data} onChange={setData} />

        <div className="mb-3">
          <select
            className="form-select form-select-sm"
            value={recursoId}
            onChange={(e) => setRecursoId(e.target.value)}
          >
            <option value="">Todos os mecânicos</option>
            {(mecanicos.dados || []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro erro={erro} onRetry={carregarAgenda} />
      ) : (
        <ListaHorarios
          itens={itens}
          vazio="Nenhum serviço agendado neste dia"
          destinoBase="/admin/agendamentos"
          mostrarCliente
        />
      )}
    </div>
  );
}