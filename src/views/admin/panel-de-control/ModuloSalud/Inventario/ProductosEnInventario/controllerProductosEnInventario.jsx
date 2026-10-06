import { getJson, getLista, postJson, putJson } from "../../utils/apiSalud";

const URL_MEDICAMENTOS = "/api/medicamentos";

export const FORMULARIO_VACIO = {
    nombre: "",
    presentacion: "",
    uso: "",
    laboratorio: "",
    marca: "",
    unidadMedida: "",
    stockMinimo: "",
};

const porNombre = (a, b) => (a.nombre ?? "").localeCompare(b.nombre ?? "", "es");

// Medicamentos activos de UNA campaña. Cada campaña tiene los suyos (el mismo medicamento puede existir en
// varias, con stock independiente): sin `campaniaId` el backend trae los de todas mezcladas, por eso nunca
// se piden sin él.
export const getMedicamentos = async (campaniaId, token) => {
    const medicamentos = await getLista(
        `${URL_MEDICAMENTOS}?${new URLSearchParams({ campaniaId })}`,
        token,
        "No se pudo cargar la lista de medicamentos"
    );
    return medicamentos.sort(porNombre);
};

export const getMedicamento = (id, token) =>
    getJson(`${URL_MEDICAMENTOS}/${id}`, token, "No se pudo cargar el detalle del medicamento");

// Medicamento del backend -> valores del formulario (todo texto, porque son inputs)
export const aFormulario = (medicamento) =>
    Object.fromEntries(Object.keys(FORMULARIO_VACIO).map((campo) => [campo, String(medicamento?.[campo] ?? "")]));

// { campo: mensaje } solo con lo obligatorio que falta o es inválido
export const validarMedicamento = ({ nombre, presentacion, stockMinimo }) => {
    const errores = {};
    if (!nombre.trim()) errores.nombre = "Ingresa el nombre del medicamento";
    if (!presentacion.trim()) errores.presentacion = "Ingresa la presentación";
    if (!/^\d+$/.test(stockMinimo.trim())) errores.stockMinimo = "Ingresa el stock mínimo (0 o más)";
    return errores;
};

// Valores del formulario -> body de la API. El stock no se envía: solo cambia con ingresos y entregas.
const cuerpoMedicamento = ({ nombre, presentacion, uso, laboratorio, marca, unidadMedida, stockMinimo }) => ({
    nombre: nombre.trim(),
    presentacion: presentacion.trim(),
    uso: uso.trim(),
    laboratorio: laboratorio.trim(),
    marca: marca.trim(),
    unidadMedida: unidadMedida.trim(),
    stockMinimo: Number(stockMinimo),
});

export const crearMedicamento = (formulario, campaniaId, token) =>
    postJson(URL_MEDICAMENTOS, { ...cuerpoMedicamento(formulario), campaniaId }, token, "No se pudo registrar el medicamento");

// El PUT no mueve el medicamento de campaña ni toca su stock; `uso` se envía siempre (si no, se borraría).
export const editarMedicamento = (id, formulario, token) =>
    putJson(`${URL_MEDICAMENTOS}/${id}`, cuerpoMedicamento(formulario), token, "No se pudo editar el medicamento");

// Suma `cantidad` al stock del medicamento. Lote y fecha de vencimiento son obligatorios para el backend.
export const registrarIngresoStock = (medicamentoId, { cantidad, lote, fechaVencimiento, motivo }, usuarioRegistro, token) =>
    postJson(
        `/api/inventario/medicamentos/${medicamentoId}/ingresos`,
        { cantidad: Number(cantidad), lote: lote.trim(), fechaVencimiento, usuarioRegistro, motivo: motivo.trim() },
        token,
        "No se pudo registrar el ingreso de stock"
    );
