import Swal from "sweetalert2";
import autoTable from "jspdf-autotable";
import { getFetch } from "../../../../../utils/apiHelpers";
import { formatearFechaCorta, formatearHora } from "../../../../../utils/formatDateUtils";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { unwrap } from "../../Inventario/Compartido/inventarioUtils";
import { agregarHojaTabla, colocarImagen, descargarLibro, nuevoLibro, registrarImagen } from "../Compartido/excelReporte";
import { ajustarAlCuadro, descargarImagenes } from "../Compartido/imagenReporte";
import {
    agregarNumerosDePagina,
    agregarTituloPdf,
    COLOR_CABECERA_PDF,
    COLOR_FILA_PAR_PDF,
    descargarPdf,
    MARGEN_PDF,
    nuevoPdf,
} from "../Compartido/pdfReporte";

const atencionesUrl = "/asistencial/reportes/atenciones";

const NOMBRE_REPORTE = "Registro de atenciones";

const esUrlDeImagen = (texto) => /^(https?:\/\/|data:image\/)/i.test(texto);

// El backend envía fecha y hora como texto: si no vienen como "yyyy-MM-dd" / "HH:mm:ss" se muestran tal cual.
const fechaLegible = (fecha) => formatearFechaCorta(fecha) || String(fecha ?? "");
const horaLegible = (hora) => formatearHora(hora) || String(hora ?? "");

const textoDe = (valor) => String(valor ?? "").trim();
const urlDeFirma = (atencion) => textoDe(atencion.firmaPaciente);

// Todas las medicinas de la atención en una sola celda, una por línea: "AMOXICILINA 500 MG x10".
const textoMedicinas = (medicinas) =>
    (Array.isArray(medicinas) ? medicinas : [])
        .map(({ nombre, cantidad }) => (cantidad == null ? nombre : `${nombre} x${cantidad}`))
        .join("\n");

// Campos de una atención ya listos para mostrar; los comparten el Excel y el PDF para que digan lo mismo.
const datosDeAtencion = (atencion, indice) => ({
    item: indice + 1,
    fecha: fechaLegible(atencion.fecha),
    hora: horaLegible(atencion.hora),
    numeroHistoriaClinica: atencion.numeroHistoriaClinica,
    tipoDocumento: String(atencion.tipoDocumento ?? "").replace(/_/g, " "),
    numeroDocumento: atencion.numeroDocumento,
    apellidosNombres: atencion.apellidosNombres,
    peso: atencion.peso,
    talla: atencion.talla,
    empresa: atencion.empresa,
    area: atencion.area,
    cargo: atencion.cargo,
    edad: atencion.edad,
    sexo: atencion.sexo,
    diagnostico: atencion.diagnostico,
    tratamientoTriaje: atencion.tratamientoTriaje,
    medicinas: textoMedicinas(atencion.medicinas),
    atendidoPor: atencion.atendidoPor,
});

// Valida el rango y trae las atenciones. Devuelve el arreglo, o null si no hay nada que exportar (ya avisó al usuario). Si
// devuelve las atenciones deja abierto el aviso "Generando...", que cierra quien genere el archivo.
const obtenerAtenciones = async ({ desde, hasta }, token, textoCarga) => {
    if (!desde || !hasta) {
        Swal.fire("Atención", "Seleccione ambas fechas.", "warning");
        return null;
    }
    if (desde > hasta) {
        Swal.fire("Atención", "La fecha inicial no puede ser mayor a la fecha final.", "warning");
        return null;
    }

    LoadingDefault(textoCarga);

    let atenciones;
    try {
        const res = await getFetch(`${atencionesUrl}?${new URLSearchParams({ desde, hasta })}`, token);
        if (!res || res.error || Number(res.codigo) >= 400) throw new Error("respuesta inválida");
        atenciones = unwrap(res);
    } catch (error) {
        console.error(error);
        Swal.close();
        Swal.fire("Error", "No se pudo obtener el registro de atenciones. Intente nuevamente.", "error");
        return null;
    }

    if (!Array.isArray(atenciones) || atenciones.length === 0) {
        Swal.close();
        Swal.fire("Sin resultados", "No se encontraron atenciones en el rango de fechas seleccionado.", "info");
        return null;
    }
    return atenciones;
};

