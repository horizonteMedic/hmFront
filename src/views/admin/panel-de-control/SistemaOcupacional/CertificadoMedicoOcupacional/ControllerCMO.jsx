import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    VerifyTRPerzonalizadoDefault,
} from "../../../../utils/functionUtils";
import { getHoraActual, getToday } from "../../../../utils/helpers";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    imprimirReporteJasper,
    validarSede,
} from "../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/certificadoAptitudMedicoOcupacional/obtenerReporteCertificadoMedicoOcupacional";
const registrarUrl =
    "/api/v01/ct/certificadoAptitudMedicoOcupacional/registrarActualizarCertificadoAptitudMedicoOcupacional";
const today = getToday();

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../jaspers/CertificadoMedicoOcupacional/*.jsx");
const rutaReporte = "../../../../jaspers/CertificadoMedicoOcupacional/Aptitud_medico_resumen_Digitalizado.jsx";

// ===== Mapeo Registro =====
// El mismo endpoint (obtenerReporte) arma el certificado con los datos de otros exámenes (Ficha de
// Aptitud, Oftalmología, Laboratorio, Triaje) exista o no un registro propio, por eso nuevo y existente
// comparten el mapeo y solo cambia lo que se setea al final (auditoría + tieneRegistro).
//
// CertificadoMedicoOcupacionalReporteDTO devuelve la aptitud en minúsculas pegadas (`apto`, `noapto`...)
// y la aptitud REAL del certificado sale de la Ficha de Aptitud (`esAptoAnexo`, `noAptoAnexo`...).
const mapReporte = (res, prev) => ({
    ...prev,
    ...res,

    // Datos personales / laborales (nombres de campo de DatosPersonalesLaborales)
    nombres: [res.nombrePaciente, res.apellidoPaciente].filter(Boolean).join(" "),
    dni: res.dniPaciente ?? "",
    edad: res.edadPaciente ?? "",
    sexo: res.sexoPaciente === "F" ? "Femenino" : "Masculino",
    fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
    lugarNacimiento: res.lugarNacimientoPaciente ?? "",
    estadoCivil: res.estadoCivilPaciente ?? "",
    nivelEstudios: res.nivelEstudioPaciente ?? "",
    empresa: res.empresa ?? "",
    contrata: res.contrata ?? "",
    ocupacion: res.ocupacionPaciente ?? "",
    cargoDesempenar: res.cargoPaciente ?? "",
    nombreExamen: res.nombreExamen ?? "",

    // Aptitud (solo lectura: viene de la Ficha de Aptitud)
    apto: res.esAptoAnexo
        ? "APTO"
        : res.aptoConRestriccionAnexo
            ? "APTOCONRESTRICCION"
            : res.evaluadoAnexo
                ? "EVALUADO"
                : res.noAptoAnexo
                    ? "NOAPTO"
                    : res.conObservacionAnexo
                        ? "OBSERVACION"
                        : "",

    fechaDesde: res.fechaDesde ? res.fechaDesde : today,
    fechahasta: res.fechahasta ? res.fechahasta : today,
    conclusiones: res.conclusiones ?? "",
    enfermedadesOcularesOftalmologia_e_oculares: `${res.enfermedadesOcularesOftalmologia_e_oculares ?? ""}\n${res.enfermedadesocularesotrosoftalmo_e_oculares1 ?? ""}`,
});

// ===== Mapeo Registro nuevo =====
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
    if (res) {
        set((prev) => ({
            ...mapReporte(res, prev),
            // Registro nuevo: sin auditoría real todavía (la sección muestra la creación en vivo).
            userRegistro: "",
            fechaRegistro: "",
            usuarioActualizacion: "",
            fechaActualizacion: "",
            tieneRegistro: false,
        }));
    }
};

// ===== Mapeo Edición =====
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
            ...mapReporte(res, prev),
            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
            // Auditoría. El reporte solo devuelve quién registró (`usuarioregistro`, en minúsculas):
            // no trae fechas de registro ni datos de edición.
            userRegistro: res.usuarioregistro ?? "",
            fechaRegistro: "",
            usuarioActualizacion: "",
            fechaActualizacion: "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body base =====
// Campos propios del formulario (sin auditoría): el usuario que registra lo agrega sellarAuditoria.
// La aptitud se reenvía tal como la cargó la Ficha de Aptitud ("Con observación" no tiene casilla en el DTO).
const construirBase = (form) => ({
    norden: form.norden,
    dniPaciente: form.dni,
    fecha: form.fechaDesde,
    nombreMedico: "",
    apto: form.apto === "APTO",
    aptoConRestriccion: form.apto === "APTOCONRESTRICCION",
    noApto: form.apto === "NOAPTO",
    evaluado: form.apto === "EVALUADO",
    horaSalida: getHoraActual(),
    fechaHasta: form.fechahasta,
    conclusiones: form.conclusiones,
    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). CertificadoAptitudMedicoResumenDTO espera el usuario que registra
// en `usuarioRegistro`; en la edición se reenvía el creador original (si el reporte no lo trajo, el usuario en sesión).
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro || user,
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
// VerifyTRPerzonalizadoDefault (3 estados: nuevo / existente / necesita Ficha de Aptitud), anteponiendo la
// validación de sede como el resto de formularios de la plantilla.
export const VerifyTR = async (nro, tabla, token, set, sede) => {
    if (!nro) {
        await Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-keyboard"></i>Error',
            html: "Debe Introducir un N° Orden válido",
        });
        return;
    }

    LoadingDefault("Validando datos");

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

    VerifyTRPerzonalizadoDefault(
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
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de C. Medico Ocupacional.",
                });
            });
        },
        () => {
            //Necesita Ficha de Aptitud (Anexo 2 o 16)
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-file-medical"></i>Alerta',
                html: "El paciente necesita pasar por Ficha de Aptitud 02 o 16.",
            });
        }
    );
};

// Plantillas de "Exámenes" (conclusiones) que se cargan al elegir una opción en el formulario.
export const Valores = {
    Check1: `- LABORATORIO: Hb / Hto, Grupo Sanguíneo y Factor ({grupoFactor}), Glucosa, Ex. orina, 
        - APTITUD
- ANEXO 16
- ANTECEDENTES ENFERMEDADES EN ALTURA
- ANEXO 16-A
- USO DE RESPIRADORES
- HISTORIA OCUPACIONAL
- ANTECEDENTES PATOLOGICOS
- CUESTIONARIO NORDICO
- MUSCULO ESQUELETICO
- OIT
- ESPIROMETRIA
- AUDIOMETRIA
- ODONTOLOGIA
- PSICOLOGIA
- AG. VISUAL
- CONSENTIMIENTO INFORMADO
- DECLARACION DE BUENA SALUD
- COPIA DE DNI


        `,

    Check2: `- LABORATORIO: Hma, Hb / Hto, Grupo Sanguíneo y Factor ({grupoFactor}), Glucosa, Ex. orina, 
        - APTITUD MÉDICA
- ANEXO 16
- ANTECEDENTES ENFERMEDADES EN ALTURA
- ANEXO 16-A
- PSICOSENSOMETRIA
- CERTIFICADO DE CONDUCCION
- FICHA SAS
- USO DE RESPIRADORES
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO
- OIT
- ESPIROMETRIA
- AUDIOMETRIA
- ODONTOLOGIA
- INFORME PSICOLOGICO
- AGUDEZA VISUAL
- DECLARACION DE BUENA SALUD
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI
- COPIA DE LICENCIA DE CONDUCIR


`,

    Check3: `- LABORATORIO: Hma, Hb / Hto, Glucosa, Ex. Orina,Grupo Sanguineo y Factor ({grupoFactor})
  - APTITUD MÉDICA
- ANEXO 16
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT 
- ESPIROMETRIA
- AUDIOMETRIA
- ODONTOLOGIA
- AGUDEZA VISUAL
- CONSENTIMIENTO DE BUENA SALUD
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI


`,

    Check4: `- LABORATORIO: Hma, Hb / Hto, Glucosa, Ex. Orina.
  - APTITUD MÉDICA
- ANEXO 16
-  HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT
-  ESPIROMETRIA
- AUDIOMETRIA 
- PSICOLOGIA
- OFTALMOLOGIA 
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI


`,

    Check5: `- LABORATORIO: Hma, Hb /Hto, Grupo Sanguineo y Factor ({grupoFactor})
- Glucosa, Creatinina /dl, Ex. Orina, RPR, Test cualitativo: Cocaína y Marihuana, Colesterol y Triglicéridos
- APTITUD MÉDICA
- ANEXO 16
- ANT. ENFERMEDADES ALTURA
- ANEXO 16 – A
- CERT. DE SUFICIENCIA MEDICA PARA TRABAJO EN ALTURA
- PSICOSENSOMETRICO 
- CERT. DE SUFICIENCIA MEDICA PARA CONDUCCION DE VEHICULO                           
- FICHA S.A.S.
- USO DE RESPIRADORES
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT
- ESPIROMETRIA   
- EKG 
- ODONTOLOGIA
- AUDIOMETRIA 
- OFTALMOLOGIA 
- PSICOLOGIA
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI
- COPIA DE LICENCIA DE CONDUCIR

`,

    Check6: `- LABORATORIO:  Hb /Hto, Glucosa, Ex. Orina NORMAL, 
  - APTITUD MÉDICA
- ANEXO 16
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT
- AUDIOMETRIA 
- OFTALMOLOGIA 
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI


`,

    Check7: `- LABORATORIO: Hma, Hb /Hto, Grupo Sanguineo y Factor ({grupoFactor}), Glucosa, Creatinina /dl, Ex. Orina NORMAL, Vsg , RPR,
  - TEST CUALITATIVO: COLESTEROL Y TRIGLICÉRIDOS
- APTITUD MÉDICA
- ANEXO 16
- ANT. ENFERMEDADES ALTURA
- ANEXO 16 – A
- CERT. DE SUFICIENCIA MEDICA PARA TRABAJO EN ALTURA
- PSICOSENSOMETRICO
- CERT. DE CONDUCCION DE VEHICULOS
- USO DE RESPIRADORES
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT
- ESPIROMETRIA
- EKG
- AUDIOMETRIA 
- ODONTOLOGIA
 - OFTALMOLOGIA 
- PSICOLOGIA
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI
- COPIA DE LICENCIA


`,
};
