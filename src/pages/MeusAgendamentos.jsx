import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { hojeISO, ontemISO } from '../formatos';
import Carregando from '../components/Carregando';
import Erro from '../components/Erro';
import ListaHorarios from '../components/ListaHorarios';
import CarregarMais from '../components/CarregarMais';

export default function MeusAgendamentos() {
  const [aba, setAba] = useState('proximos');

  const endpoint =
    aba === 'proximos'
      ? `/agendamentos/?data_inicio=${hojeISO()}`
      : `/agendamentos/?data_fim=${ontemISO()}&ordering=-inicio`;

  const { dados, carregando, carregandoMais, erro, proximaPagina, recarregar, carregarMais } =
    useApi(endpoint, { paginado: true });

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
            Próximos
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${aba === 'historico' ? 'active' : ''}`}
            onClick={() => setAba('historico')}
          >
            Histórico
          </button>
        </li>
      </ul>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro erro={erro} onRetry={recarregar} />
      ) : (
        <>
          <ListaHorarios itens={dados} vazio="Nenhum serviço agendado aqui" />
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