// Descarga las firmas de las atenciones (cada URL una sola vez). Devuelve Map<url, imagen|null>.
const descargarFirmas = (atenciones) => descargarImagenes(atenciones.map(urlDeFirma).filter(esUrlDeImagen));

// Avisa, ya descargado el archivo, de las firmas que no se pudieron traer: el reporte no debe parecer completo sin serlo.
const avisarFirmasFaltantes = (firmas, detalle) => {
    const faltantes = [...firmas.values()].filter((imagen) => imagen == null).length;
    if (faltantes === 0) return;
    Swal.fire("Atención", `El archivo se generó, pero ${faltantes} firma(s) no se pudieron descargar${detalle}. Intente generarlo de nuevo.`, "warning");
};

const tituloDelRango = ({ desde, hasta }) => `${NOMBRE_REPORTE.toUpperCase()} | ${fechaLegible(desde)} al ${fechaLegible(hasta)}`;
const nombreDeArchivo = ({ desde, hasta }, extension) => `${NOMBRE_REPORTE.replace(/ /g, "_")}_${desde}_${hasta}.${extension}`;

// ===== Excel =====

// Medidas para que el texto de cada celda se vea completo: el alto de la fila se calcula con la celda que más líneas necesita.
const ALTURA_FILA = 52;
const ALTO_LINEA = 12;
const MARGEN_FILA = 6;
// El máximo que permite Excel para una fila; un texto que necesite más va completo a la hoja TEXTOS LARGOS.
const ALTO_MAXIMO_FILA = 409;
const MAX_LINEAS = Math.floor((ALTO_MAXIMO_FILA - MARGEN_FILA) / ALTO_LINEA);
// Caracteres de letra tamaño 9 que entran por cada unidad de ancho de columna (se queda corto a propósito).
const CARACTERES_POR_UNIDAD = 1.1;
const NOMBRE_HOJA_LARGOS = "TEXTOS LARGOS";
const AVISO_CONTINUA = `… (el texto completo está en la hoja ${NOMBRE_HOJA_LARGOS})`;
// Tamaño de la firma (en píxeles) y descarga: cabe en la columna y en el alto de fila mínimo.
const FIRMA_ANCHO = 150;
const FIRMA_ALTO = 60;

const columnas = [
    { key: "item", label: "N°", width: 6 },
    { key: "fecha", label: "Fecha", width: 12 },
    { key: "hora", label: "Hora", width: 8 },
    { key: "numeroHistoriaClinica", label: "N° Historia Clínica", width: 12 },
    { key: "tipoDocumento", label: "Tipo de documento", width: 16 },
    { key: "numeroDocumento", label: "Documento", width: 14 },
    { key: "apellidosNombres", label: "Apellidos y Nombres", width: 34 },
    { key: "peso", label: "Peso", width: 9, numero: true, formato: "General" },
    { key: "talla", label: "Talla", width: 9, numero: true, formato: "General" },
    { key: "empresa", label: "Empresa", width: 28 },
    { key: "area", label: "Área", width: 20 },
    { key: "cargo", label: "Cargo", width: 22 },
    { key: "edad", label: "Edad", width: 8, numero: true, formato: "General" },
    { key: "sexo", label: "Sexo", width: 8 },
    { key: "diagnostico", label: "Diagnóstico", width: 40 },
    { key: "tratamientoTriaje", label: "Tratamiento (triaje)", width: 36 },
    { key: "medicinas", label: "Medicinas", width: 40 },
    { key: "atendidoPor", label: "Atendido por", width: 26 },
    { key: "firma", label: "Firma del paciente", width: 24 },
];
const COLUMNA_FIRMA = columnas.findIndex((columna) => columna.key === "firma") + 1;

const caracteresPorLinea = (anchoColumna) => Math.max(1, Math.floor(anchoColumna * CARACTERES_POR_UNIDAD));

// Líneas que ocupa un texto en una columna de ese ancho (cada salto de línea empieza una nueva).
const lineasDeTexto = (texto, anchoColumna) => {
    const porLinea = caracteresPorLinea(anchoColumna);
    return String(texto ?? "")
        .split("\n")
        .reduce((suma, parrafo) => suma + Math.max(1, Math.ceil(parrafo.length / porLinea)), 0);
};

