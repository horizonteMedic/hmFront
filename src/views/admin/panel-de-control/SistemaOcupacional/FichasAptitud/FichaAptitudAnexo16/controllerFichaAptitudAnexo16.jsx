import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    PrintHojaRJsReportDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { getHoraActual } from "../../../../../utils/helpers";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import { guardarRegistro, actualizarRegistro, validarSede } from "../../../../../utils/registroOcupacionalUtils";
import { inferirRestriccionesFA16 } from "./FA16FormDefaults";

// nameService del examen (también lo usa Auditoría de Protocolos para abrir el reporte)
export const TABLA_FICHA_APTITUD_ANEXO16 = "certificado_aptitud_medico_ocupacional";

const obtenerReporteUrl =
    "/api/v01/ct/anexos/fichaAnexo16/obtenerReporteFichaAnexo16";
const obtenerReporteResumenMedicoUrl =
    "/api/v01/ct/anexos/obtenerReporteResumenMedico";
const obtenerReporteJsReportUrl = "/api/v01/ct/anexos/descargarReporteFichaAptitudAnexo16";
const registrarUrl =
    "/api/v01/ct/anexos/fichaAnexo16/registrarActualizarFichaAnexo16";

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { },
    silent = false
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish,
        false,
        silent
    );
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden,
            tipoExamen: res.nombreExamen,
            dni: res.dniPaciente,
            nombres: res.nombresPaciente + " " + res.apellidosPaciente,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente),
            lugarNacimiento: res.lugarNacimientoPaciente,
            edad: res.edadPaciente,
            sexo: res.sexoPaciente == "F" ? "FEMENINO" : "MASCULINO",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,
            recomendaciones: res.recomendaciones,

            empresa: res.empresa,
            contrata: res.contrata,
            puestoPostula: res.ocupacionPaciente,
            ocupacion: res.areaPaciente,
            cargoDesempenar: res.cargoPaciente,


            conclusiones: res.observacionesFichaMedica,
            apto: res.apto ? "APTO" :
                res.noApto ? "NO APTO" :
                    res.evaluado ? "EVALUADO" : "APTO", //POR DEFECTO APTO EN CASO NO TRAIGA

            visionCercaOd: res.visioncercasincorregirodVCercaSOd,
            visionLejosOd: res.visionlejossincorregirodVLejosSOd,
            visionCercaOi: res.visioncercasincorregiroiVCercaSOi,
            visionLejosOi: res.visionlejossincorregiroiVLejosSOi,

            visionCercaOdCorregida: res.oftalodccmologiaOdcc,
            visionLejosOdCorregida: res.odlcoftalmologiaOdlc,
            visionCercaOiCorregida: res.oiccoftalmologiaOicc,
            visionLejosOiCorregida: res.oilcoftalmologiaOilc,

            visionColores: res.vcoftalmologiaVc,
            visionBinocular: res.vboftalmologiaVb,
            reflejosPupilares: res.rpoftalmologiaRp,
            enfermedadOculares: res.enfermedadesocularesoftalmoEOculares,

            hemoglobina: res.hemoglobinaTxthemoglobina,
            vsg: res.vsglabclinicoTxtvsg,
            glucosa: res.glucosalabclinicoTxtglucosabio,
            creatinina: res.creatininalabclinicoTxtcreatininabio,
        }));
    }
};

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
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden,
            tipoExamen: res.nombreExamen,

            dni: res.dniPaciente,
            nombres: res.nombresPaciente + " " + res.apellidosPaciente,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente),
            lugarNacimiento: res.lugarNacimientoPaciente,
            edad: res.edadPaciente,
            sexo: res.sexoPaciente == "F" ? "FEMENINO" : "MASCULINO",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,

            empresa: res.empresa,
            contrata: res.contrata,
            puestoPostula: res.ocupacionPaciente,
            ocupacion: res.areaPaciente,
            cargoDesempenar: res.cargoPaciente,

            conclusiones: res.conclusiones,
            apto: res.apto ? "APTO" :
                (res.aptoConRestriccion ? "APTO CON RESTRICCION" : res.noApto ?
                    "NO APTO" : res.conObservacion ?
                        "CON OBSERVACION" :
                        res.evaluado ? "EVALUADO" : ""),
            fechaValido: res.fechaDesde,
            fechaVencimiento: res.fechaHasta,
            recomendaciones: res.recomendaciones,
            restricciones: res.restriccionesDescripcion,

            // Checkboxes de recomendaciones - mapeados basados en restriccionesDescripcion
            ...inferirRestriccionesFA16(res.restriccionesDescripcion),
            ninguno: res.restriccionesDescripcion?.includes("NINGUNO") || res.restriccionesDescripcion === "NINGUNO." || false,
            // Médico que Certifica
            nombre_medico: res.nombreMedico,

            visionCercaOd: res.visioncercasincorregirodVCercaSOd,
            visionLejosOd: res.visionlejossincorregirodVLejosSOd,
            visionCercaOi: res.visioncercasincorregiroiVCercaSOi,
            visionLejosOi: res.visionlejossincorregiroiVLejosSOi,

            visionCercaOdCorregida: res.oftalodccmologiaOdcc,
            visionLejosOdCorregida: res.odlcoftalmologiaOdlc,
            visionCercaOiCorregida: res.oiccoftalmologiaOicc,
            visionLejosOiCorregida: res.oilcoftalmologiaOilc,

            visionColores: res.vcoftalmologiaVc,
            visionBinocular: res.vboftalmologiaVb,
            reflejosPupilares: res.rpoftalmologiaRp,
            enfermedadOculares: res.enfermedadesocularesoftalmoEOculares,

            hemoglobina: res.hemoglobinaTxthemoglobina,
            vsg: res.vsglabclinicoTxtvsg,
            glucosa: res.glucosalabclinicoTxtglucosabio,
            creatinina: res.creatininalabclinicoTxtcreatininabio,

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

            // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
            // FichaAnexo16ReporteDTO aún no devuelve estos campos: mientras tanto quedan vacíos.
            fechaRegistro: res.fechaRegistro ?? "",
            userRegistro: res.userRegistro ?? "",
            fechaActualizacion: res.fechaActualizacion ?? "",
            usuarioActualizacion: res.usuarioActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body base =====
