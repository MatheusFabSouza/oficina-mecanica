const CORES = {
  solicitado: 'warning text-dark',
  confirmado: 'primary',
  concluido: 'success',
  cancelado: 'secondary',
};

const NOMES = {
  solicitado: 'Solicitado',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export default function StatusHorario({ status }) {
  if (!status) return null;
  const cor = CORES[status] || 'secondary';
  const nome = NOMES[status] || status;

  return <span className={`badge bg-${cor}`}>{nome}</span>;
}