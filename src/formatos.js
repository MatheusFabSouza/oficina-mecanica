export const DIAS_SEMANA = [
  { valor: 0, nome: 'Segunda-feira' },
  { valor: 1, nome: 'Terça-feira' },
  { valor: 2, nome: 'Quarta-feira' },
  { valor: 3, nome: 'Quinta-feira' },
  { valor: 4, nome: 'Sexta-feira' },
  { valor: 5, nome: 'Sábado' },
  { valor: 6, nome: 'Domingo' },
];

export function hojeISO() {
  const d = new Date();
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function ontemISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function formatarData(valor) {
  if (!valor) return '';
  const dataStr = valor.includes('T') ? valor : `${valor}T00:00:00`;
  return new Date(dataStr).toLocaleDateString('pt-BR');
}

export function formatarHora(valor) {
  if (!valor) return '';
  if (/^\d{2}:\d{2}/.test(valor)) return valor.slice(0, 5);
  return new Date(valor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatarDataHora(valor) {
  if (!valor) return '';
  return `${formatarData(valor)} às ${formatarHora(valor)}`;
}

export function formatarPreco(valor) {
  if (valor === null || valor === undefined) return '';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarDuracao(minutos) {
  if (!minutos) return '';
  return `${minutos} min`;
}