import Swal from "sweetalert2";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { GetInfoPacDefault, GetInfoServicioDefault, LoadingDefault } from "../../../../utils/functionUtils";
import { convertirGenero } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/escalaLakeLouise/obtenerReporte";
const registrarUrl = "/api/v01/ct/escalaLakeLouise/registrarActualizar";

// Reporte Jasper (un solo formato). El glob debe ser un literal para que Vite lo resuelva en build.
const jasperModules = import.meta.glob("../../../../jaspers/EscalaLakeLouise/*.jsx");
const rutaReporte = "../../../../jaspers/EscalaLakeLouise/EscalaLakeLouise.jsx";

// Preguntas de la escala (cada una vale su índice de respuesta, 0 a 4); la calificación es su suma.
export const PREGUNTAS_LAKE_LOUISE = [
    "cefalea",
    "sintomasDigestivos",
    "fatiga",
    "vertigo",
    "alteracionesSueno",
    "alteracionesMentales",
    "ataxia",
    "edemasPerifericos",
];

export const calcularPuntaje = (datos) =>
    PREGUNTAS_LAKE_LOUISE.reduce((total, name) => total + Number(datos[name] || 0), 0);

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    // El reporte llega envuelto en `resultado` (si algún día llega plano, se lee igual).
    const rese = res?.resultado ?? res;
    if (rese) {
        set((prev) => ({
            ...prev,
            // EscalaLakeLouiseReporteDTO trae la fecha como `fecha` (no `fechaExamen`): antes nunca se leía y al
            // editar el formulario mostraba (y reenviaba) la fecha de hoy en vez de la del examen.
            fecha: rese.fecha ?? rese.fechaExamen ?? prev.fecha,
            id: rese.id ?? null,
            nombreExamen: rese.nombreExamen ?? "",
            dni: rese.dni ?? "",

            nombres: rese.nombres ?? "",
            fechaNacimiento: formatearFechaCorta(rese.fechaNacimiento ?? ""),
            lugarNacimiento: rese.lugarNacimiento ?? "",
            edad: rese.edad ?? "",
            sexo: convertirGenero(rese.sexo ?? ""),
            estadoCivil: rese.estadoCivil ?? "",
            nivelEstudios: rese.nivelEstudio ?? "",
            // Datos Laborales
            empresa: rese.empresa ?? "",
            contrata: rese.contrata ?? "",
            ocupacion: rese.ocupacion ?? "",
            cargoDesempenar: rese.cargoDesempenar ?? "",

            cefalea: Number(rese.cefalea) || 0,
            sintomasDigestivos: Number(rese.sintomasDigestivos) || 0,
            fatiga: Number(rese.fatiga) || 0,
            vertigo: Number(rese.vertigo) || 0,
            alteracionesSueno: Number(rese.alteracionesSueno) || 0,
            alteracionesMentales: Number(rese.alteracionesMentales) || 0,
            ataxia: Number(rese.ataxia) || 0,
            edemasPerifericos: Number(rese.edemasPerifericos) || 0,
            calificacion: rese.calificacion ?? "",

            user_medicoFirma: rese.usuarioFirma ? rese.usuarioFirma : prev.user_medicoFirma,

            // Auditoría. EscalaLakeLouiseReporteDTO solo devuelve quién registró (`usuarioRegistro`): no trae
            // fechas de registro/edición ni quién editó (la sección las muestra como "—"). Si el backend los
            // agrega, se leen solos.
            userRegistro: rese.usuarioRegistro ?? rese.userRegistro ?? "",
            fechaRegistro: rese.fechaRegistro ?? "",
            usuarioActualizacion: rese.usuarioActualizacion ?? "",
            fechaActualizacion: rese.fechaActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body =====
// EscalaLakeLouiseDTO usa `userRegistro` para el usuario que registra y NO declara fechas de registro / actualización,
// por eso no se sella auditoría (sellarAuditoria agregaría campos que el DTO no tiene). Al editar se reenvía el
// creador que devolvió el reporte (así no se pisa con quien edita); si no vino, el usuario en sesión. La calificación
// se calcula siempre desde las respuestas (antes quedaba vacía si no se tocaba ninguna).
const construirBody = (form, user, esActualizacion) => ({
    norden: form.norden,
    id: form.id,
    fecha: form.fecha,
    cefalea: parseInt(form.cefalea),
    sintomaDigestivo: parseInt(form.sintomasDigestivos),
    fatiga: parseInt(form.fatiga),
    vertigo: parseInt(form.vertigo),
    alteracionesSueno: parseInt(form.alteracionesSueno),
    alteracionesMentales: parseInt(form.alteracionesMentales),
    ataxia: parseInt(form.ataxia),
    edemasPerifericos: parseInt(form.edemasPerifericos),
    calificacion: calcularPuntaje(form),
    usuarioFirma: form.user_medicoFirma,
    userRegistro: esActualizacion ? (form.userRegistro || user) : user,
});

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

// No se usa `imprimirReporteJasper`: este reporte llega envuelto en `resultado` y ese util valida `norden` en la raíz.
export const PrintHojaR = (nro, token, tabla) => {
    Loading("Cargando Formato a Imprimir");
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            const datos = res?.resultado ?? res;
            if (!datos?.norden) {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
                    html: `No se encontraron registros para el N° Orden ${nro}.`,
                });
                return;
            }
            const modulo = await jasperModules[rutaReporte]();
            if (typeof modulo.default === "function") {
                modulo.default(datos);
                Swal.close();
            } else {
                console.error("El reporte de Escala Lake Louise no exporta una función por defecto");
                Swal.fire({
                    icon: "error",
                    title: '<i class="fa-solid fa-print"></i>Error',
                    html: "No se pudo cargar el formato de impresión.",
                });
            }
        })
        .catch((error) => {
            console.error("Error al generar el reporte:", error);
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-print"></i>Error',
                html: "Ocurrió un error al generar el reporte.",
            });
        });
};

// verificarRegistro valida la sede del N° Orden y decide nuevo / existente.
export const VerifyTR = async (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        // NO tiene registro
        onNuevo: () => GetInfoPac(nro, set, token, sede),
        // SÍ tiene registro
        onExistente: () =>
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Escala Lake Louise.",
                    "warning"
                );
            }),
    });

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);

    // Norden inexistente / paciente no encontrado / error del backend.
    if (!res || res.error || !res.nombresApellidos) {
        Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
            html: `No se encontró ningún registro con el N° Orden ${nro}.`,
        });
        return;
    }

    set((prev) => ({
        ...prev,
        nombreExamen: res.nomExam ?? "",
        nombres: res.nombresApellidos ?? "",
        edad: res.edad ?? "",
        sexo: convertirGenero(res.genero ?? ""),
        dni: res.dni ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
        lugarNacimiento: res.lugarNacimiento ?? "",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudios ?? "",
        // Datos Laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.areaO ?? "",
        cargoDesempenar: res.cargo ?? "",
        userRegistro: "",
        fechaRegistro: "",
        usuarioActualizacion: "",
        fechaActualizacion: "",
        tieneRegistro: false,
    }));
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
