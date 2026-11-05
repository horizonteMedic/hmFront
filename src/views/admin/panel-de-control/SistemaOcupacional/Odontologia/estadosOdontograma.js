// Estados que puede tener un diente en el odontograma: única fuente para el menú del click derecho, el indicador
// sobre el diente, la leyenda, los contadores y la conversión de/hacia lo que guarda el backend.
//
// Qué guarda el backend:
//  - por diente (lbl11..lbl48): el nombre del estado en texto ("Normal", "Caries", "Resina buen estado"...), que es
//    el `valor` de cada estado;
//  - los contadores con nombres propios (txtAusentes, cariesDental, resinaBuenEstado...), que es el `campo`.
//
// - `clave`: campo del formulario donde se cuenta cuántos dientes tienen ese estado.
// - `grupo`: estados que el menú agrupa en un submenú (Resina, Amalgama).
// - `legacy`: ya no se ofrece en el menú, pero los odontogramas guardados con él se siguen leyendo, mostrando
//   y contando (su leyenda y su contador solo aparecen si el odontograma actual lo tiene). No tiene `campo`.
// - `imagen` / `alias`: nombres de imagen del sistema anterior ("…/imagenes/odontograma/<imagen>.png"). Ya no se
//   guardan, pero un odontograma antiguo puede traerlos y se siguen leyendo (PPR Metálica / Acrílica -> PPR).
// - `malEstado`: cuenta para "Dientes en mal estado".

export const ESTADOS = [
  { label: "Ausente", valor: "Ausente", clave: "ausente", campo: "txtAusentes", simbolo: "✕", color: "text-blue-500", tamano: "text-6xl", imagen: "imgAusente" },
  { label: "Carie Dental", valor: "Caries", clave: "cariada", campo: "cariesDental", simbolo: "●", color: "text-red-500", tamano: "text-7xl", imagen: "imgPorOturar", malEstado: true },
  { label: "Fractura", valor: "Fractura", clave: "fracturada", campo: "fractura", simbolo: "╱", color: "text-red-500", tamano: "text-6xl", imagen: "imgFracturada", malEstado: true },
  { label: "Corona", valor: "Corona", clave: "corona", campo: "corona", simbolo: "©", color: "text-blue-500", tamano: "text-6xl", imagen: "imgCorona" },
  { label: "Puente", valor: "Puente", clave: "puente", campo: "txtPuentes", simbolo: "▭", color: "text-black", tamano: "text-6xl", imagen: "imgPuente" },
  { label: "PPR", valor: "PPR", clave: "ppr", campo: "ppr", simbolo: "=", color: "text-blue-500", tamano: "text-6xl", imagen: "imgPPR", alias: ["imgPPRMetalica", "imgPPRAcrilica"] },
  { label: "Implante", valor: "Implante", clave: "implante", campo: "implante", simbolo: "IMP", color: "text-blue-500", tamano: "text-3xl font-bold", imagen: "imgImplante" },
  { label: "Resina Roja", valor: "Resina mal estado", clave: "resinaRoja", campo: "resinaMalEstado", simbolo: "R", color: "text-red-500", tamano: "text-5xl font-bold", imagen: "imgResinaRoja", grupo: "Resina" },
  { label: "Resina Azul", valor: "Resina buen estado", clave: "resinaAzul", campo: "resinaBuenEstado", simbolo: "R", color: "text-blue-500", tamano: "text-5xl font-bold", imagen: "imgResinaAzul", grupo: "Resina" },
  { label: "Amalgama Roja", valor: "Amalgama mal estado", clave: "amalgamaRoja", campo: "amalgamaMalEstado", simbolo: "AM", color: "text-red-500", tamano: "text-4xl font-bold", imagen: "imgAmalgamaRoja", grupo: "Amalgama" },
  { label: "Amalgama Azul", valor: "Amalgama buen estado", clave: "amalgamaAzul", campo: "amalgamaBuenEstado", simbolo: "AM", color: "text-blue-500", tamano: "text-4xl font-bold", imagen: "imgAmalgamaAzul", grupo: "Amalgama" },
  { label: "Remanente Radicular", valor: "Remanente radicular", clave: "remanenteRadicular", campo: "remanenteRadicular", simbolo: "RR", color: "text-red-500", tamano: "text-4xl font-bold", imagen: "imgRemanenteRadicular", malEstado: true },
  { label: "P.Total", valor: "P.Total", clave: "pTotal", campo: "txtPTotal", simbolo: "≈", color: "text-black", tamano: "text-6xl", imagen: "imgPTotal" },
  { label: "Normal", valor: "Normal", clave: "normal", campo: "txtNormales", simbolo: "☑", color: "text-green-500", tamano: "text-6xl", imagen: null },
  // Ya no se ofrecen (solo se leen de odontogramas guardados)
  { label: "Por extraer", valor: "Por extraer", clave: "porExtraer", simbolo: "⊗", color: "text-red-500", tamano: "text-6xl", imagen: "imgExtraer", legacy: true, malEstado: true },
  { label: "Obturacion Efectuada", valor: "Obturacion Efectuada", clave: "obturacion", simbolo: "●", color: "text-blue-500", tamano: "text-7xl", imagen: "imgObturacionEfectuada", legacy: true },
];

// Sin tildes, mayúsculas ni signos: "Remanente radicular", "remanente Radicular" y "REMANENTE-RADICULAR" son lo mismo.
const normalizar = (texto) =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

const porLabel = new Map(ESTADOS.map((estado) => [estado.label, estado]));
const porValor = new Map(ESTADOS.map((estado) => [normalizar(estado.valor), estado]));
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
// Estado del diente (lo que muestra el formulario) -> texto que se guarda en lblXX.
export const valorParaRegistrar = (label) => estadoDe(label)?.valor ?? "";

// Contadores del formulario -> campos del backend (txtPiezasMalEstado, txtAusentes, cariesDental, implante...).
export const contadoresParaRegistrar = (form) => ({
  txtPiezasMalEstado: form.malEstado,
  ...Object.fromEntries(ESTADOS.filter(({ campo }) => campo).map(({ campo, clave }) => [campo, form[clave]])),
});

// lblXX del backend -> estado del diente. Vacío = Normal. Se aceptan también las imágenes del sistema anterior que
// pueda traer un odontograma antiguo. Un valor desconocido devuelve "" (diente sin estado reconocido).
export const labelParaLeer = (valor) => {
  if (valor == null || valor === "") return "Normal";
  const texto = String(valor);
  const imagen = texto.match(/([^/\\]+)(?=\.png$)/)?.[1];
  const estado = imagen ? porImagen.get(imagen) : porValor.get(normalizar(texto));
  return estado?.label ?? "";
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
