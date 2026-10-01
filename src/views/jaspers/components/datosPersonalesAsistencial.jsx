import { formatearFechaCorta } from "../../utils/formatDateUtils";
import TituloSeccionAsistencial from "./tituloSeccionAsistencial.jsx";
import FilaEtiquetaValorAsistencial from "./filaEtiquetaValorAsistencial.jsx";

// Sección "DATOS PERSONALES" de los reportes del módulo asistencial. Mismo diseño que la de
// RiesgoCardiovascular (barra gris + tabla de celdas "Etiqueta: valor"), pero sin los datos laborales:
// Cargo, Área, Contrata y Tipo Examen. Sigue el estándar tipográfico de tituloSeccionAsistencial.jsx y
// sus celdas se adaptan al texto (se achica un poco la letra y, si no cabe, salta de línea; ver
// filaEtiquetaValorAsistencial.jsx).
//
// datos:
//   nombreCompleto, dni, edad, sexo (M/F o MASCULINO/FEMENINO), estadoCivil, fechaNacimiento
//   (yyyy-MM-dd o dd/MM/yyyy), lugarNacimiento, ocupacion, nivelEstudios, empresa
// opciones:
//   x (15), y (43), ancho (180), titulo ("DATOS PERSONALES")
//
// Devuelve la Y donde termina la tabla.

// Cada celda: ancho como fracción del ancho total y valorX = distancia desde el borde izquierdo de la
// celda hasta donde empieza el valor (fija por celda, para alinear columnas como en Riesgo).
const FILAS = [
  [{ etiqueta: "Apellidos y nombres:", campo: "nombreCompleto", ancho: 1, valorX: 40 }],
  [
    { etiqueta: "DNI:", campo: "dni", ancho: 0.25, valorX: 12 },
    { etiqueta: "Edad:", campo: "edad", ancho: 0.25, valorX: 13 },
    { etiqueta: "Sexo:", campo: "sexo", ancho: 0.5, valorX: 15 },
  ],
  [
    { etiqueta: "Estado civil:", campo: "estadoCivil", ancho: 0.5, valorX: 28 },
    { etiqueta: "Fecha nacimiento:", campo: "fechaNacimiento", ancho: 0.5, valorX: 35 },
  ],
  [{ etiqueta: "Lugar de nacimiento:", campo: "lugarNacimiento", ancho: 1, valorX: 38 }],
  [
    { etiqueta: "Ocupación:", campo: "ocupacion", ancho: 0.5, valorX: 25 },
    { etiqueta: "Nivel de estudio:", campo: "nivelEstudios", ancho: 0.5, valorX: 35 },
  ],
  [{ etiqueta: "Empresa:", campo: "empresa", ancho: 1, valorX: 20 }],
];

const texto = (v) => String(v ?? "").trim();
const fechaCorta = (v) => formatearFechaCorta(texto(v)) || texto(v);
const SEXO = { M: "MASCULINO", F: "FEMENINO" };

const DatosPersonalesAsistencial = (
  doc,
  datos = {},
  { x = 15, y = 43, ancho = 180, titulo = "DATOS PERSONALES" } = {}
) => {
  const edad = texto(datos.edad);
  const valores = {
    nombreCompleto: texto(datos.nombreCompleto),
    dni: texto(datos.dni),
    edad: edad ? `${edad} AÑOS` : "",
    sexo: SEXO[texto(datos.sexo).toUpperCase()] ?? texto(datos.sexo),
    estadoCivil: texto(datos.estadoCivil),
    fechaNacimiento: fechaCorta(datos.fechaNacimiento),
    lugarNacimiento: texto(datos.lugarNacimiento),
    ocupacion: texto(datos.ocupacion),
    nivelEstudios: texto(datos.nivelEstudios),
    empresa: texto(datos.empresa),
  };

  let yPos = TituloSeccionAsistencial(doc, titulo, { x, y, ancho });

  FILAS.forEach((fila) => {
    yPos = FilaEtiquetaValorAsistencial(
      doc,
      fila.map(({ etiqueta, campo, ancho: fraccion, valorX }) => ({
        etiqueta,
        valor: valores[campo],
        ancho: ancho * fraccion,
        valorX,
      })),
      { x, y: yPos }
    );
  });

  return yPos;
};

export default DatosPersonalesAsistencial;
