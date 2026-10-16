import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { consultarInventario, enviarInventario, inventarioUrl, limpiarTexto, normalizarTexto } from "../inventarioUtils";

const medicamentosUrl = `${inventarioUrl}/medicamentos`;
const tiposMedicamentoUrl = `${medicamentosUrl}/tipos`;

// Dos medicamentos son el mismo si coinciden nombre y presentación (sin importar mayúsculas, tildes
// ni espacios). Es el mismo criterio con el que el backend rechaza los duplicados.
export const claveMedicamento = (nombre, presentacion) => `${normalizarTexto(nombre)}|${normalizarTexto(presentacion)}`;

const ordenarPorNombre = (a, b) => String(a.nombre ?? "").localeCompare(String(b.nombre ?? ""), "es");

// Carga el catálogo y los tipos en paralelo. Si algo falla deja el mensaje en `setErrorCarga` (la pantalla
// lo muestra con un botón de reintento) y conserva lo que ya estaba cargado.
export const ObtenerCatalogoMedicamentos = async (token, setMedicamentos, setTipos, setErrorCarga) => {
    const [medicamentos, tipos] = await Promise.all([
        consultarInventario(medicamentosUrl, token, "No se pudo cargar la lista de medicamentos."),
        consultarInventario(tiposMedicamentoUrl, token, "No se pudo cargar los tipos de medicamento."),
    ]);

    const fallo = [medicamentos, tipos].find((res) => !res.ok);
    setErrorCarga(fallo ? fallo.mensaje : "");

    if (medicamentos.ok) {
        setMedicamentos([...(Array.isArray(medicamentos.resultado) ? medicamentos.resultado : [])].sort(ordenarPorNombre));
    }
    if (tipos.ok) {
        setTipos(Array.isArray(tipos.resultado) ? tipos.resultado : []);
    }
};

// { campo: mensaje } solo con lo que falta o es inválido; vacío si el formulario está listo para enviar.
export const ValidarMedicamento = (form, medicamentos) => {
    const errores = {};
    const nombre = limpiarTexto(form.nombre);
    const presentacion = limpiarTexto(form.presentacion);

    if (!nombre) errores.nombre = "Ingrese el nombre del medicamento";
    if (!presentacion) errores.presentacion = "Ingrese la presentación (tableta, crema, frasco...)";
    if (!form.tipoMedicamento) errores.tipoMedicamento = "Seleccione el tipo de medicamento";
    if (form.stockMinimo !== "" && !/^\d+$/.test(String(form.stockMinimo))) {
        errores.stockMinimo = "Ingrese un número entero (0 o más)";
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
    presentacion: limpiarTexto(form.presentacion),
    tipoMedicamento: Number(form.tipoMedicamento),
    // El stock mínimo es opcional: vacío = 0 (sin aviso de reposición).
    stockMinimo: Number(form.stockMinimo) || 0,
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
