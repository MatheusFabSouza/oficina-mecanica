export default function Estrelas({ nota = 0, onChange }) {
  const valores = [1, 2, 3, 4, 5];

  if (!onChange) {
    return (
      <span className="text-warning fs-5" aria-label={`Nota ${nota} de 5`}>
        {valores.map((v) => (v <= nota ? '★' : '☆')).join('')}
      </span>
    );
  }

  return (
    <div className="d-flex gap-1">
      {valores.map((v) => (
        <button
          key={v}
          type="button"
          className={`btn btn-sm ${v <= nota ? 'btn-warning' : 'btn-outline-secondary'}`}
          onClick={() => onChange(v)}
        >
          {v} ★
        </button>
      ))}
    </div>
  );
}