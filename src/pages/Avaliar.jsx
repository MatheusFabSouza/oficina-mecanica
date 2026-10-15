import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import Estrelas from '../components/Estrelas';
import Erro from '../components/Erro';

export default function Avaliar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await api.post(`/agendamentos/${id}/avaliar/`, { nota, comentario });
      navigate(`/agendamentos/${id}`, { replace: true });
    } catch (err) {
      setErro(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 480 }}>
      <h2 className="mb-3">Avaliar serviço</h2>
      <Erro erro={erro?.geral || erro?.campos?.nota} />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nota (1 a 5)</label>
          <Estrelas nota={nota} onChange={setNota} />
        </div>
        <div className="mb-3">
          <label className="form-label">Comentário</label>
          <textarea
            className="form-control"
            rows={3}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
          <Link to={`/agendamentos/${id}`} className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}