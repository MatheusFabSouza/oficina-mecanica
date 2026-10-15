export default function Confirmacao({
  mensagem = 'Tem certeza que deseja continuar?',
  onConfirmar,
  onCancelar,
  carregando = false,
}) {
  return (
    <div className="alert alert-warning my-2">
      <p className="mb-2">{mensagem}</p>
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={onConfirmar}
          disabled={carregando}
        >
          {carregando ? 'Aguarde...' : 'Sim, confirmar'}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={onCancelar}
          disabled={carregando}
        >
          Não
        </button>
      </div>
    </div>
  );
}