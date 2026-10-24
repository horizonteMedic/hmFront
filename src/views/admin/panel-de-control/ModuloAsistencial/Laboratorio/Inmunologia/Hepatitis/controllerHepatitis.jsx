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
    verificarRegistroTicket,
} from "../../../../../../utils/registroAsistencialUtils";

// Endpoints REALES del backend (OpenAPI). Este formulario trabaja sobre tres exámenes distintos
// ("lhepatitis" = A / "hepatitis_b" / "hepatitis_c") según el tipo de prueba (A/B/C) elegido en la vista, y
// cada uno tiene su propio endpoint:
//   A  POST /hepatitis     (marca, hepatitisA, hepatitisB, hepatitisC)   GET /hepatitis/obtenerReporte
//   B  POST /hepatitis-b   (marca, resultado)                            GET /hepatitis-b/obtenerReporte
//   C  POST /hepatitis-c   (marca, resultado)                            GET /hepatitis-c/obtenerReporte
// (los GET reciben ?numeroTicket=&nameService=&esJasper=).
//
// Ningún reporte trae un id propio del registro, así que se considera que el ticket "tiene registro" cuando
// el reporte trae su auditoría de creación (fechaRegistro / userRegistro). El OpenAPI no dice qué responde
// el backend cuando no hay registro: un error (404...), un `resultado` vacío o sin auditoría cuentan como
// "sin registro".
const tieneAuditoria = (data) => Boolean(data.fechaRegistro || data.userRegistro);

const urlA = `${LABORATORIO_ASISTENCIAL_URL}/hepatitis`;
const urlB = `${LABORATORIO_ASISTENCIAL_URL}/hepatitis-b`;
const urlC = `${LABORATORIO_ASISTENCIAL_URL}/hepatitis-c`;

const leerA = crearLectorReporte({ url: urlA, nameService: "hepatitis_asistencial", tieneRegistro: tieneAuditoria });
const leerB = crearLectorReporte({ url: urlB, nameService: "hepatitis_b_asistencial", tieneRegistro: tieneAuditoria });
const leerC = crearLectorReporte({ url: urlC, nameService: "hepatitis_c_asistencial", tieneRegistro: tieneAuditoria });

// Reporte Jasper asistencial (cabecera del módulo, sin datos laborales): una sola plantilla para los tres
// tipos, que elige por `tipoHepatitis`. El glob debe ser un literal para que Vite pueda resolverlo en
// build; por eso se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/Laboratorio/Inmunologia/*.jsx");
const rutaJasper = "../../../../../../jaspers/ModuloAsistencial/Laboratorio/Inmunologia/Hepatitis_Digitalizado.jsx";

// La auditoría se envía como la declara el DTO: `userRegistro` al crear; al editar, `usuarioActualizacion`
// y el `userRegistro` original (si no se reenvía, el UPDATE lo deja en null). Las fechas las pone el
// backend. El backend resuelve al paciente por el ticket (no lleva `pacienteId`).
const auditoriaBody = (form, user, esActualizacion) =>
    esActualizacion
        ? { usuarioActualizacion: user, userRegistro: form.userRegistro || null }
        : { userRegistro: user };

const bodyComun = (form) => ({
    numeroTicket: Number(form.numeroTicket),
    marca: form.marca,
    fechaExamen: form.fecha,
    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
});

// Todo lo que cambia entre los tres tipos.
const EXAMENES = {
    lhepatitis: {
        tipo: "A",
        url: urlA,
        obtenerRegistroFormulario: leerA(false),
        obtenerRegistroReporte: leerA(true),
        resultadosDelRegistro: (registro) => ({
            resultadoHAV: registro.hepatitisA ?? "",
            resultadoHBsAg: registro.hepatitisB ?? "",
            resultadoVHC: registro.hepatitisC ?? "",
        }),
        construirBody: (form, user, esActualizacion) => ({
            ...bodyComun(form),
            hepatitisA: form.resultadoHAV,
            hepatitisB: form.resultadoHBsAg,
            hepatitisC: form.resultadoVHC,
            ...auditoriaBody(form, user, esActualizacion),
        }),
    },
    hepatitis_b: {
        tipo: "B",
        url: urlB,
        obtenerRegistroFormulario: leerB(false),
        obtenerRegistroReporte: leerB(true),
        resultadosDelRegistro: (registro) => ({ resultadoHBsAg: registro.resultado ?? "" }),
        construirBody: (form, user, esActualizacion) => ({
            ...bodyComun(form),
            resultado: form.resultadoHBsAg,
            ...auditoriaBody(form, user, esActualizacion),
        }),
    },
    hepatitis_c: {
        tipo: "C",
        url: urlC,
        obtenerRegistroFormulario: leerC(false),
        obtenerRegistroReporte: leerC(true),
        resultadosDelRegistro: (registro) => ({ resultadoVHC: registro.resultado ?? "" }),
        construirBody: (form, user, esActualizacion) => ({
            ...bodyComun(form),
            resultado: form.resultadoVHC,
            ...auditoriaBody(form, user, esActualizacion),
        }),
    },
};

