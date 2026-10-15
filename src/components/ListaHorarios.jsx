import HorarioItem from './HorarioItem';

export default function ListaHorarios({
  itens = [],
  vazio = 'Nenhum serviço agendado aqui',
  destinoBase = '/agendamentos',
  mostrarCliente = false,
}) {
  if (!itens || itens.length === 0) {
    return <p className="text-muted my-3">{vazio}</p>;
  }

  return (
    <div>
      {itens.map((item) => (
        <HorarioItem
          key={item.id}
          item={item}
          destino={`${destinoBase}/${item.id}`}
          mostrarCliente={mostrarCliente}
        />
      ))}
    </div>
  );
}