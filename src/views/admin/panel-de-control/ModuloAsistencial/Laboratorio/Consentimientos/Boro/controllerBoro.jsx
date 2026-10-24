import Swal from "sweetalert2";
import {
    LABORATORIO_ASISTENCIAL_URL,
    actualizarRegistroTicket,
    ajustarDatosReporte,
    auditoriaFromRegistro,
    confirmarImpresionTicket,
    crearLectorReporte,
    formFromTicket,
    guardarRegistroTicket,
    imprimirReporteTicket,
    obtenerDigitalizacionPaciente,
    verificarRegistroTicket,
} from "../../../../../../utils/registroAsistencialUtils";
import { getToday } from "../../../../../../utils/helpers";
import { datosConsentimiento, segmentosConsentimiento } from "../config/consentimientos";

// Endpoints REALES del backend (OpenAPI):
//   POST {registrarUrl}                                                          registra / actualiza
//   GET  {registrarUrl}/obtenerReporte?numeroTicket=&nameConset=&esJasper=       registro del ticket
const registrarUrl = `${LABORATORIO_ASISTENCIAL_URL}/consentimiento-boro`;
const NAME_CONSET = "consent_Boro";

// Texto de la autorización (los marcadores se completan con los datos del paciente, ver segmentosConsentimiento).
export const TEXTO_BORO =
    "Yo {nombre} de {edad} años de edad, con documento de identidad N° {dni} trabajador ( {trabajador} ) o postulante ( {postulante} ), de la empresa {empresa}, autorizo al POLICLINICO HORIZONTE MEDIC, para que se me realice el examen toxicológico de drogas en orina y/o saliva, según los protocolos establecidos y que los resultados se entreguen directamente a la empresa.";

// El reporte no trae un id propio del registro, así que se considera que el ticket "tiene registro" cuando
// trae su auditoría de creación (fechaRegistro / userRegistro). Un error (404...) o un `resultado` sin
// auditoría cuentan como "sin registro".
const leerRegistro = (esJasper) =>
    crearLectorReporte({
        url: registrarUrl,
        nombreParametro: "nameConset",
        nameService: NAME_CONSET,
        tieneRegistro: (data) => Boolean(data.fechaRegistro || data.userRegistro),
    })(esJasper);
const obtenerRegistroFormulario = leerRegistro(false);
const obtenerRegistroReporte = leerRegistro(true);

