import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl =
    "/api/v01/ct/riesgoElectrico/obtenerReporte";
const registrarUrl =
    "/api/v01/ct/riesgoElectrico/registrarActualizar";

// Reporte Jasper (un solo formato). El glob debe ser un literal para que Vite lo resuelva en build.
const jasperModules = import.meta.glob("../../../../jaspers/CertificadoRiesgoElectrico/*.jsx");
const rutaReporte = "../../../../jaspers/CertificadoRiesgoElectrico/CertificadoRiesgoElectrico.jsx";

const auditoriaVacia = {
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
};

// Datos del paciente y de su empresa (el reporte llega envuelto en `resultado`). Son los mismos para un registro
// nuevo y para uno existente.
const mapearReporte = (rese) => ({
    // Header
    norden: rese.norden ?? "",
    tipoExamen: rese.tipoExamen ?? "",
    // Datos personales
    nombres: `${rese.nombresPaciente ?? ""} ${rese.apellidosPaciente ?? ""}`.trim(),
    dni: rese.dniPaciente ?? "",
    edad: rese.edadPaciente ?? "",
    fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
    lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
    estadoCivil: rese.estadoCivilPaciente ?? "",
    nivelEstudios: rese.nivelEstudioPaciente ?? "",
    sexo: convertirGenero(rese.sexoPaciente),
    empresa: rese.empresa ?? "",
    contrata: rese.contrata ?? "",
    // Campos usados por la interfaz principal
    cargoDesempenar: rese.cargoPaciente ?? "",
    ocupacion: rese.ocupacionPaciente ?? "",
    tiempoExperiencia: rese.tiempoExperiencia ?? "",
});

// ===== Registro nuevo =====
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
        onFinish,
        true
    );
    // El reporte llega envuelto en `resultado` (si algún día llega plano, se lee igual).
    const rese = res?.resultado ?? res;
    if (rese) {
        set((prev) => ({
            ...prev,
            ...mapearReporte(rese),
            id: null,
            ...auditoriaVacia,
            tieneRegistro: false,
        }));
    }
};

