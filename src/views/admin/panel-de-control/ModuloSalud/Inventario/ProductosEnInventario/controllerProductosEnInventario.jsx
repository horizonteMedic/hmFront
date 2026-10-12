import { getJson, getLista, postJson, putJson } from "../../utils/apiSalud";

const URL_MEDICAMENTOS = "/api/medicamentos";

export const FORMULARIO_VACIO = {
    nombre: "",
    presentacion: "",
    uso: "",
    unidades: "",
    precioUnitario: "",
};

const porNombre = (a, b) => (a.nombre ?? "").localeCompare(b.nombre ?? "", "es");

// El backend maneja las «unidades» (UND) de cada medicamento. Si en su respuesta falta `stockActual` o
// `unidades`, la que falta toma el valor de la otra: así la pantalla siempre cuenta con el stock disponible.
const conStock = (medicamento) => {
    const stock = medicamento.stockActual ?? medicamento.unidades ?? 0;
    return { ...medicamento, stockActual: stock, unidades: medicamento.unidades ?? stock };
};

// Medicamentos activos de UNA campaña. Cada campaña tiene los suyos (el mismo medicamento puede existir en
// varias, con stock independiente): sin `campaniaId` el backend trae los de todas mezcladas, por eso nunca
// se piden sin él.
export const getMedicamentos = async (campaniaId, token) => {
    const medicamentos = await getLista(
        `${URL_MEDICAMENTOS}?${new URLSearchParams({ campaniaId })}`,
        token,
        "No se pudo cargar la lista de medicamentos"
    );
    return medicamentos.map(conStock).sort(porNombre);
};

export const getMedicamento = async (id, token) =>
    conStock(await getJson(`${URL_MEDICAMENTOS}/${id}`, token, "No se pudo cargar el detalle del medicamento"));

const formatoMoneda = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

// "S/ 2.50"; vacío si el medicamento no tiene precio
export const formatearPrecio = (precio) => (precio == null || precio === "" ? "" : formatoMoneda.format(precio));

// Medicamento del backend -> valores del formulario (todo texto, porque son inputs)
export const aFormulario = (medicamento) =>
    Object.fromEntries(Object.keys(FORMULARIO_VACIO).map((campo) => [campo, String(medicamento?.[campo] ?? "")]));

// { campo: mensaje } solo con lo obligatorio que falta o es inválido (unidades y precio son opcionales)
export const validarMedicamento = ({ nombre, presentacion, unidades, precioUnitario }) => {
    const errores = {};
    if (!nombre.trim()) errores.nombre = "Ingresa el nombre del medicamento";
    if (!presentacion.trim()) errores.presentacion = "Ingresa la presentación";
    if (unidades.trim() && !/^\d+$/.test(unidades.trim())) errores.unidades = "Ingresa un número entero (0 o más)";
    if (precioUnitario.trim() && !(Number(precioUnitario) >= 0)) errores.precioUnitario = "Ingresa un precio válido (0 o más)";
    return errores;
};

// Valores del formulario -> body de la API. Unidades vacías = 0; precio vacío = sin precio.
const cuerpoMedicamento = ({ nombre, presentacion, uso, unidades, precioUnitario }) => ({
    nombre: nombre.trim(),
    presentacion: presentacion.trim(),
    uso: uso.trim(),
    unidades: Number(unidades) || 0,
    precioUnitario: precioUnitario.trim() ? Number(precioUnitario) : null,
});

export const crearMedicamento = (formulario, campaniaId, token) =>
    postJson(URL_MEDICAMENTOS, { ...cuerpoMedicamento(formulario), campaniaId }, token, "No se pudo registrar el medicamento");

// El PUT no mueve el medicamento de campaña; se envían siempre todos los campos (los que falten se borrarían).
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
