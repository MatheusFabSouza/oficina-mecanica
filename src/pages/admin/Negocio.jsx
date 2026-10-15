import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../AuthContext';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import Foto from '../../components/Foto';

export default function Negocio() {
  const { recarregarUsuario } = useAuth();
  const { dados, carregando, erro, recarregar } = useApi('/organizacao/');

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivoLogo, setArquivoLogo] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState(null);
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    if (dados) {
      setNome(dados.nome || '');
      setDescricao(dados.descricao || '');
    }
  }, [dados]);

  if (carregando) return <Carregando />;
  if (erro) return <Erro erro={erro} onRetry={recarregar} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroSalvar(null);
    setSucesso('');
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      if (arquivoLogo) {
        formData.append('logo', arquivoLogo);
      }
      await api.patch('/organizacao/', formData);
      await recarregar();
      await recarregarUsuario();
      setArquivoLogo(null);
      setSucesso('Dados do negócio atualizados.');
    } catch (err) {
      setErroSalvar(err);
    } finally {
      setSalvando(false);
    }
  };

  const handleRemoverLogo = async () => {
    setSalvando(true);
    setErroSalvar(null);
    setSucesso('');
    try {
      await api.patch('/organizacao/', { logo: null });
      await recarregar();
      await recarregarUsuario();
      setSucesso('Logo removido.');
    } catch (err) {
      setErroSalvar(err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 540 }}>
      <h2 className="mb-3">Dados do negócio</h2>
      {sucesso && <div className="alert alert-success">{sucesso}</div>}
      <Erro erro={erroSalvar?.geral} />

      <div className="mb-3">
        <Foto src={dados?.logo} alt={dados?.nome} tamanho={80} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className={`form-control ${erroSalvar?.campos?.nome ? 'is-invalid' : ''}`}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          {erroSalvar?.campos?.nome && (
            <div className="invalid-feedback">{erroSalvar.campos.nome}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            className={`form-control ${erroSalvar?.campos?.descricao ? 'is-invalid' : ''}`}
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          {erroSalvar?.campos?.descricao && (
            <div className="invalid-feedback">{erroSalvar.campos.descricao}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Logo</label>
          <input
            type="file"
            accept="image/*"
            className={`form-control ${erroSalvar?.campos?.logo ? 'is-invalid' : ''}`}
            onChange={(e) => setArquivoLogo(e.target.files?.[0] || null)}
          />
          {erroSalvar?.campos?.logo && (
            <div className="invalid-feedback">{erroSalvar.campos.logo}</div>
          )}
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          {dados?.logo && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleRemoverLogo}
              disabled={salvando}
            >
              Remover logo
            </button>
          )}
        </div>
      </form>
    </div>
  );
}