import Swal from "sweetalert2";
import { getFetch } from "../../../../../utils/apiHelpers";
import { formatearFechaCorta, formatearHora } from "../../../../../utils/formatDateUtils";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { unwrap } from "../../Inventario/Compartido/inventarioUtils";
import { agregarHojaTabla, colocarImagen, descargarLibro, nuevoLibro, registrarImagen } from "../Compartido/excelReporte";

const atencionesUrl = "/asistencial/reportes/atenciones";

const NOMBRE_REPORTE = "Registro de atenciones";

// Alto de fila y tamaño de la firma (en píxeles) para que la imagen entre en su celda.
const ALTURA_FILA = 50;
const FIRMA_ANCHO = 130;
const FIRMA_ALTO = 55;
const DESCARGAS_SIMULTANEAS = 6;

const esUrlDeImagen = (texto) => /^(https?:\/\/|data:image\/)/i.test(texto);

// El backend envía fecha y hora como texto: si no vienen como "yyyy-MM-dd" / "HH:mm:ss" se muestran tal cual.
const fechaLegible = (fecha) => formatearFechaCorta(fecha) || String(fecha ?? "");
const horaLegible = (hora) => formatearHora(hora) || String(hora ?? "");

const columnas = [
    { key: "item", label: "N°", width: 6 },
    { key: "fecha", label: "Fecha", width: 12 },
    { key: "hora", label: "Hora", width: 8 },
    { key: "dni", label: "DNI", width: 12 },
    { key: "apellidosNombres", label: "Apellidos y Nombres", width: 34 },
    { key: "peso", label: "Peso", width: 9, numero: true, formato: "General" },
    { key: "talla", label: "Talla", width: 9, numero: true, formato: "General" },
    { key: "empresa", label: "Empresa", width: 28 },
    { key: "area", label: "Área", width: 20 },
    { key: "cargo", label: "Cargo", width: 22 },
    { key: "edad", label: "Edad", width: 8, numero: true, formato: "General" },
    { key: "sexo", label: "Sexo", width: 8 },
    { key: "diagnostico", label: "Diagnóstico", width: 40 },
    { key: "medicinas", label: "Medicinas", width: 40 },
    { key: "atendidoPor", label: "Atendido por", width: 26 },
    { key: "firma", label: "Firma del paciente", width: 24 },
];
const COLUMNA_FIRMA = columnas.findIndex((columna) => columna.key === "firma") + 1;

// Descarga las firmas (cada URL una sola vez) de a pocas a la vez. Devuelve Map<url, idImagen|null>.
const registrarFirmas = async (libro, urls) => {
    const ids = new Map();
    const pendientes = [...new Set(urls)];
    const trabajador = async () => {
        while (pendientes.length > 0) {
            const url = pendientes.shift();
            ids.set(url, await registrarImagen(libro, url));
        }
    };
    await Promise.all(Array.from({ length: Math.min(DESCARGAS_SIMULTANEAS, pendientes.length) }, trabajador));
    return ids;
};

export const GenerarExcelAtenciones = async ({ desde, hasta }, token) => {
    if (!desde || !hasta) return Swal.fire("Atención", "Seleccione ambas fechas.", "warning");
    if (desde > hasta) return Swal.fire("Atención", "La fecha inicial no puede ser mayor a la fecha final.", "warning");

    LoadingDefault("Generando Excel");

    let atenciones;
    try {
        const res = await getFetch(`${atencionesUrl}?${new URLSearchParams({ desde, hasta })}`, token);
        if (!res || res.error || Number(res.codigo) >= 400) throw new Error("respuesta inválida");
        atenciones = unwrap(res);
    } catch (error) {
        console.error(error);
        Swal.close();
        return Swal.fire("Error", "No se pudo obtener el registro de atenciones. Intente nuevamente.", "error");
    }

    if (!Array.isArray(atenciones) || atenciones.length === 0) {
        Swal.close();
        return Swal.fire("Sin resultados", "No se encontraron atenciones en el rango de fechas seleccionado.", "info");
    }

    const libro = nuevoLibro();
    const firmas = await registrarFirmas(
        libro,
        atenciones.map((atencion) => String(atencion.firmaPaciente ?? "").trim()).filter(esUrlDeImagen)
    );

    const filas = atenciones.map((atencion, indice) => {
        const firma = String(atencion.firmaPaciente ?? "").trim();
        // Con imagen la celda queda vacía (la imagen va encima); si es una URL que no se pudo descargar se deja el
        // enlace para no perder el dato; cualquier otro texto se muestra tal cual.
        const textoFirma = esUrlDeImagen(firma) && firmas.get(firma) != null ? "" : firma;
        return {
            item: indice + 1,
            fecha: fechaLegible(atencion.fecha),
            hora: horaLegible(atencion.hora),
            dni: atencion.dni,
            apellidosNombres: atencion.apellidosNombres,
            peso: atencion.peso,
            talla: atencion.talla,
            empresa: atencion.empresa,
            area: atencion.area,
            cargo: atencion.cargo,
            edad: atencion.edad,
            sexo: atencion.sexo,
            diagnostico: atencion.diagnostico,
            medicinas: atencion.medicinas,
            atendidoPor: atencion.atendidoPor,
            firma: textoFirma,
        };
    });

    const { hoja, primeraFilaDatos } = agregarHojaTabla(libro, {
        nombre: "ATENCIONES",
        titulo: `${NOMBRE_REPORTE.toUpperCase()} | ${fechaLegible(desde)} al ${fechaLegible(hasta)}`,
        subtitulos: [`Total de atenciones: ${atenciones.length}`],
        columnas,
        filas,
        alturaFila: ALTURA_FILA,
    });

    atenciones.forEach((atencion, indice) => {
        const idImagen = firmas.get(String(atencion.firmaPaciente ?? "").trim());
        if (idImagen == null) return;
        colocarImagen(hoja, idImagen, { fila: primeraFilaDatos + indice, columna: COLUMNA_FIRMA, ancho: FIRMA_ANCHO, alto: FIRMA_ALTO });
    });

    await descargarLibro(libro, `${NOMBRE_REPORTE.replace(/ /g, "_")}_${desde}_${hasta}.xlsx`);
    Swal.close();
};
