export default function CarregarMais({ temMais, carregando, onClick }) {
  if (!temMais) return null;

  return (
    <div className="text-center my-3">
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={onClick}
        disabled={carregando}
      >
        {carregando ? 'Carregando...' : 'Carregar mais'}
      </button>
    </div>
  );
}