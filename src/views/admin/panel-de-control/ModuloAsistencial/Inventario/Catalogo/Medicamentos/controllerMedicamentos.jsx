import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import { consultarInventario, enviarInventario, inventarioUrl, limpiarTexto, normalizarTexto } from "../../Compartido/inventarioUtils";

const medicamentosUrl = `${inventarioUrl}/medicamentos`;
const tiposMedicamentoUrl = `${medicamentosUrl}/tipos`;

// Dos medicamentos son el mismo si coinciden nombre y presentación (sin importar mayúsculas, tildes
// ni espacios). Es el mismo criterio con el que el backend rechaza los duplicados.
export const claveMedicamento = (nombre, presentacion) => `${normalizarTexto(nombre)}|${normalizarTexto(presentacion)}`;

// Valor mínimo permitido del stock mínimo (el formulario y el registro masivo lo exigen).
export const STOCK_MINIMO_MIN = 1;

// Presentaciones del desplegable. "OTRO" abre un campo de texto para escribir una que no esté en la lista.
export const OTRA_PRESENTACION = "OTRO";
export const opcionesPresentacion = [
    "TABLETA",
    "CÁPSULA",
    "JARABE",
    "SUSPENSIÓN",
    "SOLUCIÓN",
    "AMPOLLA",
    "INYECTABLE",
    "FRASCO",
    "SOBRE",
    "GOTAS",
    "CREMA",
    "UNGÜENTO",
    "GEL",
    "SUPOSITORIO",
    "ÓVULO",
    "AEROSOL",
    OTRA_PRESENTACION,
].map((presentacion) => ({ value: presentacion, label: presentacion }));

// Presentación que se guarda: la elegida, o el texto escrito cuando se eligió "OTRO".
const presentacionDelForm = (form) =>
    form.presentacion === OTRA_PRESENTACION ? limpiarTexto(form.presentacionOtro) : limpiarTexto(form.presentacion);

const ordenarPorNombre =(a, b) => String(a.nombre ?? "").localeCompare(String(b.nombre ?? ""), "es");

// Catálogo de medicamentos. Devuelve la respuesta normalizada { ok, resultado, mensaje } con los medicamentos ya
// ordenados por nombre. Con `inventarioId` cada medicamento trae además su stock en ese inventario
// (stockActual, stockReservado y stockDisponible); sin él, el backend no calcula stock.
export const ObtenerListaMedicamentos = async (token, soloActivos = false, inventarioId = "") => {
    const query = new URLSearchParams();
    if (soloActivos) query.set("activo", "true");
    if (inventarioId) query.set("inventarioId", inventarioId);

    const filtros = query.toString();
    const url = filtros ? `${medicamentosUrl}?${filtros}` : medicamentosUrl;
    const res = await consultarInventario(url, token, "No se pudo cargar la lista de medicamentos.");
    if (!res.ok) return res;
    return { ...res, resultado: [...(Array.isArray(res.resultado) ? res.resultado : [])].sort(ordenarPorNombre) };
};

export const ObtenerTiposMedicamento = (token) =>
    consultarInventario(tiposMedicamentoUrl, token, "No se pudo cargar los tipos de medicamento.");

// { campo: mensaje } solo con lo que falta o es inválido; vacío si el formulario está listo para enviar.
export const ValidarMedicamento = (form, medicamentos) => {
    const errores = {};
    const nombre = limpiarTexto(form.nombre);
    const presentacion = presentacionDelForm(form);
    const stockMinimo = String(form.stockMinimo ?? "").trim();

    if (!nombre) errores.nombre = "Ingrese el nombre del medicamento";
    if (!form.presentacion) errores.presentacion = "Seleccione la presentación";
    else if (!presentacion) errores.presentacionOtro = "Escriba la presentación";
    if (!form.tipoMedicamento) errores.tipoMedicamento = "Seleccione el tipo de medicamento";
    if (!stockMinimo) {
        errores.stockMinimo = "Ingrese el stock mínimo";
    } else if (!/^\d+$/.test(stockMinimo) || Number(stockMinimo) < STOCK_MINIMO_MIN) {
        errores.stockMinimo = `Ingrese un número entero (${STOCK_MINIMO_MIN} o más)`;
    }

    if (nombre && presentacion) {
        const clave = claveMedicamento(nombre, presentacion);
        if (medicamentos.some((medicamento) => claveMedicamento(medicamento.nombre, medicamento.presentacion) === clave)) {
            errores.nombre = "Ya está registrado un medicamento con ese nombre y presentación";
        }
    }

    return errores;
};

const construirBody = (form) => ({
    nombre: limpiarTexto(form.nombre),
    presentacion: presentacionDelForm(form),
    tipoMedicamento: Number(form.tipoMedicamento),
    stockMinimo: Number(form.stockMinimo),
});

// Devuelve true si el medicamento quedó registrado, para que la pantalla limpie el formulario y recargue.
export const RegistrarMedicamento = async (form, token, usuario) => {
    const url = `${medicamentosUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;

    LoadingDefault("Registrando Medicamento");
    const res = await enviarInventario(url, construirBody(form), token, "Ocurrió un error al registrar el medicamento.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return false;
    }

    await Swal.fire("Éxito", "Medicamento registrado correctamente.", "success");
    return true;
};
