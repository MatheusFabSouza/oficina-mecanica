export default function FiltroAtivo({ valor, onChange }) {
  const opcoes = [
    { rotulo: 'Todos', valor: '' },
    { rotulo: 'Ativos', valor: 'true' },
    { rotulo: 'Inativos', valor: 'false' },
  ];

  return (
    <div className="btn-group btn-group-sm mb-3" role="group">
      {opcoes.map((op) => (
        <button
          key={op.valor}
          type="button"
          className={`btn ${valor === op.valor ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onChange(op.valor)}
        >
          {op.rotulo}
        </button>
      ))}
    </div>
  );
}