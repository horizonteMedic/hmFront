import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
} from "../../../../../utils/functionUtils";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
    imprimirReporteJasper,
} from "../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/certificadoManipuladoresAlimentos/obtenerReporteCertificadoManipuladoresAlimentos";
const registrarUrl =
    "/api/v01/ct/certificadoManipuladoresAlimentos/registrarActualizarCertificadoManipuladoresAlimentos";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/*.jsx");
const rutaReporte = "../../../../../jaspers/Poderosa/CertificadoMedicoManipuladores_Barrick_Digitalizado.jsx";

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
        // Datos personales
        nombres: res.nombres ?? "",
        dni: res.dni ?? "",
        edad: res.edad != null ? `${res.edad} AÑOS` : "",
        sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        
        fechaNacimiento: res.fechaNac ?? "",
        lugarNacimiento: res.lugarNacimiento ?? "",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudios ?? "",

        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.areaO ?? "",
        cargoDesempenar: res.cargo ?? "",
        areaTrabajo: res.areaO ?? "",
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición =====
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish, true);
    if (!res) return;
    set((prev) => ({
        ...prev,
        norden: res.norden ?? prev.norden,
        fechaExam: res.fechaExamen ?? prev.fechaExam,
        nombreExamen: res.nombreExamen ?? "",
        esApto: res.apto ?? false,
        // Datos personales
        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`.trim(),
        dni: res.dniPaciente ?? "",
        edad: res.edadPaciente ?? "",
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
        fechaNacimiento: res.fechaNacimientoPaciente ?? "",
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",

        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        areaTrabajo: res.areaPaciente ?? "",
        // Conclusiones
        recomendaciones: res.recomendaciones ?? "",
        observaciones: res.observaciones ?? "",
        // El nombre se resuelve solo (EmpleadoComboBox busca el nombre a partir del id de firma).
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
    fechaExamen: form.fechaExam,
    apto: form.esApto,
    noApto: !form.esApto,
    observaciones: form.observaciones,
    recomendaciones: form.recomendaciones,
    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización).
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
                    html: "Este paciente ya cuenta con registros de Certificado de Manipuladores de Alimentos.",
                });
            }),
    });
