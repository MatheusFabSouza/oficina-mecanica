import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Erro from '../components/Erro';

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      await cadastrar(nome, email, senha);
      navigate('/inicio', { replace: true });
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 420 }}>
      <h2 className="mb-3">Criar conta</h2>
      <Erro erro={erro?.geral} />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className={`form-control ${erro?.campos?.nome ? 'is-invalid' : ''}`}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          {erro?.campos?.nome && <div className="invalid-feedback">{erro.campos.nome}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className={`form-control ${erro?.campos?.email ? 'is-invalid' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {erro?.campos?.email && <div className="invalid-feedback">{erro.campos.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className={`form-control ${erro?.campos?.senha ? 'is-invalid' : ''}`}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          {erro?.campos?.senha && <div className="invalid-feedback">{erro.campos.senha}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={carregando}>
          {carregando ? 'Aguarde...' : 'Criar conta'}
        </button>
      </form>
      <div className="mt-3 text-center">
        <Link to="/login">Já tem conta? Entrar</Link>
      </div>
    </div>
  );
}