const examenPor = (tabla) => EXAMENES[tabla] ?? EXAMENES.lhepatitis;

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = (paciente, set, numeroTicket) => {
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        numeroTicket: String(numeroTicket),
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición (registro existente) =====
// El tipo de prueba (A/B/C) es el del examen consultado: cada tipo vive en su propio endpoint.
export const GetInfoServicioEditar = (paciente, registro, set, numeroTicket, tabla) => {
    const examen = examenPor(tabla);
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        numeroTicket: String(numeroTicket),
        fecha: registro.fechaExamen ?? prev.fecha,

        tipoHepatitis: examen.tipo,

        marca: registro.marca ?? "RAPID TEST - MONTEST",
        ...examen.resultadosDelRegistro(registro),

        user_medicoFirma: registro.usuarioFirma ? registro.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: registro.doctorAsignado ?? "",

        // El bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: String(numeroTicket),

        ...auditoriaFromRegistro(registro),
        tieneRegistro: true,
    }));
};

// ===== Impresión =====
// `ajustarDatosReporte` completa numeroTicket, nombre (apellidos primero), sede, historia clínica y
// sellos de firma; `tipoHepatitis` le dice a la plantilla qué prueba imprimir.
export const PrintHojaR = (numeroTicket, token, tabla) => {
    const examen = examenPor(tabla);
    const ajustarBase = ajustarDatosReporte(numeroTicket, token);
    return imprimirReporteTicket({
        numeroTicket,
        token,
        url: examen.url,
        obtenerRegistro: examen.obtenerRegistroReporte,
        jasperModules,
        rutaJasper,
        ajustarDatos: async (paciente, registro) => ({
            ...(await ajustarBase(paciente, registro)),
            tipoHepatitis: examen.tipo,
        }),
    });
};

// Botón IMPRIMIR: pide confirmación y luego imprime.
export const ConfirmarImpresion = (numeroTicket, token, tabla) =>
    confirmarImpresionTicket(numeroTicket, () => PrintHojaR(numeroTicket, token, tabla));

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla) => {
    // Se captura antes de limpiar: el formulario se vacía al terminar de guardar.
    const numeroTicket = form.numeroTicket;
    const examen = examenPor(tabla);
    return guardarRegistroTicket({
        form,
        token,
        user,
        url: examen.url,
        obtenerRegistro: examen.obtenerRegistroFormulario,
        usuarioEnQuery: false,
        limpiar,
        buildBody: examen.construirBody,
        mensajeExito: "Hepatitis registrada correctamente.",
        onPrint: () => PrintHojaR(numeroTicket, token, tabla),
    });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla) => {
    const numeroTicket = form.numeroTicket;
    const examen = examenPor(tabla);
    return actualizarRegistroTicket({
        form,
        token,
        user,
        url: examen.url,
        obtenerRegistro: examen.obtenerRegistroFormulario,
        usuarioEnQuery: false,
        limpiar,
        buildBody: examen.construirBody,
        mensajeExito: "Hepatitis actualizada correctamente.",
        onPrint: () => PrintHojaR(numeroTicket, token, tabla),
    });
};

// ===== Búsqueda / verificación por N° Ticket =====
export const VerifyTR = (numeroTicket, tabla, token, set) => {
    const examen = examenPor(tabla);
    return verificarRegistroTicket({
        numeroTicket,
        token,
        url: examen.url,
        obtenerRegistro: examen.obtenerRegistroFormulario,
        onNuevo: (paciente) => GetInfoServicio(paciente, set, numeroTicket),
        onExistente: (paciente, registro) => {
            GetInfoServicioEditar(paciente, registro, set, numeroTicket, tabla);
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                html: `Este paciente ya cuenta con registros de Hepatitis ${examen.tipo}.`,
            });
        },
    });
};