// ===== Registro existente =====
export const GetInfoServicioEditar = async (
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
        onFinish,
        true
    );
    const rese = res?.resultado ?? res;
    if (rese) {
        set((prev) => ({
            ...prev,
            ...mapearReporte(rese),
            id: rese.id ?? null,

            fechaExamen: rese.fechaExamen ?? "",
            fechaExpiracion: rese.fechaExpiracion ?? "",

            ubicacionSitio: rese.ubicacionSitio ?? "",

            evaluacionRiesgoRealizada: rese.evaluacionRiesgoRealizada ?? "",
            personalCompetenteAreaElectrica: rese.personalCompetenteAreaElectrica ?? "",
            conoceTipoVoltaje: rese.conoceTipoVoltaje ?? "",
            personalCertificadoVoltaje: rese.personalCertificadoVoltaje ?? "",
            eppApropiadoTarea: rese.eppApropiadoTarea ?? "",
            sistemaDesenergizado: rese.sistemaDesenergizado ?? "",
            sistemaAislado: rese.sistemaAislado ?? "",
            tarjetasAdvertenciaInstaladas: rese.tarjetasAdvertenciaInstaladas ?? "",
            bloqueosInstalados: rese.bloqueosInstalados ?? "",
            sistemasAterrizados: rese.sistemasAterrizados ?? "",
            trabajosSimultaneosControlados: rese.trabajosSimultaneosControlados ?? "",
            personalEntrenadoRiesgoElectrico: rese.personalEntrenadoRiesgoElectrico ?? "",
            medidasSeguridadSatisfactorias: rese.medidasSeguridadSatisfactorias ?? "",

            aptitud: rese.apto
                ? "APTO"
                : rese.noApto
                    ? "NO_APTO"
                    : rese.conRestriccion
                        ? "RESTRICCION"
                        : "",

            user_medicoFirma: rese.usuarioFirma ? rese.usuarioFirma : prev.user_medicoFirma,

            // Auditoría. RiesgoElectricoReporteDTO solo devuelve quién registró (`usuarioRegistro`): no trae fechas
            // de registro/edición ni quién editó (la sección las muestra como "—"). Si el backend los agrega, se
            // leen solos.
            userRegistro: rese.usuarioRegistro ?? rese.userRegistro ?? "",
            fechaRegistro: rese.fechaRegistro ?? "",
            usuarioActualizacion: rese.usuarioActualizacion ?? "",
            fechaActualizacion: rese.fechaActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body =====
// RiesgoElectricoDTO usa `usuarioRegistro` (antes se mandaba `userRegistro`, que el DTO no tiene: el backend lo
// ignoraba y no se guardaba quién registró) y NO declara fechas de registro / actualización, por eso no se sella
// auditoría. Al editar se reenvía el creador que devolvió el reporte (así no se pisa con quien edita); si no vino,
// el usuario en sesión.
const construirBody = (form, user, esActualizacion) => ({
    norden: form.norden,
    id: form.id,
    fecha: form.fechaExamen,
    fechaExpiracion: form.fechaExpiracion,
    usuarioRegistro: esActualizacion ? (form.userRegistro || user) : user,
    usuarioFirma: form.user_medicoFirma,

    ubicacionSitio: form.ubicacionSitio,

    apto: form.aptitud == "APTO",
    conRestriccion: form.aptitud == "RESTRICCION",
    noApto: form.aptitud == "NO_APTO",

    evaluacionRiesgoRealizada: form.evaluacionRiesgoRealizada,
    personalCompetenteAreaElectrica: form.personalCompetenteAreaElectrica,
    conoceTipoVoltaje: form.conoceTipoVoltaje,
    personalCertificadoVoltaje: form.personalCertificadoVoltaje,
    eppApropiadoTarea: form.eppApropiadoTarea,
    sistemaDesenergizado: form.sistemaDesenergizado,
    sistemaAislado: form.sistemaAislado,
    tarjetasAdvertenciaInstaladas: form.tarjetasAdvertenciaInstaladas,
    bloqueosInstalados: form.bloqueosInstalados,
    sistemasAterrizados: form.sistemasAterrizados,
    trabajosSimultaneosControlados: form.trabajosSimultaneosControlados,
    personalEntrenadoRiesgoElectrico: form.personalEntrenadoRiesgoElectrico,
    medidasSeguridadSatisfactorias: form.medidasSeguridadSatisfactorias,
});

// La aptitud y la ubicación del sitio son obligatorias tanto al guardar como al editar.
const datosCompletos = async (form) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return false;
    }
    if (form.aptitud == "") {
        await Swal.fire("Advertencia", "Debe seleccionar la aptitud", "warning");
        return false;
    }
    if (form.ubicacionSitio == "") {
        await Swal.fire("Advertencia", "Debe seleccionar la ubicación del sitio", "warning");
        return false;
    }
    return true;
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
    if (!(await datosCompletos(form))) return;
    await guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
    if (!(await datosCompletos(form))) return;
    await actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

// No se usa `imprimirReporteJasper`: este reporte llega envuelto en `resultado` y ese util valida `norden` en la raíz.
export const PrintHojaR = (nro, token, tabla) => {
    Loading('Cargando Formato a Imprimir')
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
            if (typeof modulo.default === 'function') {
                modulo.default(datos);
                Swal.close()
            } else {
                console.error("El reporte de Certificado de Riesgo Eléctrico no exporta una función por defecto");
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
}

// verificarRegistro valida la sede del N° Orden y decide nuevo / existente.
export const VerifyTR = async (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        // NO tiene registro
        onNuevo: () =>
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.close();
            }),
        // SÍ tiene registro
        onExistente: () =>
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Certificado Riesgo Eléctrico",
                    "warning"
                );
            }),
    });


export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
