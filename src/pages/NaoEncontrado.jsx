import { Link } from 'react-router-dom';

export default function NaoEncontrado() {
  return (
    <div className="container py-5 text-center">
      <h2 className="mb-2">Não encontrado</h2>
      <p className="text-muted mb-3">A página solicitada não existe.</p>
      <Link to="/" className="btn btn-primary">
        Voltar ao início
      </Link>
    </div>
  );
}