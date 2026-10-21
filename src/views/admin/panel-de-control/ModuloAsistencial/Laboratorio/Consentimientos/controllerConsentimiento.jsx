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
} from "../../../../../utils/registroAsistencialUtils";
import { getToday } from "../../../../../utils/helpers";
import { ANTECEDENTES, antecedentesIniciales, datosConsentimiento, segmentosConsentimiento } from "./config/consentimientos";

// Endpoints REALES del backend (OpenAPI), compartidos por todos los consentimientos (se distinguen por nameConset):
//   POST {registrarUrl}                                                          registra / actualiza
//   GET  {registrarUrl}/obtenerReporte?numeroTicket=&nameConset=&esJasper=       registro del ticket
const registrarUrl = `${LABORATORIO_ASISTENCIAL_URL}/consentimiento`;

// El reporte no trae un id propio del registro, así que se considera que el ticket "tiene registro" cuando
// trae su auditoría de creación (fechaRegistro / userRegistro). Un error (404...) o un `resultado` sin
// auditoría cuentan como "sin registro".
const leerRegistro = (config, esJasper) =>
    crearLectorReporte({
        url: registrarUrl,
        nombreParametro: "nameConset",
        nameService: config.nameConset,
        tieneRegistro: (data) => Boolean(data.fechaRegistro || data.userRegistro),
    })(esJasper);

// Reporte Jasper del consentimiento (uno solo para todos; el texto y los antecedentes salen de la config). El
// glob debe ser un literal para que Vite pueda resolverlo en build; por eso se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../jaspers/ModuloAsistencial/Laboratorio/Consentimientos/*.jsx");
const rutaJasper = "../../../../../jaspers/ModuloAsistencial/Laboratorio/Consentimientos/ConsentimientoLaboratorio_Digitalizado.jsx";

// Valor del antecedente en el reporte (a veces con otro nombre que en el POST).
const valorReporte = (key) => ANTECEDENTES[key].valorReporte ?? ANTECEDENTES[key].valor;

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = (paciente, set) => {
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = (config, paciente, registro, set, numeroTicket) => {
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        fecha: registro.fecha ?? prev.fecha,

        antecedentes: antecedentesIniciales(config, getToday()).map((antecedente) => ({
            ...antecedente,
            value: Boolean(registro[valorReporte(antecedente.key)]),
            fecha: registro[ANTECEDENTES[antecedente.key].fecha] ?? antecedente.fecha,
        })),

        user_medicoFirma: registro.usuarioFirma ? registro.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: registro.doctorAsignado ?? "",

        // El bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: String(numeroTicket),

        ...auditoriaFromRegistro(registro),
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body =====
// El backend resuelve al paciente por el ticket (no lleva `pacienteId`). Cada antecedente viaja con su fecha
// (solo si se marcó). La auditoría se envía como la declara el DTO: `userRegistro` al crear; al editar,
// `usuarioActualizacion` y el `userRegistro` original (si no se reenvía, el UPDATE lo deja en null). Las fechas
// las pone el backend.
const construirBody = (config) => (form, user, esActualizacion) => ({
    numeroTicket: Number(form.numeroTicket),
    nameConset: config.nameConset,
    fechaex: form.fecha,

    ...Object.fromEntries(
        form.antecedentes.flatMap(({ key, value, fecha }) => [
            [ANTECEDENTES[key].valor, value],
            [ANTECEDENTES[key].fecha, value ? fecha : null],
        ])
    ),

    userMedicoOcup: "",
    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,

    ...(esActualizacion
        ? { usuarioActualizacion: user, userRegistro: form.userRegistro || null }
        : { userRegistro: user }),
});

// ===== Impresión =====
// `ajustarDatosReporte` completa numeroTicket, nombre, sede, historia clínica y sellos de firma del médico. El
// consentimiento lo firma el paciente: se agregan su firma y huella (si están registradas) y el contenido del
// documento (título, texto con los datos del paciente y antecedentes) que dibuja el reporte.
const ajustarDatos = (config, numeroTicket, token) => {
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
            consentimiento: {
                titulo: config.titulo,
                parrafo: segmentosConsentimiento(
                    config.texto,
                    datosConsentimiento({ ...paciente, empresa: paciente.empresa || registro.empresa })
                ),
                nota: config.nota,
                antecedentes: config.antecedentes.map(({ key, label }) => ({
                    label,
                    si: Boolean(registro[valorReporte(key)]),
                    fecha: registro[ANTECEDENTES[key].fecha],
                })),
            },
        };
    };
};

export const PrintHojaR = (config, numeroTicket, token) =>
    imprimirReporteTicket({
        numeroTicket,
        token,
        url: registrarUrl,
        obtenerRegistro: leerRegistro(config, true),
        jasperModules,
        rutaJasper,
        ajustarDatos: ajustarDatos(config, numeroTicket, token),
    });

// Botón IMPRIMIR: pide confirmación y luego imprime.
export const ConfirmarImpresion = (config, numeroTicket, token) =>
    confirmarImpresionTicket(numeroTicket, () => PrintHojaR(config, numeroTicket, token));

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (config, form, token, user, limpiar) => {
    // Se captura antes de limpiar: el formulario se vacía al terminar de guardar.
    const numeroTicket = form.numeroTicket;
    return guardarRegistroTicket({
        form,
        token,
        user,
        url: registrarUrl,
        obtenerRegistro: leerRegistro(config, false),
        usuarioEnQuery: false,
        limpiar,
        buildBody: construirBody(config),
        mensajeExito: `Consentimiento ${config.label} registrado correctamente.`,
        onPrint: () => PrintHojaR(config, numeroTicket, token),
    });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = (config, form, token, user, limpiar) => {
    const numeroTicket = form.numeroTicket;
    return actualizarRegistroTicket({
        form,
        token,
        user,
        url: registrarUrl,
        obtenerRegistro: leerRegistro(config, false),
        usuarioEnQuery: false,
        limpiar,
        buildBody: construirBody(config),
        mensajeExito: `Consentimiento ${config.label} actualizado correctamente.`,
        onPrint: () => PrintHojaR(config, numeroTicket, token),
    });
};

// ===== Búsqueda / verificación por N° Ticket =====
export const VerifyTR = (config, numeroTicket, token, set) =>
    verificarRegistroTicket({
        numeroTicket,
        token,
        url: registrarUrl,
        obtenerRegistro: leerRegistro(config, false),
        onNuevo: (paciente) => GetInfoServicio(paciente, set),
        onExistente: (paciente, registro) => {
            GetInfoServicioEditar(config, paciente, registro, set, numeroTicket);
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                html: `Este paciente ya cuenta con un consentimiento ${config.label}.`,
            });
        },
    });
