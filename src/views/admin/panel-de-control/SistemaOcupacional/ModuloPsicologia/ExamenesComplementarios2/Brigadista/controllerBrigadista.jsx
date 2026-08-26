import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
    imprimirReporteJasper,
} from "../../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/psiBrigadista/obtenerReporteBrigadista";
const registrarUrl =
    "/api/v01/ct/psiBrigadista/registrarActualizarBrigadista";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicoBrigadista/*.jsx");
const rutaReporte = "../../../../../../jaspers/ModuloPsicologia/InformePsicoBrigadista/Informe_Psico_Brigadista.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            estadoCivil: res.estadoCivil ?? "",
            nivelEstudios: res.nivelEstudios ?? "",
            dni: res.dni ?? "",
            edad: res.edad ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            cargoDesempenar: res.cargo ?? "",
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            tieneRegistro: false,
        }));
    }
};

// ===== Mapeo Edición (registro existente) =====
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
        onFinish
    );
    if (!res) return;
    set((prev) => ({
        ...prev,
        norden: res.norden ?? "",
        fecha: res.fechaExamen,

        esApto: res.cumplePerfil,

        nombreExamen: res.tipoExamen ?? "",
        dni: res.dniPaciente ?? "",

        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimiento ?? "",
        edad: res.edadPaciente ?? "",
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudio ?? "",
        // Datos Laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.areaPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",

        afrontamientoTomaDecisiones: res.afronTdd ?? "",
        estiloDeConflicto: res.estiloConflicto ?? "",
        afrontamientoSituacionesRiesgo: res.afronSitRiesgo ?? "",
        nivelAnsiedad: res.levelAnsiedad ?? "",

        // Análisis FODA
        fortalezasOportunidades: res.fodaForOpor ?? "",
        amenazasDebilidades: res.fodaAmenDebi ?? "",

        // Observaciones y Recomendaciones
        observaciones: res.observacion ?? "",
        recomendaciones: res.recomenda ?? "",

        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    fechaExamen: form.fecha,
    afronTdd: form.afrontamientoTomaDecisiones,
    estiloConflicto: form.estiloDeConflicto,
    afronSitRiesgo: form.afrontamientoSituacionesRiesgo,
    levelAnsiedad: form.nivelAnsiedad,
    fodaForOpor: form.fortalezasOportunidades,
    fodaAmenDebi: form.amenazasDebilidades,
    observacion: form.observaciones,
    recomenda: form.recomendaciones,
    cumplePerfil: form.esApto,

    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). Este módulo espera la clave "userRegistro".
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
    });

// ===== Validación de datos obligatorios =====
const datosCompletos = (form) => {
    if (form.esApto === undefined || form.esApto === null) {
        Swal.fire("Error", "Debe marcar aptitud", "error");
        return false;
    }
    return true;
};

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter, sede) =>
    imprimirReporteJasper({
        nro,
        token,
        tabla,
        datosFooter,
        sede,
        obtenerReporteUrl,
        jasperModules,
        rutaModulo: rutaReporte,
    });

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) => {
    if (!datosCompletos(form)) return;
    return guardarRegistro({
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
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) => {
    if (!datosCompletos(form)) return;
    return actualizarRegistro({
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

// ===== Búsqueda / verificación por N° Orden =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        onNuevo: () => GetInfoServicio(nro, set, token, sede),
        onExistente: () =>
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de Brigadista.",
                });
            }),
    });
