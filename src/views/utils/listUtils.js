export function normalizeList(value) {
  if (Array.isArray(value)) {
    return value
      .map(v => String(v).trim())
      .filter(Boolean)
      .map(v => v.toUpperCase());
  }
  if (typeof value === 'string') {
    // Aceptar saltos reales (\n, \r\n), literal "\\n", separador "/n" y el posible "7n" mencionado
    const parts = value
      .split(/\r\n|\r|\n|\\n|\/n|7n/g)
      .map(v => String(v).trim())
      .filter(Boolean);
    return parts.map(v => v.toUpperCase());
  }
  return [];
}


