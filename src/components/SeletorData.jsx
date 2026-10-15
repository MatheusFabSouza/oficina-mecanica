export default function SeletorData({ valor, onChange, min }) {
  const alterarDia = (delta) => {
    const base = valor ? new Date(`${valor}T00:00:00`) : new Date();
    base.setDate(base.getDate() + delta);
    const ano = base.getFullYear();
    const mes = String(base.getMonth() + 1).padStart(2, '0');
    const dia = String(base.getDate()).padStart(2, '0');
    const novaData = `${ano}-${mes}-${dia}`;
    if (min && novaData < min) return;
    onChange(novaData);
  };

  return (
    <div className="d-flex align-items-center gap-2 mb-3">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => alterarDia(-1)}
        disabled={Boolean(min && valor <= min)}
      >
        &laquo; Dia anterior
      </button>
      <input
        type="date"
        className="form-control form-control-sm w-auto"
        value={valor}
        min={min}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => alterarDia(1)}
      >
        Próximo dia &raquo;
      </button>
    </div>
  );
}