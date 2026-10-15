import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import Foto from '../../components/Foto';

export default function Servico() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const servicoReq = useApi(editando ? `/servicos/${id}/` : null, { auto: editando });
  const mecanicosReq = useApi('/recursos/', { paginado: true });

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [duracao, setDuracao] = useState(30);
  const [preco, setPreco] = useState('');
  const [recursos, setRecursos] = useState([]);
  const [ativo, setAtivo] = useState(true);
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState(null);

  useEffect(() => {
    if (servicoReq.dados) {
      const s = servicoReq.dados;
      setNome(s.nome || '');
      setDescricao(s.descricao || '');
      setDuracao(s.duracao ?? 30);
      setPreco(s.preco ?? '');
      const ids = (s.recursos || []).map((r) => (typeof r === 'object' ? r.id : r));
      setRecursos(ids);
      setAtivo(s.ativo !== false);
    }
  }, [servicoReq.dados]);

  if ((editando && servicoReq.carregando) || mecanicosReq.carregando) return <Carregando />;
  if (editando && servicoReq.erro?.status === 404) {
    return (
      <div>
        <div className="alert alert-warning">Não encontrado</div>
        <Link to="/admin/servicos" className="btn btn-outline-secondary">
          Voltar para a lista
        </Link>
      </div>
    );
  }
  if (servicoReq.erro || mecanicosReq.erro) {
    return (
      <Erro
        erro={servicoReq.erro || mecanicosReq.erro}
        onRetry={() => {
          if (editando) servicoReq.recarregar();
          mecanicosReq.recarregar();
        }}
      />
    );
  }

  const alternarMecanico = (mecanicoId) => {
    setRecursos((atual) =>
      atual.includes(mecanicoId)
        ? atual.filter((item) => item !== mecanicoId)
        : [...atual, mecanicoId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroSalvar(null);
    try {
      const dadosJson = {
        nome,
        descricao,
        duracao: Number(duracao),
        preco: String(preco),
        recursos,
        ativo,
      };

      let salvo;
      if (editando) {
        salvo = await api.patch(`/servicos/${id}/`, dadosJson);
      } else {
        salvo = await api.post('/servicos/', dadosJson);
      }

      if (arquivoImagem && salvo?.id) {
        const formData = new FormData();
        formData.append('imagem', arquivoImagem);
        await api.patch(`/servicos/${salvo.id}/`, formData);
      }

      navigate('/admin/servicos');
    } catch (err) {
      setErroSalvar(err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 560 }}>
      <h2 className="mb-3">{editando ? 'Editar serviço' : 'Novo serviço'}</h2>
      <Erro erro={erroSalvar?.geral} />

      {editando && (
        <div className="mb-3">
          <Foto
            src={servicoReq.dados?.imagem || servicoReq.dados?.foto}
            alt={servicoReq.dados?.nome}
            tamanho={72}
          />
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
          <label className="form-label">Descrição</label>
          <textarea
            className={`form-control ${erroSalvar?.campos?.descricao ? 'is-invalid' : ''}`}
            rows={2}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          {erroSalvar?.campos?.descricao && (
            <div className="invalid-feedback">{erroSalvar.campos.descricao}</div>
          )}
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label">Duração (minutos)</label>
            <input
              type="number"
              min={1}
              className={`form-control ${erroSalvar?.campos?.duracao ? 'is-invalid' : ''}`}
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              required
            />
            {erroSalvar?.campos?.duracao && (
              <div className="invalid-feedback">{erroSalvar.campos.duracao}</div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Preço (R\$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`form-control ${erroSalvar?.campos?.preco ? 'is-invalid' : ''}`}
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
            {erroSalvar?.campos?.preco && (
              <div className="invalid-feedback">{erroSalvar.campos.preco}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Imagem</label>
          <input
            type="file"
            accept="image/*"
            className={`form-control ${erroSalvar?.campos?.imagem ? 'is-invalid' : ''}`}
            onChange={(e) => setArquivoImagem(e.target.files?.[0] || null)}
          />
          {erroSalvar?.campos?.imagem && (
            <div className="invalid-feedback">{erroSalvar.campos.imagem}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Mecânicos que realizam este serviço</label>
          <div className="border rounded p-2">
            {(mecanicosReq.dados || []).length === 0 ? (
              <small className="text-muted">Nenhum mecânico cadastrado.</small>
            ) : (
              (mecanicosReq.dados || []).map((m) => (
                <div key={m.id} className="form-check">
                  <input
                    id={`rec-${m.id}`}
                    type="checkbox"
                    className="form-check-input"
                    checked={recursos.includes(m.id)}
                    onChange={() => alternarMecanico(m.id)}
                  />
                  <label htmlFor={`rec-${m.id}`} className="form-check-label">
                    {m.nome}
                  </label>
                </div>
              ))
            )}
          </div>
          {erroSalvar?.campos?.recursos && (
            <div className="text-danger small mt-1">{erroSalvar.campos.recursos}</div>
          )}
        </div>

        <div className="form-check mb-3">
          <input
            id="servico-ativo"
            type="checkbox"
            className="form-check-input"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
          />
          <label htmlFor="servico-ativo" className="form-check-label">
            Ativo
          </label>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <Link to="/admin/servicos" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}