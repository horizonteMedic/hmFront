import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import { enviarInventario, inventarioUrl, limpiarTexto, normalizarTexto } from "../../inventarioUtils";
import { STOCK_MINIMO_MIN, claveMedicamento } from "../controllerMedicamentos";

const medicamentosMasivoUrl = `${inventarioUrl}/medicamentos/masivo`;

const HOJA_MEDICAMENTOS = "MEDICAMENTOS";
const HOJA_INSTRUCCIONES = "INSTRUCCIONES";
// Filas de la plantilla que ya traen el desplegable de tipo y la validación del stock mínimo.
const FILAS_PLANTILLA = 1000;

// Columnas del Excel (plantilla y lectura). `alias`: otros encabezados que también se reconocen.
const columnas = [
    { campo: "nombre", etiqueta: "NOMBRE", ancho: 40 },
    { campo: "presentacion", etiqueta: "PRESENTACION", ancho: 26 },
    { campo: "tipo", etiqueta: "TIPO", alias: ["TIPO MEDICAMENTO", "TIPO DE MEDICAMENTO"], ancho: 24 },
    { campo: "stockMinimo", etiqueta: "STOCK MINIMO", alias: ["STOCK MIN"], ancho: 16 },
];

// Error con un mensaje pensado para el usuario (archivo mal armado); cualquier otro fallo de lectura se
// reemplaza por un texto genérico.
class ErrorArchivo extends Error {}

const estiloEncabezado = (celda) => {
    celda.font = { bold: true, color: { argb: "FFFFFFFF" } };
    celda.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    celda.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF233245" } };
};

