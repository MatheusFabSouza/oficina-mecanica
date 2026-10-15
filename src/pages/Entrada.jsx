import { Link } from 'react-router-dom';
import Foto from '../components/Foto';

export default function Entrada() {
  return (
    <div className="text-center py-5">
      <div className="mb-3">
        <Foto src="/favicon.svg" alt="Oficina Mecânica" tamanho={96} />
      </div>
      <h1 className="mb-2">Oficina Mecânica</h1>
      <p className="text-muted mb-4">Agende revisões e reparos para o seu veículo.</p>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/login" className="btn btn-primary">
          Entrar
        </Link>
        <Link to="/cadastro" className="btn btn-outline-primary">
          Criar conta
        </Link>
      </div>
    </div>
  );
}