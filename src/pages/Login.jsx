import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Erro from '../components/Erro';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      const dados = await login(email, senha);
      const admin = dados?.permissoes?.includes('api.change_organizacao');
      navigate(admin ? '/admin/agenda' : '/inicio', { replace: true });
    } catch (err) {
      if (err.status === 400) {
        setErro('Organização, e-mail ou senha inválidos');
      } else {
        setErro(err.geral || 'Erro ao entrar.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 420 }}>
      <h2 className="mb-3">Entrar</h2>
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
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div className="mt-3 d-flex justify-content-between">
        <Link to="/cadastro">Criar conta</Link>
        <Link to="/esqueci-senha">Esqueci minha senha</Link>
      </div>
    </div>
  );
}