import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api/client';
import Foto from '../components/Foto';
import Erro from '../components/Erro';

export default function Perfil() {
  const { usuario, recarregarUsuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [nome, setNome] = useState(usuario?.nome || '');
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState(location.state?.mensagem || '');

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    setMensagem('');
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      if (arquivoFoto) {
        formData.append('foto', arquivoFoto);
      }
      await api.patch('/auth/eu/', formData);
      await recarregarUsuario();
      setArquivoFoto(null);
      setMensagem('Perfil atualizado.');
    } catch (err) {
      setErro(err);
    } finally {
      setSalvando(false);
    }
  };

  const handleRemoverFoto = async () => {
    setSalvando(true);
    setErro(null);
    setMensagem('');
    try {
      await api.patch('/auth/eu/', { foto: null });
      await recarregarUsuario();
      setMensagem('Foto removida.');
    } catch (err) {
      setErro(err);
    } finally {
      setSalvando(false);
    }
  };

  const handleSair = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 500 }}>
      <h2 className="mb-3">Meu perfil</h2>
      {mensagem && <div className="alert alert-success">{mensagem}</div>}
      <Erro erro={erro?.geral} />

      <div className="d-flex align-items-center gap-3 mb-4">
        <Foto src={usuario?.foto} alt={usuario?.nome} tamanho={72} arredondado />
        <div>
          <div className="fw-bold">{usuario?.nome}</div>
          <div className="text-muted small">{usuario?.email}</div>
          <div className="text-muted small">
            Negócio: {usuario?.organizacao?.nome || 'Oficina Mecânica'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSalvar} className="mb-4">
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
          <label className="form-label">Foto</label>
          <input
            type="file"
            accept="image/*"
            className={`form-control ${erro?.campos?.foto ? 'is-invalid' : ''}`}
            onChange={(e) => setArquivoFoto(e.target.files?.[0] || null)}
          />
          {erro?.campos?.foto && <div className="invalid-feedback">{erro.campos.foto}</div>}
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          {usuario?.foto && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleRemoverFoto}
              disabled={salvando}
            >
              Remover foto
            </button>
          )}
        </div>
      </form>

      <hr />
      <div className="d-flex justify-content-between">
        <Link to="/alterar-senha" className="btn btn-outline-primary">
          Alterar senha
        </Link>
        <button type="button" className="btn btn-outline-danger" onClick={handleSair}>
          Sair
        </button>
      </div>
    </div>
  );
}