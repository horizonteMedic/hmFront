import Swal from "sweetalert2";
import { getFetch } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { unwrap } from "../../Inventario/Compartido/inventarioUtils";
import { agregarHojaTabla, descargarLibro, nuevoLibro } from "../Compartido/excelReporte";

const libroAtencionesUrl = "/asistencial/reportes/libro-atenciones";

const TITULO_REPORTE = "Libro de atenciones diarias";
// Fondo azul del título y de las cabeceras de columnas del Excel (letras blancas; el título va en mayúsculas).
const COLOR_AZUL = "FF1F4E9E";

// Medidas para calcular el alto de cada fila según el texto que más líneas necesita (letra tamaño 9).
const ALTURA_FILA = 24;
const ALTO_LINEA = 12;
const MARGEN_FILA = 6;
const ALTO_MAXIMO_FILA = 409; // máximo que permite Excel
const CARACTERES_POR_UNIDAD = 1.1;

// Todas las medicinas de la atención en una sola celda, una por línea: "LORATADINA 10 MG x3".
const textoMedicinas = (medicinas) =>
    (Array.isArray(medicinas) ? medicinas : [])
        .map(({ nombre, cantidad }) => (cantidad == null ? nombre : `${nombre} x${cantidad}`))
        .join("\n");

const columnas = [
    { key: "numeroTicket", label: "N° Ticket", width: 9, numero: true, formato: "General" },
    { key: "mes", label: "Mes", width: 13 },
    { key: "fecha", label: "Fecha", width: 12 },
    { key: "hora", label: "Hora", width: 8 },
    { key: "horarioAtencion", label: "Horario de atención", width: 26 },
    { key: "dni", label: "DNI", width: 12 },
    { key: "apellidosNombres", label: "Apellidos y Nombres", width: 32 },
    { key: "edad", label: "Edad", width: 7, numero: true, formato: "General" },
    { key: "sexo", label: "Sexo", width: 12 },
    { key: "empresa", label: "Empresa", width: 26 },
    { key: "empresaContrata", label: "Empresa / Contrata", width: 18 },
    { key: "area", label: "Área", width: 18 },
    { key: "puestoTrabajo", label: "Puesto de trabajo", width: 20 },
    { key: "motivoAtencion", label: "Motivo de atención", width: 16 },
    { key: "tipoDiagnostico", label: "Tipo de diagnóstico", width: 20 },
    { key: "cie10", label: "CIE10", width: 14 },
    { key: "diagnosticoCie10", label: "Diagnóstico CIE10", width: 44 },
    { key: "diagnosticoAsistencial", label: "Diagnóstico asistencial", width: 32 },
    { key: "clasificacion", label: "Clasificación", width: 14 },
    { key: "destino", label: "Destino", width: 20 },
    { key: "tratamiento", label: "Tratamiento", width: 30 },
    { key: "indicacionesTratamiento", label: "Indicaciones del tratamiento", width: 44 },
    { key: "medicinas", label: "Medicinas", width: 32 },
    { key: "medicoTratante", label: "Médico tratante", width: 30 },
];

const lineasDeTexto = (texto, anchoColumna) => {
    const porLinea = Math.max(1, Math.floor(anchoColumna * CARACTERES_POR_UNIDAD));
    return String(texto ?? "")
        .split("\n")
        .reduce((suma, parrafo) => suma + Math.max(1, Math.ceil(parrafo.length / porLinea)), 0);
};

const altoDeFila = (fila) => {
    const lineas = Math.max(1, ...columnas.map((columna) => (typeof fila[columna.key] === "string" ? lineasDeTexto(fila[columna.key], columna.width) : 1)));
    return Math.min(ALTO_MAXIMO_FILA, Math.max(ALTURA_FILA, lineas * ALTO_LINEA + MARGEN_FILA));
};

const fechaDelRango = (iso) => iso.split("-").reverse().join("/");

// Valida el rango y trae las atenciones. Devuelve el arreglo, o null si no hay nada que exportar (ya avisó al usuario). Si
// devuelve las atenciones deja abierto el aviso "Generando...", que cierra quien genere el archivo.
const obtenerLibroAtenciones = async ({ desde, hasta }, token) => {
    if (!desde || !hasta) {
        Swal.fire("Atención", "Seleccione ambas fechas.", "warning");
        return null;
    }
    if (desde > hasta) {
        Swal.fire("Atención", "La fecha inicial no puede ser mayor a la fecha final.", "warning");
        return null;
    }

    LoadingDefault("Generando Excel");

    let atenciones;
    try {
        const res = await getFetch(`${libroAtencionesUrl}?${new URLSearchParams({ desde, hasta })}`, token);
        if (!res || res.error || Number(res.codigo) >= 400) throw new Error("respuesta inválida");
        atenciones = unwrap(res);
    } catch (error) {
        console.error(error);
        Swal.close();
        Swal.fire("Error", "No se pudo obtener el libro de atenciones. Intente nuevamente.", "error");
        return null;
    }

    if (!Array.isArray(atenciones) || atenciones.length === 0) {
        Swal.close();
        Swal.fire("Sin resultados", "No se encontraron atenciones en el rango de fechas seleccionado.", "info");
        return null;
    }
    return atenciones;
};

export const GenerarExcelLibroAtenciones = async (rango, token) => {
    const atenciones = await obtenerLibroAtenciones(rango, token);
    if (!atenciones) return;

    try {
        const filas = atenciones.map((atencion) => ({ ...atencion, medicinas: textoMedicinas(atencion.medicinas) }));

        const libro = nuevoLibro();
        const { hoja, primeraFilaDatos } = agregarHojaTabla(libro, {
            nombre: "LIBRO DE ATENCIONES",
            titulo: `${TITULO_REPORTE} | del ${fechaDelRango(rango.desde)} al ${fechaDelRango(rango.hasta)} | total de atenciones: ${atenciones.length}`.toUpperCase(),
            colorTitulo: COLOR_AZUL,
            colorCabecera: COLOR_AZUL,
            columnas,
            filas,
            alturaFila: ALTURA_FILA,
        });
        filas.forEach((fila, indice) => {
            hoja.getRow(primeraFilaDatos + indice).height = altoDeFila(fila);
        });

        await descargarLibro(libro, `${TITULO_REPORTE.replace(/ /g, "_")}_${rango.desde}_${rango.hasta}.xlsx`);
    } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo generar el Excel. Intente nuevamente.", "error");
        return;
    }
    Swal.close();
};
