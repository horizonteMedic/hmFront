import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import { consultarInventario, enviarInventario, inventarioUrl, limpiarTexto, normalizarTexto } from "../../Compartido/inventarioUtils";

const inventariosUrl = `${inventarioUrl}/inventarios`;

// Los inventarios que se crean desde esta pantalla son siempre de sede: el central ya existe y el
// backend deja cada sede ligada a él automáticamente.
const TIPO_INVENTARIO_SEDE = "SEDE";

// El central (el que no tiene inventario padre) va primero; el resto, por nombre.
export const ordenarInventarios = (a, b) => {
    const aEsCentral = a.inventarioPadreId == null;
    const bEsCentral = b.inventarioPadreId == null;
    if (aEsCentral !== bEsCentral) return aEsCentral ? -1 : 1;
    return String(a.nombre ?? "").localeCompare(String(b.nombre ?? ""), "es");
};

// Si falla deja el mensaje en `setErrorCarga` (la pantalla lo muestra con un botón de reintento) y no
// toca la lista que ya estaba cargada.
export const ObtenerInventarios = async (token, setInventarios, setErrorCarga) => {
    const res = await consultarInventario(inventariosUrl, token, "No se pudo cargar la lista de inventarios.");
    if (!res.ok) {
        setErrorCarga(res.mensaje);
        return [];
    }

    const lista = [...(Array.isArray(res.resultado) ? res.resultado : [])].sort(ordenarInventarios);
    setErrorCarga("");
    setInventarios(lista);
    return lista;
};

// { campo: mensaje } solo con lo que falta o es inválido; vacío si el formulario está listo para enviar.
export const ValidarInventario = (form, inventarios) => {
    const errores = {};
    const nombre = limpiarTexto(form.nombre);

    if (!nombre) {
        errores.nombre = "Ingrese el nombre del inventario";
    } else if (inventarios.some((inventario) => normalizarTexto(inventario.nombre) === normalizarTexto(nombre))) {
        errores.nombre = "Ya existe un inventario con ese nombre";
    }
    if (!form.sede) errores.sede = "Seleccione la sede";

    return errores;
};

const construirBody = (form) => ({
    nombre: limpiarTexto(form.nombre),
    tipo: TIPO_INVENTARIO_SEDE,
    sede: form.sede,
});

// Devuelve true si el inventario quedó registrado, para que la pantalla limpie el formulario y recargue.
export const RegistrarInventario = async (form, token, usuario) => {
    const url = `${inventariosUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;

    LoadingDefault("Registrando Inventario");
    const res = await enviarInventario(url, construirBody(form), token, "Ocurrió un error al registrar el inventario.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return false;
    }

    await Swal.fire("Éxito", "Inventario registrado correctamente.", "success");
    return true;
};