// Las primeras líneas de un texto, hasta `maxLineas`; la última línea se corta si hace falta.
const recortarALineas = (texto, anchoColumna, maxLineas) => {
    const porLinea = caracteresPorLinea(anchoColumna);
    const salida = [];
    let usadas = 0;
    for (const parrafo of String(texto).split("\n")) {
        const necesarias = Math.max(1, Math.ceil(parrafo.length / porLinea));
        if (usadas + necesarias <= maxLineas) {
            salida.push(parrafo);
            usadas += necesarias;
            continue;
        }
        if (maxLineas - usadas > 0) salida.push(parrafo.slice(0, (maxLineas - usadas) * porLinea));
        break;
    }
    return salida.join("\n");
};

// Parte un texto en trozos que caben cada uno en una celda de ese ancho sin pasar de `maxLineas` líneas.
const partirTexto = (texto, anchoColumna, maxLineas) => {
    const porLinea = caracteresPorLinea(anchoColumna);
    const maxCaracteres = maxLineas * porLinea;
    const partes = [];
    let actual = [];
    let usadas = 0;
    const cerrar = () => {
        if (actual.length > 0) partes.push(actual.join("\n"));
        actual = [];
        usadas = 0;
    };

    String(texto)
        .split("\n")
        .forEach((parrafo) => {
            // Un párrafo más largo que una celda entera se corta en trozos.
            for (let inicio = 0; inicio === 0 || inicio < parrafo.length; inicio += maxCaracteres) {
                const trozo = parrafo.slice(inicio, inicio + maxCaracteres);
                const lineas = Math.max(1, Math.ceil(trozo.length / porLinea));
                if (usadas + lineas > maxLineas) cerrar();
                actual.push(trozo);
                usadas += lineas;
            }
        });
    cerrar();
    return partes;
};

const altoDeFila = (lineas) => Math.min(ALTO_MAXIMO_FILA, Math.max(ALTURA_FILA, lineas * ALTO_LINEA + MARGEN_FILA));

export const GenerarExcelAtenciones = async (rango, token) => {
    const atenciones = await obtenerAtenciones(rango, token, "Generando Excel");
    if (!atenciones) return;

    const libro = nuevoLibro();
    const imagenes = await descargarFirmas(atenciones);
    // Cada firma se registra una sola vez en el libro aunque varias atenciones usen la misma imagen.
    const idsImagen = new Map([...imagenes].filter(([, imagen]) => imagen != null).map(([url, imagen]) => [url, registrarImagen(libro, imagen)]));

    // Un texto que no entra en una fila de Excel se recorta en su celda y va completo a la hoja TEXTOS LARGOS.
    const textosLargos = [];
    const lineasPorFila = [];
    const filas = atenciones.map((atencion, indice) => {
        const fila = datosDeAtencion(atencion, indice);
        let lineasMaximas = 1;

        columnas.forEach((columna) => {
            if (typeof fila[columna.key] !== "string") return;
            const lineas = lineasDeTexto(fila[columna.key], columna.width);
            if (lineas > MAX_LINEAS) {
                textosLargos.push({ fila, columna, texto: fila[columna.key] });
                fila[columna.key] = `${recortarALineas(fila[columna.key], columna.width, MAX_LINEAS - 3)}\n${AVISO_CONTINUA}`;
            }
            lineasMaximas = Math.max(lineasMaximas, lineasDeTexto(fila[columna.key], columna.width));
        });
        lineasPorFila.push(lineasMaximas);

        // Con imagen la celda queda vacía (la imagen va encima); si es una URL que no se pudo descargar se deja el enlace para
        // no perder el dato; sin firma se dice; cualquier otro texto se muestra tal cual.
        const firma = urlDeFirma(atencion);
        if (!firma) fila.firma = "Sin firma";
        else fila.firma = esUrlDeImagen(firma) && idsImagen.has(firma) ? "" : firma;
        return fila;
    });

    const subtitulos = [`Total de atenciones: ${atenciones.length}`];
    if (textosLargos.length > 0) {
        subtitulos.push(`${textosLargos.length} texto(s) son demasiado largos para una celda: su contenido completo está en la hoja ${NOMBRE_HOJA_LARGOS}.`);
    }

    const { hoja, primeraFilaDatos } = agregarHojaTabla(libro, {
        nombre: "ATENCIONES",
        titulo: tituloDelRango(rango),
        subtitulos,
        columnas,
        filas,
        alturaFila: ALTURA_FILA,
    });

    lineasPorFila.forEach((lineas, indice) => {
        hoja.getRow(primeraFilaDatos + indice).height = altoDeFila(lineas);
    });

    atenciones.forEach((atencion, indice) => {
        const url = urlDeFirma(atencion);
        const idImagen = idsImagen.get(url);
        if (idImagen == null) return;
        const { ancho, alto } = ajustarAlCuadro(imagenes.get(url), FIRMA_ANCHO, FIRMA_ALTO);
        colocarImagen(hoja, idImagen, { fila: primeraFilaDatos + indice, columna: COLUMNA_FIRMA, ancho, alto });
    });

    if (textosLargos.length > 0) {
        const ANCHO_TEXTO = 120;
        const filasLargas = textosLargos.flatMap(({ fila, columna, texto }) => {
            const partes = partirTexto(texto, ANCHO_TEXTO, MAX_LINEAS);
            return partes.map((parte, i) => ({
                item: fila.item,
                paciente: fila.apellidosNombres,
                campo: partes.length > 1 ? `${columna.label} (${i + 1}/${partes.length})` : columna.label,
                texto: parte,
                lineas: lineasDeTexto(parte, ANCHO_TEXTO),
            }));
        });
        const { hoja: hojaLargos, primeraFilaDatos: primeraLarga } = agregarHojaTabla(libro, {
            nombre: NOMBRE_HOJA_LARGOS,
            titulo: `${NOMBRE_REPORTE.toUpperCase()} | TEXTOS COMPLETOS`,
            subtitulos: ["Contenido completo de los textos que no caben en una celda de la hoja ATENCIONES."],
            columnas: [
                { key: "item", label: "N°", width: 6 },
                { key: "paciente", label: "Apellidos y Nombres", width: 34 },
                { key: "campo", label: "Campo", width: 26 },
                { key: "texto", label: "Texto completo", width: ANCHO_TEXTO },
            ],
            filas: filasLargas,
        });
        filasLargas.forEach((fila, i) => {
            hojaLargos.getRow(primeraLarga + i).height = altoDeFila(fila.lineas);
        });
    }

    await descargarLibro(libro, nombreDeArchivo(rango, "xlsx"));
    Swal.close();
    avisarFirmasFaltantes(imagenes, " (en su lugar queda el enlace)");
};

