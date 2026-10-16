import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Carregando from '../components/Carregando';
import Erro from '../components/Erro';
import ListaHorarios from '../components/ListaHorarios';
import CarregarMais from '../components/CarregarMais';

export default function MeusAgendamentos() {
  const [aba, setAba] = useState('proximos');

  // Buscamos os agendamentos gerais para filtrar localmente com precisão por status
  const { dados, carregando, carregandoMais, erro, proximaPagina, recarregar, carregarMais } =
    useApi('/agendamentos/', { paginado: true });

  const listaAgendamentos = dados || [];

  // Filtro para a aba "Próximos": apenas os que estão "em andamento" (ou solicitados/confirmados se aplicável)
  const proximosFiltrados = listaAgendamentos.filter((item) => {
    const status = (item.status || '').toLowerCase();
    return status === 'em_andamento' || status === 'em andamento' || status === 'solicitado' || status === 'confirmado';
  });

  // Filtro para a aba "Histórico": estritamente os concluídos
  const historicoFiltrados = listaAgendamentos.filter((item) => {
    const status = (item.status || '').toLowerCase();
    return status === 'concluido' || status === 'concluído';
  });

  const itensExibidos = aba === 'proximos' ? proximosFiltrados : historicoFiltrados;

  return (
    <div>
      <h2 className="mb-3">Meus serviços agendados</h2>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${aba === 'proximos' ? 'active' : ''}`}
            onClick={() => setAba('proximos')}
          >
            Próximos (Em andamento)
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${aba === 'historico' ? 'active' : ''}`}
            onClick={() => setAba('historico')}
          >
            Histórico (Concluídos)
          </button>
        </li>
      </ul>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro erro={erro} onRetry={recarregar} />
      ) : (
        <>
          <ListaHorarios 
            itens={itensExibidos} 
            vazio={aba === 'proximos' ? 'Nenhum serviço em andamento no momento' : 'Nenhum serviço concluído no histórico'} 
          />
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