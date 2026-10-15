import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ORGANIZACAO } from '../api/client';
import Erro from '../components/Erro';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      await api.post(
        '/auth/redefinir-senha/',
        { organizacao: ORGANIZACAO, email },
        { publico: true }
      );
      setEnviado(true);
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 420 }}>
      <h2 className="mb-3">Esqueci minha senha</h2>
      {enviado ? (
        <div className="alert alert-success">
          Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha
        </div>
      ) : (
        <>
          <Erro erro={erro} />
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={carregando}>
              {carregando ? 'Enviando...' : 'Enviar link'}
            </button>
          </form>
        </>
      )}
      <div className="mt-3">
        <Link to="/login">Voltar para o login</Link>
      </div>
    </div>
  );
}