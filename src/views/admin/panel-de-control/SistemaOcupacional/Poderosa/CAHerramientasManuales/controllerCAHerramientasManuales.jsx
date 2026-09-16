import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
    imprimirReporteJasper,
} from "../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/certificadoAptitudHerramientasManuales/obtenerReporteCertificadoAptitudHerramientasManuales";
const registrarUrl = "/api/v01/ct/certificadoAptitudHerramientasManuales/registrarActualizarCertificadoAptitudHerramientasManuales";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/*.jsx");
const rutaReporte = "../../../../../jaspers/Poderosa/Certificado_Aptitud_Herramientas_Manuales_Digitalizado.jsx";

// ===== Mapeo Registro nuevo =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    // Norden inexistente / paciente no encontrado / error del backend.
    if (!res || res.error || !res.norden) {
        Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
            html: `No se encontró ningún registro con el N° Orden ${nro}.`,
        });
        return;
    }
    set((prev) => ({
        ...prev,
        norden: res.norden ?? "",
        nombreExamen: res.nomExam ?? "",
        idCertificado: null,
        // Datos personales
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
        // Datos laborales
        cargoDesempenar: res.cargo ?? "",
        ocupacion: res.areaO ?? "",
        explotacion: res.explotacion ?? "",
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición =====
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (!res) return;
    set((prev) => ({
        ...prev,
        // Header
        norden: res.norden ?? prev.norden,
        idCertificado: res.idCertificado ?? null,
        nombreExamen: res.nombreExamen ?? prev.nombreExamen,
        tituloExamen: res.tituloExamen ?? prev.tituloExamen,
        fechaExamen: res.fechaCertificado ?? prev.fechaExamen,
        fechaHasta: res.fechaCaducidad ?? prev.fechaHasta,
        // Datos personales
        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`.trim(),
        dni: res.dniPaciente ?? "",
        edad: res.edadPaciente ?? "",
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.areaPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",
        explotacion: res.explotacion ?? "",
        // Aptitud / observación
        aptitud: res.apto ? "APTO" : res.aptoRestriccion ? "APTO CON RESTRICCION" : res.aptoTemporal ? "APTO TEMPORAL" : "NO APTO",
        observacion: res.observacion ?? "",
        nombre_medico: res.nombreMedico ?? prev.nombre_medico,
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        // La creación se conserva para reenviarla al editar y que el backend no la borre.
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
    idCertificado: form.idCertificado,
    tituloExamen: form.tituloExamen,
    apto: form.aptitud === "APTO",
    aptoRestriccion: form.aptitud === "APTO CON RESTRICCION",
    aptoTemporal: form.aptitud === "APTO TEMPORAL",
    observacion: form.observacion,
    fechaCertificado: form.fechaExamen,
    fechaCaducidad: form.fechaHasta,
    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). Este endpoint espera la clave "usuarioRegistro"
// (no "userRegistro") para el usuario que crea el registro.
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
        campoUserRegistro: "usuarioRegistro",
    });

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

// ===== Búsqueda / verificación por N° Orden =====
// Este examen es binario (nuevo / existente), sin estado de "necesita examen previo".
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
                    html: "Este paciente ya cuenta con registros de Certificado de Aptitud para Herramientas Manuales.",
                });
            }),
    });