// ===== PDF =====

// Cada atención ocupa una fila y agrupa varios datos por celda, con su nombre, para que el PDF sea legible en una hoja A4
// horizontal sin cortar nada: el texto largo hace crecer la fila y, si no cabe en la página, pasa a la siguiente.
const columnasPdf = [
    { key: "item", label: "N°", ancho: 7 },
    { key: "fechaHora", label: "Fecha / Hora", ancho: 18 },
    { key: "paciente", label: "Paciente", ancho: 46 },
    { key: "laboral", label: "Empresa / Área / Cargo", ancho: 40 },
    { key: "diagnostico", label: "Diagnóstico", ancho: 48 },
    { key: "tratamientoTriaje", label: "Tratamiento (triaje)", ancho: 34 },
    { key: "medicinas", label: "Medicinas", ancho: 38 },
    { key: "atendidoPor", label: "Atendido por", ancho: 20 },
    { key: "firma", label: "Firma del paciente", ancho: 30 },
];
const COLUMNA_FIRMA_PDF = columnasPdf.findIndex((columna) => columna.key === "firma");
// Alto mínimo de la fila (mm) para que la firma se vea con claridad.
const ALTO_MINIMO_FILA_PDF = 18;
const PADDING_PDF = 1.5;

const sinDato = (valor) => (valor == null || valor === "" ? "-" : valor);

