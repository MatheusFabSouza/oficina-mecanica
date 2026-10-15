import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Carregando from '../components/Carregando';
import Erro from '../components/Erro';
import Foto from '../components/Foto';

export default function Mecanicos() {
  const { dados, carregando, erro, recarregar } = useApi('/recursos/', { paginado: true });

  if (carregando) return <Carregando />;
  if (erro) return <Erro erro={erro} onRetry={recarregar} />;

  const mecanicos = (dados || []).filter((m) => m.ativo !== false);

  return (
    <div>
      <h2 className="mb-3">Mecânicos</h2>
      {mecanicos.length === 0 ? (
        <p className="text-muted">Nenhum mecânico cadastrado</p>
      ) : (
        <div className="row g-3">
          {mecanicos.map((m) => (
            <div key={m.id} className="col-md-6">
              <Link to={`/mecanicos/${m.id}`} className="text-decoration-none text-dark">
                <div className="card h-100">
                  <div className="card-body d-flex gap-3 align-items-center">
                    <Foto src={m.foto} alt={m.nome} tamanho={64} arredondado />
                    <div>
                      <h5 className="mb-1">{m.nome}</h5>
                      {m.bio && <p className="text-muted small mb-0">{m.bio}</p>}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}   