import { useState } from 'react';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import HorarioItem from '../../components/HorarioItem';
import CarregarMais from '../../components/CarregarMais';
import ConfirmarAcao from '../../components/ConfirmarAcao';

export default function AConfirmar() {
  const { dados, carregando, carregandoMais, erro, proximaPagina, recarregar, carregarMais } =
    useApi('/agendamentos/?status=solicitado', { paginado: true });
  const [erroAcao, setErroAcao] = useState(null);
  const [processandoId, setProcessandoId] = useState(null);

  const executar = async (id, acao) => {
    setProcessandoId(id);
    setErroAcao(null);
    try {
      await api.post(`/agendamentos/${id}/${acao}/`);
      await recarregar();
    } catch (err) {
      setErroAcao(err);
    } finally {
      setProcessandoId(null);
    }
  };

  if (carregando) return <Carregando />;
  if (erro) return <Erro erro={erro} onRetry={recarregar} />;

  const lista = dados || [];

  return (
    <div>
      <h2 className="mb-3">A confirmar</h2>
      <Erro erro={erroAcao} />

      {lista.length === 0 ? (
        <p className="text-muted">Nenhum pedido para confirmar</p>
      ) : (
        <>
          {lista.map((item) => (
            <HorarioItem
              key={item.id}
              item={item}
              destino={`/admin/agendamentos/${item.id}`}
              mostrarCliente
              acoes={
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={processandoId === item.id}
                    onClick={() => executar(item.id, 'confirmar')}
                  >
                    Confirmar
                  </button>
                  <ConfirmarAcao
                    rotulo="Cancelar"
                    disabled={processandoId === item.id}
                    onConfirmar={() => executar(item.id, 'cancelar')}
                  />
                </div>
              }
            />
          ))}
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