// Estados que puede tener un diente en el odontograma: única fuente para el menú del click derecho, el indicador
// sobre el diente, la leyenda, los contadores y la conversión de/hacia lo que guarda el backend.
//
// Qué guarda el backend por diente (lbl11..lbl48): la ruta de una imagen del sistema anterior
// ("jar:file:/C:/hmsoft/hmsoft.jar!/imagenes/odontograma/<imagen>.png"); null si el diente está Normal.
// Por eso cada estado tiene su `imagen`: renombrar un estado en pantalla no cambia lo ya guardado.
//
// - `clave`: campo del formulario donde se cuenta cuántos dientes tienen ese estado.
// - `grupo`: estados que el menú agrupa en un submenú (Resina, Amalgama).
// - `legacy`: ya no se ofrece en el menú, pero los odontogramas guardados con él se siguen leyendo, mostrando
//   y contando (su leyenda y su contador solo aparecen si el odontograma actual lo tiene).
// - `alias`: otras imágenes antiguas que se leen como este mismo estado (PPR Metálica / PPR Acrílica -> PPR).
// - `malEstado`: cuenta para "Dientes en mal estado".

export const ESTADOS = [
  { label: "Ausente", clave: "ausente", simbolo: "✕", color: "text-blue-500", tamano: "text-6xl", imagen: "imgAusente" },
  { label: "Carie Dental", clave: "cariada", simbolo: "●", color: "text-red-500", tamano: "text-7xl", imagen: "imgPorOturar", malEstado: true },
  { label: "Fractura", clave: "fracturada", simbolo: "╱", color: "text-red-500", tamano: "text-6xl", imagen: "imgFracturada", malEstado: true },
  { label: "Corona", clave: "corona", simbolo: "©", color: "text-blue-500", tamano: "text-6xl", imagen: "imgCorona" },
  { label: "Puente", clave: "puente", simbolo: "▭", color: "text-black", tamano: "text-6xl", imagen: "imgPuente" },
  { label: "PPR", clave: "ppr", simbolo: "=", color: "text-blue-500", tamano: "text-6xl", imagen: "imgPPR", alias: ["imgPPRMetalica", "imgPPRAcrilica"] },
  { label: "Implante", clave: "implante", simbolo: "⊥", color: "text-black", tamano: "text-6xl", imagen: "imgImplante" },
  { label: "Resina Roja", clave: "resinaRoja", simbolo: "■", color: "text-red-500", tamano: "text-6xl", imagen: "imgResinaRoja", grupo: "Resina" },
  { label: "Resina Azul", clave: "resinaAzul", simbolo: "■", color: "text-blue-500", tamano: "text-6xl", imagen: "imgResinaAzul", grupo: "Resina" },
  { label: "Amalgama Roja", clave: "amalgamaRoja", simbolo: "◆", color: "text-red-500", tamano: "text-6xl", imagen: "imgAmalgamaRoja", grupo: "Amalgama" },
  { label: "Amalgama Azul", clave: "amalgamaAzul", simbolo: "◆", color: "text-blue-500", tamano: "text-6xl", imagen: "imgAmalgamaAzul", grupo: "Amalgama" },
  { label: "Remanente Radicular", clave: "remanenteRadicular", simbolo: "RR", color: "text-black", tamano: "text-4xl font-bold", imagen: "imgRemanenteRadicular" },
  { label: "P.Total", clave: "pTotal", simbolo: "≈", color: "text-black", tamano: "text-6xl", imagen: "imgPTotal" },
  { label: "Normal", clave: "normal", simbolo: "☑", color: "text-green-500", tamano: "text-6xl", imagen: null },
  // Ya no se ofrecen (solo se leen de odontogramas guardados)
  { label: "Por extraer", clave: "porExtraer", simbolo: "⊗", color: "text-red-500", tamano: "text-6xl", imagen: "imgExtraer", legacy: true, malEstado: true },
  { label: "Obturacion Efectuada", clave: "obturacion", simbolo: "●", color: "text-blue-500", tamano: "text-7xl", imagen: "imgObturacionEfectuada", legacy: true },
];

const porLabel = new Map(ESTADOS.map((estado) => [estado.label, estado]));
const porImagen = new Map(
  ESTADOS.flatMap((estado) => [estado.imagen, ...(estado.alias ?? [])].filter(Boolean).map((imagen) => [imagen, estado]))
);

export const estadoDe = (label) => porLabel.get(label);

// Contadores del formulario: se calculan a partir de los 32 dientes, nunca se escriben a mano.
export const CLAVES_CONTADORES = [...ESTADOS.map(({ clave }) => clave), "malEstado"];
export const CONTADORES_INICIALES = {
  ...Object.fromEntries(CLAVES_CONTADORES.map((clave) => [clave, 0])),
  normal: 32,
};

// Cuenta cuántos dientes (d1..d32) tiene cada estado. "P.Total" marca los 16 dientes de la arcada: se cuenta 1 por arcada.
export const contarEstados = (form) => {
  const conteo = Object.fromEntries(CLAVES_CONTADORES.map((clave) => [clave, 0]));
  for (let i = 1; i <= 32; i++) {
    const estado = estadoDe(form[`d${i}`]);
    if (!estado) continue;
    conteo[estado.clave]++;
    if (estado.malEstado) conteo.malEstado++;
  }
  conteo.pTotal = Math.floor(conteo.pTotal / 16);
  return conteo;
};

// ===== Conversión de/hacia el backend =====
const PREFIJO_IMAGEN = "jar:file:/C:/hmsoft/hmsoft.jar!/imagenes/odontograma/";

export const imagenParaRegistrar = (label) => {
  if (label === "Normal") return null;
  const imagen = estadoDe(label)?.imagen;
  return imagen ? `${PREFIJO_IMAGEN}${imagen}.png` : "";
};

export const labelParaLeer = (url) => {
  if (url == null) return "Normal";
  const nombre = url.match(/([^/\\]+)(?=\.png$)/)?.[1];
  return porImagen.get(nombre)?.label ?? "";
};

// ===== Menú del click derecho =====
// Estados ofrecidos, con los de un mismo `grupo` reunidos en una sola entrada con `opciones` (submenú).
export const OPCIONES_MENU = ESTADOS.filter((estado) => !estado.legacy).reduce((menu, estado) => {
  if (!estado.grupo) return [...menu, estado];
  const existente = menu.find((item) => item.grupo === estado.grupo);
  if (existente) {
    existente.opciones.push(estado);
    return menu;
  }
  return [
    ...menu,
    { label: estado.grupo, grupo: estado.grupo, simbolo: estado.simbolo, color: "text-gray-500", opciones: [estado] },
  ];
}, []);

// Leyenda y contadores: los estados ofrecidos y, solo si el odontograma actual los tiene, los que ya no se ofrecen.
export const estadosVisibles = (form) => ESTADOS.filter((estado) => !estado.legacy || form[estado.clave] > 0);
