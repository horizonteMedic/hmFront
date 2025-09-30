// Formatea fechas a español largo: "miércoles 03 septiembre 2025"
export function formatDateLongEs(input) {
  if (!input) return "";
  const str = String(input).trim();
  const parts = str.match(/\d{1,4}/g) || [];
  let d, m, y;
  if (parts.length >= 3) {
    if (parts[0].length === 4) {
      y = Number(parts[0]); m = Number(parts[1]); d = Number(parts[2]);
    } else {
      d = Number(parts[0]); m = Number(parts[1]); y = Number(parts[2]);
    }
  }
  if (!y || !m || !d) return "";
  const date = new Date(Date.UTC(y, m - 1, d));
  if (isNaN(date.getTime())) return "";
  const dias = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const diaSemana = dias[date.getUTCDay()];
  const dia = String(d).padStart(2, '0');
  const mes = meses[m - 1];
  const anio = y;
  return `${diaSemana} ${dia} ${mes} ${anio}`;
}