// Campos propios del formulario (sin auditoría): el usuario que registra lo agrega sellarAuditoria.
const construirBase = (form) => ({
    norden: form.norden,
    dni: form.dni,
    fecha: form.fechaValido,
    nombreMedico: form.nombre_medico,
    apto: form.apto === "APTO",
    aptoRestriccion: form.apto === "APTO CON RESTRICCION",
    noApto: form.apto === "NO APTO",
    conObservacion: form.apto === "CON OBSERVACION",
    evaluado: form.apto === "EVALUADO",
    restriccionesDescripcion: form.restricciones,
    horaSalida: getHoraActual(),
    fechaHasta: form.fechaVencimiento,
    recomendaciones: form.recomendaciones,
    conclusiones: form.conclusiones,

    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). CertificadoAptitudMedicoOcupacionalDTO usa `usuarioRegistro` para
// el usuario que registra. El reporte (GET) aún no devuelve quién registró, así que al editar, si no se conoce
// el creador, se manda el usuario en sesión (como siempre) en vez de null para no borrarlo.
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro || user,
        fechaRegistro: form.fechaRegistro,
        campoUserRegistro: "usuarioRegistro",
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

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/Ficha_Anexo16/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/Ficha_Anexo16"
    );
};

// export const PrintHojaR = (nro, token, tabla) => {
//     PrintHojaRJsReportDefault(
//         nro,
//         token,
//         tabla,
//         obtenerReporteJsReportUrl
//     );
// };

export const PrintHojaR2 = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/Ficha_Anexo16/ResumenMedico/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteResumenMedicoUrl,
        jasperModules,
        "../../../../../jaspers/Ficha_Anexo16/ResumenMedico"
    );
};

// `silencioso`: al encontrar un registro existente solo cierra el "Validando datos", sin el aviso de
// "ya cuenta con registros" (formulario incrustado, donde el estado del registro ya se ve en pantalla).
export const VerifyTR = async (nro, tabla, token, set, sede, { silencioso = false } = {}) => {
    if (!nro) {
        await Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-keyboard"></i>Error',
            html: "Debe Introducir un N° Orden válido",
        });
        return;
    }

    Loading("Validando datos");

    // Como el resto de formularios de la plantilla: el N° Orden debe pertenecer a la sede actual.
    if (sede) {
        const { estado, descripcionSede } = await validarSede(nro, sede, token);
        if (estado === "otraSede") {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                html: `El N° Orden ${nro} pertenece a la sede${descripcionSede ? `: ${descripcionSede}` : ""}.`,
            });
            return;
        }
        if (estado !== "ok") {
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
                html: `Verifique el número de orden ${nro} e intente nuevamente.`,
            });
            return;
        }
    }

    VerifyTRPerzonalizado(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                if (silencioso) {
                    Swal.close();
                    return;
                }
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Ficha Aptitud Anexo 16.",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El Anexo 16 debe estar completado y cerrado antes de registrar la ficha de aptitud.",
                "warning"
            );
        }
    );
};

export const VerifyTRPerzonalizado = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }, necesitaExamen = () => { }) => {
    if (!nro) {
        await Swal.fire(
            "Error",
            "Debe Introducir un Nro de Historia Clínica válido",
            "error"
        );
        return;
    }
    Loading("Validando datos");
    getFetch(
        `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
        token
    ).then((res) => {
        if (res.id === 0) {
            //No tiene registro previo 
            noTieneRegistro();//datos paciente
        } else if (res.id === 2) {
            necesitaExamen();
        } else {
            tieneRegistro();//obtener data servicio
        }
    });
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
