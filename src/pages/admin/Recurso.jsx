import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import Foto from '../../components/Foto';

export default function Recurso() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const { dados, carregando, erro, recarregar } = useApi(
    editando ? `/recursos/${id}/` : null,
    { auto: editando }
  );

  const [nome, setNome] = useState('');
  const [bio, setBio] = useState('');
  const [capacidade, setCapacidade] = useState(1);
  const [ativo, setAtivo] = useState(true);
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState(null);

  useEffect(() => {
    if (dados) {
      setNome(dados.nome || '');
      setBio(dados.bio || '');
      setCapacidade(dados.capacidade ?? 1);
      setAtivo(dados.ativo !== false);
    }
  }, [dados]);

  if (editando && carregando) return <Carregando />;
  if (editando && erro?.status === 404) {
    return (
      <div>
        <div className="alert alert-warning">Não encontrado</div>
        <Link to="/admin/mecanicos" className="btn btn-outline-secondary">
          Voltar para a lista
        </Link>
      </div>
    );
  }
  if (editando && erro) return <Erro erro={erro} onRetry={recarregar} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroSalvar(null);
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('bio', bio);
      formData.append('capacidade', Number(capacidade));
      formData.append('ativo', ativo);
      if (arquivoFoto) {
        formData.append('foto', arquivoFoto);
      }

      if (editando) {
        await api.patch(`/recursos/${id}/`, formData);
      } else {
        await api.post('/recursos/', formData);
      }
      navigate('/admin/mecanicos');
    } catch (err) {
      setErroSalvar(err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 540 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">{editando ? 'Editar mecânico' : 'Novo mecânico'}</h2>
        {editando && (
          <Link
            to={`/admin/mecanicos/${id}/horarios`}
            className="btn btn-outline-primary btn-sm"
          >
            Horários
          </Link>
        )}
      </div>

      <Erro erro={erroSalvar?.geral} />

      {editando && (
        <div className="mb-3">
          <Foto src={dados?.foto} alt={dados?.nome} tamanho={72} arredondado />
        </div>
      )}

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
          <label className="form-label">Bio / Especialidade</label>
          <textarea
            className={`form-control ${erroSalvar?.campos?.bio ? 'is-invalid' : ''}`}
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          {erroSalvar?.campos?.bio && (
            <div className="invalid-feedback">{erroSalvar.campos.bio}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Capacidade (atendimentos simultâneos)</label>
          <input
            type="number"
            min={1}
            className={`form-control ${erroSalvar?.campos?.capacidade ? 'is-invalid' : ''}`}
            value={capacidade}
            onChange={(e) => setCapacidade(e.target.value)}
            required
          />
          {erroSalvar?.campos?.capacidade && (
            <div className="invalid-feedback">{erroSalvar.campos.capacidade}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Foto</label>
          <input
            type="file"
            accept="image/*"
            className={`form-control ${erroSalvar?.campos?.foto ? 'is-invalid' : ''}`}
            onChange={(e) => setArquivoFoto(e.target.files?.[0] || null)}
          />
          {erroSalvar?.campos?.foto && (
            <div className="invalid-feedback">{erroSalvar.campos.foto}</div>
          )}
        </div>

        <div className="form-check mb-3">
          <input
            id="mecanico-ativo"
            type="checkbox"
            className="form-check-input"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
          />
          <label htmlFor="mecanico-ativo" className="form-check-label">
            Ativo
          </label>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <Link to="/admin/mecanicos" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}