// Reporte Jasper asistencial (cabecera del módulo). El glob debe ser un literal para que Vite pueda resolverlo
// en build; por eso se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/Laboratorio/Consentimientos/*.jsx");
const rutaJasper = "../../../../../../jaspers/ModuloAsistencial/Laboratorio/Consentimientos/ConsentimientoBoro_Digitalizado.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = (paciente, set) => {
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición (registro existente) =====
// El reporte devuelve `masticaHojaCoca`; el POST lo recibe como `masticahCoca`.
export const GetInfoServicioEditar = (paciente, registro, set, numeroTicket) => {
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        fecha: registro.fecha ?? prev.fecha,

        trabajador: Boolean(registro.trabajador),
        postulante: Boolean(registro.postulante),

        enfermedad: { key: Boolean(registro.antBoroAlgunaEnfermedad), cual: registro.critCualAlgunaEnfermedad ?? "" },
        medicamento: { key: Boolean(registro.antBoroAlgunMedicamento), cual: registro.critCualAlgunMedicamento ?? "" },
        matecoca: { key: Boolean(registro.antBoroConsumenMateCoca), fecha: registro.critFechaConsumoMateCoca ?? getToday() },
        chaccha: { key: Boolean(registro.masticaHojaCoca), fecha: registro.fechaConsumoHojaCoca ?? getToday() },
        tratamiento: {
            key: Boolean(registro.antBoroTratQuirugODental),
            cual: registro.critCualTratQuirugODental ?? "",
            cuando: registro.critCuandoTratQuirugODental ?? "",
            donde: registro.critDondeTratQuirugODental ?? "",
        },
        notas: registro.notas ?? "",

        user_medicoFirma: registro.usuarioFirma ? registro.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: registro.doctorAsignado ?? "",

        // El bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: String(numeroTicket),

        ...auditoriaFromRegistro(registro),
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body =====
// El backend resuelve al paciente por el ticket (no lleva `pacienteId`). Los detalles (cuál, fecha...) solo
// viajan si se marcó la pregunta. La auditoría se envía como la declara el DTO: `userRegistro` al crear; al
// editar, `usuarioActualizacion` y el `userRegistro` original (si no se reenvía, el UPDATE lo deja en null).
const construirBody = (form, user, esActualizacion) => ({
    numeroTicket: Number(form.numeroTicket),
    fechaex: form.fecha,

    trabajador: form.trabajador,
    postulante: form.postulante,

    antBoroAlgunaEnfermedad: form.enfermedad.key,
    critCualAlgunaEnfermedad: form.enfermedad.key ? form.enfermedad.cual : "",
    antBoroAlgunMedicamento: form.medicamento.key,
    critCualAlgunMedicamento: form.medicamento.key ? form.medicamento.cual : "",
    antBoroConsumenMateCoca: form.matecoca.key,
    critFechaConsumoMateCoca: form.matecoca.key ? form.matecoca.fecha : null,
    masticahCoca: form.chaccha.key,
    fechaConsumoHojaCoca: form.chaccha.key ? form.chaccha.fecha : null,
    antBoroTratQuirugODental: form.tratamiento.key,
    critCualTratQuirugODental: form.tratamiento.key ? form.tratamiento.cual : "",
    critCuandoTratQuirugODental: form.tratamiento.key ? form.tratamiento.cuando : "",
    critDondeTratQuirugODental: form.tratamiento.key ? form.tratamiento.donde : "",
    notas: form.notas,

    userMedicoOcup: "",
    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,

    ...(esActualizacion
        ? { usuarioActualizacion: user, userRegistro: form.userRegistro || null }
        : { userRegistro: user }),
});

// ===== Impresión =====
// `ajustarDatosReporte` completa numeroTicket, nombre, sede, historia clínica y sellos de firma del médico. El
// consentimiento lo firma el paciente: se agregan su firma y huella (si están registradas) y el párrafo de
// autorización con los datos del paciente.
const ajustarDatos = (numeroTicket, token) => {
    const ajustarBase = ajustarDatosReporte(numeroTicket, token, { apellidosPrimero: false });

    return async (paciente, registro) => {
        const [base, firmasPaciente] = await Promise.all([
            ajustarBase(paciente, registro),
            obtenerDigitalizacionPaciente(paciente.numeroDocumento, token),
        ]);
        const yaTiene = (nombre) => base.digitalizacion.some((d) => d.nombreDigitalizacion === nombre);

        return {
            ...base,
            digitalizacion: [...base.digitalizacion, ...firmasPaciente.filter((d) => !yaTiene(d.nombreDigitalizacion))],
            autorizacion: segmentosConsentimiento(TEXTO_BORO, {
                ...datosConsentimiento({ ...paciente, empresa: paciente.empresa || registro.empresa }),
                trabajador: registro.trabajador ? "X" : " ",
                postulante: registro.postulante ? "X" : " ",
            }),
        };
    };
};

export const PrintHojaR = (numeroTicket, token) =>
    imprimirReporteTicket({
        numeroTicket,
        token,
        url: registrarUrl,
        obtenerRegistro: obtenerRegistroReporte,
        jasperModules,
        rutaJasper,
        ajustarDatos: ajustarDatos(numeroTicket, token),
    });

// Botón IMPRIMIR: pide confirmación y luego imprime.
export const ConfirmarImpresion = (numeroTicket, token) =>
    confirmarImpresionTicket(numeroTicket, () => PrintHojaR(numeroTicket, token));

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar) => {
    // Se captura antes de limpiar: el formulario se vacía al terminar de guardar.
    const numeroTicket = form.numeroTicket;
    return guardarRegistroTicket({
        form,
        token,
        user,
        url: registrarUrl,
        obtenerRegistro: obtenerRegistroFormulario,
        usuarioEnQuery: false,
        limpiar,
        buildBody: construirBody,
        mensajeExito: "Consentimiento Boro registrado correctamente.",
        onPrint: () => PrintHojaR(numeroTicket, token),
    });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar) => {
    const numeroTicket = form.numeroTicket;
    return actualizarRegistroTicket({
        form,
        token,
        user,
        url: registrarUrl,
        obtenerRegistro: obtenerRegistroFormulario,
        usuarioEnQuery: false,
        limpiar,
        buildBody: construirBody,
        mensajeExito: "Consentimiento Boro actualizado correctamente.",
        onPrint: () => PrintHojaR(numeroTicket, token),
    });
};

// ===== Búsqueda / verificación por N° Ticket =====
export const VerifyTR = (numeroTicket, token, set) =>
    verificarRegistroTicket({
        numeroTicket,
        token,
        url: registrarUrl,
        obtenerRegistro: obtenerRegistroFormulario,
        onNuevo: (paciente) => GetInfoServicio(paciente, set),
        onExistente: (paciente, registro) => {
            GetInfoServicioEditar(paciente, registro, set, numeroTicket);
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                html: "Este paciente ya cuenta con un consentimiento Boro.",
            });
        },
    });
