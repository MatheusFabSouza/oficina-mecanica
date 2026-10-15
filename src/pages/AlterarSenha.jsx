import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Erro from '../components/Erro';

export default function AlterarSenha() {
  const navigate = useNavigate();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erroConfirmacao, setErroConfirmacao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    if (novaSenha !== confirmacao) {
      setErroConfirmacao('A confirmação não coincide com a nova senha.');
      return;
    }
    setErroConfirmacao('');
    setSalvando(true);
    try {
      await api.post('/auth/alterar-senha/', {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
      });
      navigate('/perfil', { state: { mensagem: 'Senha alterada' } });
    } catch (err) {
      setErro(err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 420 }}>
      <h2 className="mb-3">Alterar senha</h2>
      <Erro erro={erro?.geral} />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Senha atual</label>
          <input
            type="password"
            className={`form-control ${erro?.campos?.senha_atual ? 'is-invalid' : ''}`}
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            required
          />
          {erro?.campos?.senha_atual && (
            <div className="invalid-feedback">{erro.campos.senha_atual}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Nova senha</label>
          <input
            type="password"
            className={`form-control ${erro?.campos?.nova_senha ? 'is-invalid' : ''}`}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />
          {erro?.campos?.nova_senha && (
            <div className="invalid-feedback">{erro.campos.nova_senha}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmar nova senha</label>
          <input
            type="password"
            className={`form-control ${erroConfirmacao ? 'is-invalid' : ''}`}
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            required
          />
          {erroConfirmacao && <div className="invalid-feedback">{erroConfirmacao}</div>}
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <Link to="/perfil" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}