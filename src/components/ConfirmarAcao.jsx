import { useState } from 'react';
import Confirmacao from './Confirmacao';

export default function ConfirmarAcao({
  rotulo = 'Cancelar',
  mensagem = 'Deseja realmente cancelar este serviço agendado?',
  classeBotao = 'btn btn-outline-danger btn-sm',
  onConfirmar,
  disabled = false,
}) {
  const [aberto, setAberto] = useState(false);
  const [executando, setExecutando] = useState(false);

  const confirmar = async () => {
    setExecutando(true);
    try {
      await onConfirmar();
      setAberto(false);
    } finally {
      setExecutando(false);
    }
  };

  if (aberto) {
    return (
      <Confirmacao
        mensagem={mensagem}
        onConfirmar={confirmar}
        onCancelar={() => setAberto(false)}
        carregando={executando}
      />
    );
  }

  return (
    <button
      type="button"
      className={classeBotao}
      onClick={() => setAberto(true)}
      disabled={disabled}
    >
      {rotulo}
    </button>
  );
}