const generarPlantilla = async (tipos) => {
    const libro = new ExcelJS.Workbook();

    // ── Hoja de datos: solo encabezados, para que ninguna fila de ejemplo se registre por error ──
    const hoja = libro.addWorksheet(HOJA_MEDICAMENTOS);
    hoja.addRow(columnas.map((columna) => columna.etiqueta));
    hoja.getRow(1).height = 22;
    hoja.getRow(1).eachCell(estiloEncabezado);
    columnas.forEach((columna, i) => {
        hoja.getColumn(i + 1).width = columna.ancho;
    });
    hoja.views = [{ state: "frozen", ySplit: 1 }];

    // ── Hoja de instrucciones con la tabla de tipos (de ahí sale el desplegable de TIPO) ──
    const ayuda = libro.addWorksheet(HOJA_INSTRUCCIONES);
    const instrucciones = [
        "Complete la hoja MEDICAMENTOS desde la fila 2. No cambie ni borre los encabezados.",
        "NOMBRE y PRESENTACION son obligatorios (por ejemplo: PARACETAMOL 500 MG / TABLETA).",
        "TIPO: elija una opción del desplegable (o escriba el código o el nombre de la tabla de abajo).",
        `STOCK MINIMO: obligatorio, número entero de ${STOCK_MINIMO_MIN} o más. Sirve para avisar cuándo reponer.`,
        "No puede repetir un medicamento con el mismo nombre y presentación, ni uno ya registrado.",
        "El usuario y la fecha de registro los asigna el sistema.",
    ];
    instrucciones.forEach((texto, i) => {
        ayuda.getCell(`A${i + 1}`).value = texto;
    });
    const filaTabla = instrucciones.length + 2;
    ayuda.getCell(`A${filaTabla}`).value = "CODIGO";
    ayuda.getCell(`B${filaTabla}`).value = "TIPO";
    estiloEncabezado(ayuda.getCell(`A${filaTabla}`));
    estiloEncabezado(ayuda.getCell(`B${filaTabla}`));
    tipos.forEach((tipo, i) => {
        ayuda.getCell(`A${filaTabla + 1 + i}`).value = tipo.codigo;
        ayuda.getCell(`B${filaTabla + 1 + i}`).value = tipo.descripcion;
    });
    ayuda.getColumn(1).width = 14;
    ayuda.getColumn(2).width = 30;

    // ── Validaciones de celda ──
    const rangoTipos = `${HOJA_INSTRUCCIONES}!$B$${filaTabla + 1}:$B$${filaTabla + tipos.length}`;
    for (let fila = 2; fila <= FILAS_PLANTILLA + 1; fila++) {
        hoja.getCell(`C${fila}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [rangoTipos],
            showErrorMessage: true,
            errorTitle: "Tipo no válido",
            error: "Elija un tipo de la lista.",
        };
        hoja.getCell(`D${fila}`).dataValidation = {
            type: "whole",
            operator: "greaterThanOrEqual",
            allowBlank: true,
            formulae: [STOCK_MINIMO_MIN],
            showErrorMessage: true,
            errorTitle: "Stock mínimo no válido",
            error: `Ingrese un número entero (${STOCK_MINIMO_MIN} o más).`,
        };
    }

    const buffer = await libro.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Plantilla_Medicamentos_Asistencial.xlsx");
};

export const DescargarPlantillaMedicamentos = async (tipos) => {
    if (!tipos || tipos.length === 0) {
        await Swal.fire("Error", "No se pudieron cargar los tipos de medicamento. Cierre esta ventana y reintente la carga.", "error");
        return;
    }

    try {
        await generarPlantilla(tipos);
    } catch (error) {
        console.error(error);
        await Swal.fire("Error", "No se pudo generar la plantilla.", "error");
    }
};

const textoDeCelda = (celda) => limpiarTexto(celda?.text ?? "");

// Busca el tipo por código ("1") o por nombre ("MEDICINA"), sin importar mayúsculas ni tildes.
const buscarTipo = (texto, tipos) => {
    if (!texto) return null;
    return tipos.find((tipo) => String(tipo.codigo) === texto || normalizarTexto(tipo.descripcion) === normalizarTexto(texto)) ?? null;
};

// Posición (número de columna) de cada campo según los encabezados de la fila 1.
const ubicarColumnas = (hoja) => {
    const indices = {};
    hoja.getRow(1).eachCell((celda, numero) => {
        const encabezado = normalizarTexto(celda.text);
        const columna = columnas.find((c) => [c.etiqueta, ...(c.alias ?? [])].some((nombre) => normalizarTexto(nombre) === encabezado));
        if (columna && !indices[columna.campo]) indices[columna.campo] = numero;
    });

    const faltantes = columnas.filter((columna) => !indices[columna.campo]).map((columna) => columna.etiqueta);
    if (faltantes.length > 0) {
        throw new ErrorArchivo(`Al archivo le faltan las columnas: ${faltantes.join(", ")}. Use la plantilla tal como se descargó.`);
    }
    return indices;
};

// Primer problema de la fila, o "" si está completa. El duplicado se revisa aparte.
const errorDeFila = ({ nombre, presentacion, tipoTexto, tipo, stockTexto, stockMinimo }) => {
    if (!nombre) return "Falta el nombre";
    if (!presentacion) return "Falta la presentación";
    if (!tipoTexto) return "Falta el tipo";
    if (!tipo) return `Tipo no válido: "${tipoTexto}"`;
    if (!stockTexto) return "Falta el stock mínimo";
    if (!(Number.isInteger(stockMinimo) && stockMinimo >= STOCK_MINIMO_MIN)) {
        return `El stock mínimo debe ser un número entero (${STOCK_MINIMO_MIN} o más)`;
    }
    return "";
};

// Lee la hoja MEDICAMENTOS (o la primera) y devuelve { ok, filas } o { ok: false, mensaje }. Cada fila trae
// `error` con lo que impide registrarla: datos faltantes o inválidos, ya registrada en el catálogo
// (`existentes`) o repetida dentro del mismo archivo. El backend rechaza todo el lote si hay un duplicado,
// por eso se avisa fila por fila antes de enviar.
export const LeerExcelMedicamentos = async (archivo, tipos, existentes) => {
    try {
        if (!/\.xlsx$/i.test(archivo.name)) {
            throw new ErrorArchivo("El archivo debe ser un Excel .xlsx. Descargue la plantilla y complétela.");
        }

        const libro = new ExcelJS.Workbook();
        await libro.xlsx.load(await archivo.arrayBuffer());
        const hoja = libro.getWorksheet(HOJA_MEDICAMENTOS) ?? libro.worksheets[0];
        if (!hoja) throw new ErrorArchivo("El archivo no tiene hojas.");

        const indices = ubicarColumnas(hoja);
        const registrados = new Set(existentes.map((medicamento) => claveMedicamento(medicamento.nombre, medicamento.presentacion)));
        const vistos = new Map(); // clave -> N° de la fila del Excel donde apareció primero
        const filas = [];

        hoja.eachRow((fila, numero) => {
            if (numero === 1) return;

            const nombre = textoDeCelda(fila.getCell(indices.nombre)).toUpperCase();
            const presentacion = textoDeCelda(fila.getCell(indices.presentacion)).toUpperCase();
            const tipoTexto = textoDeCelda(fila.getCell(indices.tipo));
            const stockTexto = textoDeCelda(fila.getCell(indices.stockMinimo));
            if (!nombre && !presentacion && !tipoTexto && !stockTexto) return;

            const tipo = buscarTipo(tipoTexto, tipos);
            // "abc" o "2.5" quedan como inválidos; vacío se reporta aparte en errorDeFila.
            const stockMinimo = stockTexto ? Number(stockTexto.replace(",", ".")) : 0;

            let error = errorDeFila({ nombre, presentacion, tipoTexto, tipo, stockTexto, stockMinimo });
            if (!error) {
                const clave = claveMedicamento(nombre, presentacion);
                if (registrados.has(clave)) {
                    error = "Ya está registrado";
                } else if (vistos.has(clave)) {
                    error = `Repetido: igual a la fila ${vistos.get(clave)}`;
                } else {
                    vistos.set(clave, numero);
                }
            }

            filas.push({
                fila: numero,
                nombre,
                presentacion,
                tipoMedicamento: tipo?.codigo ?? null,
                tipoDescripcion: tipo?.descripcion ?? tipoTexto,
                // Un stock ilegible ("abc") se muestra tal cual en vez de "NaN".
                stockMinimo: Number.isFinite(stockMinimo) ? stockMinimo : stockTexto,
                error,
            });
        });

        if (filas.length === 0) {
            throw new ErrorArchivo("El archivo no tiene medicamentos para registrar. Complete la plantilla desde la fila 2.");
        }
        return { ok: true, filas };
    } catch (error) {
        if (!(error instanceof ErrorArchivo)) console.error(error);
        return {
            ok: false,
            mensaje: error instanceof ErrorArchivo ? error.message : "No se pudo leer el archivo. Verifique que sea un Excel (.xlsx) válido.",
        };
    }
};

// Devuelve true si el lote quedó registrado. Es todo o nada: si el backend rechaza una fila no se guarda ninguna.
export const RegistrarMedicamentosMasivo = async (filas, token, usuario) => {
    const { isConfirmed } = await Swal.fire({
        title: "Registro masivo",
        text: `Se registrarán ${filas.length} medicamentos. ¿Desea continuar?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return false;

    const body = filas.map(({ nombre, presentacion, tipoMedicamento, stockMinimo }) => ({
        nombre,
        presentacion,
        tipoMedicamento,
        stockMinimo,
    }));
    const url = `${medicamentosMasivoUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;

    LoadingDefault("Registrando Medicamentos");
    const res = await enviarInventario(url, body, token, "Ocurrió un error al registrar los medicamentos.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", `${res.mensaje}\nNo se registró ningún medicamento.`, "error");
        return false;
    }

    await Swal.fire("Éxito", `Se registraron ${filas.length} medicamentos correctamente.`, "success");
    return true;
};
