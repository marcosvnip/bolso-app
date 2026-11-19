function pad(n) {
  return String(n).padStart(2, '0');
}

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function daysAgoISO(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toISODate(d);
}

export function formatDate(iso) {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

export function formatMoney(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function currentMonthLabel() {
  const label = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const MONTH_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Devolve os últimos "count" meses (do mais antigo ao atual) com chave AAAA-MM e nome curto
export function lastMonths(count) {
  const result = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`, label: MONTH_NAMES[d.getMonth()] });
  }
  return result;
}
