export default function Erro({ erro, onRetry }) {
  if (!erro) return null;
  const mensagem = typeof erro === 'string' ? erro : erro.geral || 'Ocorreu um erro.';

  return (
    <div className="alert alert-danger my-3 d-flex justify-content-between align-items-center">
      <span>{mensagem}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Tentar de novo
        </button>
      )}
    </div>
  );
}