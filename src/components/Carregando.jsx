export default function Carregando() {
  return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
      <p className="mt-2 text-muted">Carregando...</p>
    </div>
  );
}