const celdasPdf = (datos, textoFirma) => ({
    item: datos.item,
    fechaHora: `${datos.fecha}\n${datos.hora}`,
    paciente: [
        sinDato(datos.apellidosNombres),
        `${datos.tipoDocumento || "Documento"}: ${sinDato(datos.numeroDocumento)}`,
        `N° HC: ${sinDato(datos.numeroHistoriaClinica)}`,
        `Edad: ${sinDato(datos.edad)}  ·  Sexo: ${sinDato(datos.sexo)}`,
        `Peso: ${sinDato(datos.peso)}  ·  Talla: ${sinDato(datos.talla)}`,
    ].join("\n"),
    laboral: [`Empresa: ${sinDato(datos.empresa)}`, `Área: ${sinDato(datos.area)}`, `Cargo: ${sinDato(datos.cargo)}`].join("\n"),
    diagnostico: sinDato(datos.diagnostico),
    tratamientoTriaje: sinDato(datos.tratamientoTriaje),
    medicinas: datos.medicinas
        ? datos.medicinas
              .split("\n")
              .map((medicina) => `- ${medicina}`)
              .join("\n")
        : "-",
    atendidoPor: sinDato(datos.atendidoPor),
    firma: textoFirma,
});

export const GenerarPdfAtenciones = async (rango, token) => {
    const atenciones = await obtenerAtenciones(rango, token, "Generando PDF");
    if (!atenciones) return;

    const imagenes = await descargarFirmas(atenciones);

    const urls = [];
    const filas = atenciones.map((atencion, indice) => {
        const firma = urlDeFirma(atencion);
        urls.push(firma);
        // Con imagen la celda queda vacía (la imagen se dibuja encima); si no se pudo descargar o no hay firma, se dice.
        let textoFirma = firma;
        if (!firma) textoFirma = "Sin firma";
        else if (esUrlDeImagen(firma)) textoFirma = imagenes.get(firma) ? "" : "No disponible";

        const celdas = celdasPdf(datosDeAtencion(atencion, indice), textoFirma);
        return columnasPdf.map((columna) =>
            columna.key === "firma"
                ? { content: celdas.firma, styles: { halign: "center", valign: "middle", minCellHeight: ALTO_MINIMO_FILA_PDF } }
                : celdas[columna.key]
        );
    });

    const doc = nuevoPdf();
    const inicioTabla = agregarTituloPdf(doc, {
        titulo: tituloDelRango(rango),
        subtitulos: [`Total de atenciones: ${atenciones.length}   |   Generado el ${new Date().toLocaleString("es-PE")}`],
    });

    autoTable(doc, {
        head: [columnasPdf.map((columna) => columna.label)],
        body: filas,
        startY: inicioTabla,
        margin: { top: MARGEN_PDF, left: MARGEN_PDF, right: MARGEN_PDF, bottom: 10 },
        theme: "grid",
        styles: { font: "helvetica", fontSize: 7.5, cellPadding: PADDING_PDF, overflow: "linebreak", valign: "top", lineColor: [204, 204, 204], lineWidth: 0.1, textColor: 30 },
        headStyles: { fillColor: COLOR_CABECERA_PDF, textColor: 255, fontStyle: "bold", halign: "center", valign: "middle" },
        alternateRowStyles: { fillColor: COLOR_FILA_PAR_PDF },
        columnStyles: Object.fromEntries(columnasPdf.map((columna, i) => [i, { cellWidth: columna.ancho }])),
        // Una atención no se parte entre dos páginas, salvo que sola ocupe más de una página.
        rowPageBreak: "avoid",
        didDrawCell: (datos) => {
            if (datos.section !== "body" || datos.column.index !== COLUMNA_FIRMA_PDF) return;
            const url = urls[datos.row.index];
            const imagen = imagenes.get(url);
            if (!imagen) return;

            const { ancho, alto } = ajustarAlCuadro(imagen, datos.cell.width - 2 * PADDING_PDF, datos.cell.height - 2 * PADDING_PDF, true);
            const x = datos.cell.x + (datos.cell.width - ancho) / 2;
            // En una fila alta (por un texto largo) la firma queda arriba, junto a los demás datos, y no a media altura.
            const esFilaAlta = datos.cell.height > alto + 2 * PADDING_PDF + 8;
            const y = esFilaAlta ? datos.cell.y + PADDING_PDF + 1 : datos.cell.y + (datos.cell.height - alto) / 2;
            try {
                // El alias hace que una firma repetida se guarde una sola vez en el archivo.
                doc.addImage(imagen.bytes, imagen.extension.toUpperCase(), x, y, ancho, alto, url);
            } catch (error) {
                console.error(error);
            }
        },
    });

    agregarNumerosDePagina(doc, NOMBRE_REPORTE);
    descargarPdf(doc, nombreDeArchivo(rango, "pdf"));
    Swal.close();
    avisarFirmasFaltantes(imagenes, "");
};
