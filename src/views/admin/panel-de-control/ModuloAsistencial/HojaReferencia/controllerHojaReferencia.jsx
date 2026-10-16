import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { convertirGenero } from "../../../../utils/helpers";
import {
    auditoriaFromRegistro,
    buscarPacientePorTicket,
    completarSellosFirma,
    sedeDelTicket,
    unwrap,
} from "../../../../utils/registroAsistencialUtils";
import { useAuthStore } from "../../../../../store/auth";

// Hoja de Referencia del ticket (HojaReferenciaAsistencialDTO):
//   GET  .../ticket/{numeroTicket}  -> base precargada: paciente, triaje, historia clínica y receta (solo lectura)
//                                      + lo ya registrado de la referencia (id null si todavía no hay).
//   GET  .../catalogos              -> valores por defecto y listas de Área de atención y Condición.
//   POST ...?usuario=               -> upsert por numeroTicket con los campos editables (ver construirBody).
// Todo lo demás del DTO (paciente, triaje, historia, receta y auditoría) es readOnly: no se envía.
const baseUrl = "/asistencial/hoja-referencia";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por eso se
// declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../jaspers/ModuloAsistencial/HojaReferencia/HojaReferencia.jsx");
const rutaJasper = "../../../../jaspers/ModuloAsistencial/HojaReferencia/HojaReferencia.jsx";

// El backend no publica un catálogo de especialidades (la columna es texto libre): esta es la lista que
// ofrece el formulario. Un valor ya guardado que no esté aquí se conserva como opción extra.
export const ESPECIALIDADES = [
    "CARDIOLOGÍA",
    "CIRUGÍA GENERAL",
    "DERMATOLOGÍA",
    "ENDOCRINOLOGÍA",
    "GASTROENTEROLOGÍA",
    "GINECOLOGÍA Y OBSTETRICIA",
    "HEMATOLOGÍA",
    "INFECTOLOGÍA",
    "MEDICINA FÍSICA Y REHABILITACIÓN",
    "MEDICINA INTERNA",
    "NEFROLOGÍA",
    "NEUMOLOGÍA",
    "NEUROCIRUGÍA",
    "NEUROLOGÍA",
    "ODONTOLOGÍA",
    "OFTALMOLOGÍA",
    "ONCOLOGÍA",
    "OTORRINOLARINGOLOGÍA",
    "PEDIATRÍA",
    "PSICOLOGÍA",
    "PSIQUIATRÍA",
    "REUMATOLOGÍA",
    "TRAUMATOLOGÍA",
    "UROLOGÍA",
];

const texto = (valor) => String(valor ?? "").trim();
const numeroATexto = (valor) => (valor === null || valor === undefined ? "" : String(valor));
const numeroONull = (valor) => {
    const t = texto(valor);
    return t && Number.isFinite(Number(t)) ? Number(t) : null;
};
const tieneReferencia = (data) => data?.id !== null && data?.id !== undefined && data?.id !== "";

const normalizar = (valor) => texto(valor).toUpperCase();

// Valor de la lista que coincide con `valor` sin distinguir mayúsculas (así "Traumatología" guardado
// aparece seleccionado como "TRAUMATOLOGÍA"); si no hay coincidencia se conserva tal cual.
const opcionCanonica = (valor, opciones) => opciones.find((opcion) => normalizar(opcion) === normalizar(valor)) ?? texto(valor);

// ===== Catálogos =====
// Listas y valores por defecto del backend, o null si no se pudieron leer.
export const ObtenerCatalogos = async (token) => {
    try {
        const res = await getFetch(`${baseUrl}/catalogos`, token);
        const data = unwrap(res);
        if (!res || res.error || !data || typeof data !== "object") return null;
        return {
            establecimientoOrigenDefault: texto(data.establecimientoOrigenDefault),
            areaAtencionDefault: texto(data.areaAtencionDefault),
            areasAtencion: Array.isArray(data.areasAtencion) ? data.areasAtencion : [],
            condiciones: Array.isArray(data.condiciones) ? data.condiciones : [],
        };
    } catch (error) {
        console.error("No se pudieron leer los catálogos de la Hoja de Referencia:", error);
        return null;
    }
};

// ===== Lectura =====
// "personaIndicaTraslado" viaja como USERNAME del empleado. EmpleadoComboBox lee el id de
// `user_medicoFirma` y de ahí completa el nombre; si el valor no es un empleado conocido se muestra tal
// cual (y se reenvía igual al guardar, para no perderlo). Sin valor se conserva el predeterminado
// (el usuario de la sesión).
const resolverPersona = (valor, listaEmpleados, prev) => {
    const buscado = normalizar(valor);
    if (!buscado) return { user_medicoFirma: prev.user_medicoFirma, nombre_medico: prev.nombre_medico };
    const empleados = listaEmpleados || [];
    const empleado =
        empleados.find((emp) => normalizar(emp.username) === buscado) ??
        empleados.find((emp) => normalizar(emp.nombres) === buscado);
    return empleado
        ? { user_medicoFirma: empleado.username, nombre_medico: empleado.nombres }
        : { user_medicoFirma: texto(valor), nombre_medico: texto(valor) };
};

// HojaReferenciaAsistencialDTO -> campos del formulario. Los valores por defecto (establecimiento de
// origen, área de atención) solo se aplican si la referencia todavía no los tiene.
const formFromReferencia = (data, catalogos) => ({
    id: data.id ?? null,
    numeroHistoriaClinica: numeroATexto(data.numeroHistoriaClinica),
    // Paciente (solo lectura)
    nombres: `${texto(data.pacienteNombres)} ${texto(data.pacienteApellidos)}`.trim(),
    direccion: texto(data.direccion),
    celular: texto(data.celular),
    sexo: convertirGenero(data.sexo),
    edad: numeroATexto(data.edad),
    empresa: texto(data.empresa),
    // Establecimientos y área de atención
    establecimientoOrigen: texto(data.establecimientoOrigen) || catalogos?.establecimientoOrigenDefault || "",
    establecimientoDestino: texto(data.establecimientoDestino),
    areaAtencion: opcionCanonica(
        texto(data.areaAtencion) || catalogos?.areaAtencionDefault || "",
        catalogos?.areasAtencion ?? []
    ),
    resumenHistoriaClinica: texto(data.resumenHistoriaClinica),
    // Triaje: solo lectura, salvo MSNM que se registra con la referencia
    temperatura: numeroATexto(data.temperatura),
    presionArterial: texto(data.presionArterial),
    frecuenciaCardiaca: numeroATexto(data.frecuenciaCardiaca),
    frecuenciaRespiratoria: numeroATexto(data.frecuenciaRespiratoria),
    saturacionO2: numeroATexto(data.saturacionO2),
    msnm: numeroATexto(data.msnm),
    // Historia clínica y receta (solo lectura). "tratamiento" ya viene unido (historia + receta).
    fuenteHistoria: texto(data.fuenteHistoria),
    examenFisico: texto(data.examenFisico),
    diagnostico: texto(data.diagnostico),
    tratamiento: texto(data.tratamiento),
    // Datos de la referencia
    motivoReferencia: texto(data.motivoReferencia),
    especialidad: opcionCanonica(data.especialidad, ESPECIALIDADES),
    condicion: opcionCanonica(data.condicion, catalogos?.condiciones ?? []),
    relacionPertenencias: texto(data.relacionPertenencias),
});

// Busca la Hoja de Referencia por N° de Ticket: GET .../ticket/{numeroTicket}. Un solo llamado trae el
// paciente, el triaje, la historia clínica, la receta y la referencia (si existe).
export const VerifyTR = async (numeroTicket, token, set, catalogos, listaEmpleados) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe ingresar un N° de Ticket válido", "error");
        return;
    }

    LoadingDefault("Validando datos");
    const res = await getFetch(`${baseUrl}/ticket/${numeroTicket}`, token);
    Swal.close();

    const data = unwrap(res);
    if (res?.error || !data || (!texto(data.pacienteNombres) && !texto(data.pacienteApellidos))) {
        await Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
        return;
    }

    const tieneRegistro = tieneReferencia(data);
    const auditoria = auditoriaFromRegistro(data);

    set((prev) => ({
        ...prev,
        ...formFromReferencia(data, catalogos),
        ...resolverPersona(data.personaIndicaTraslado, listaEmpleados, prev),
        numeroTicket: String(numeroTicket),
        ticketCargado: true,
        // Si ya hay Hoja de Referencia, el bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: tieneRegistro ? String(numeroTicket) : "",
        tieneRegistro,
        userRegistro: auditoria.userRegistro,
        fechaRegistro: auditoria.fechaRegistro,
        usuarioActualizacion: auditoria.usuarioActualizacion,
        fechaActualizacion: auditoria.fechaActualizacion,
    }));

    if (tieneRegistro) {
        Swal.fire("Alerta", "Este ticket ya cuenta con una Hoja de Referencia.", "warning");
    }
};

// ===== Registro =====
// Campos escribibles del DTO. Los demás (paciente, triaje, historia, receta, auditoría) son readOnly.
const construirBody = (form) => ({
    numeroTicket: numeroONull(form.numeroTicket),
    establecimientoOrigen: texto(form.establecimientoOrigen),
    establecimientoDestino: texto(form.establecimientoDestino),
    areaAtencion: texto(form.areaAtencion),
    resumenHistoriaClinica: texto(form.resumenHistoriaClinica),
    msnm: numeroONull(form.msnm),
    motivoReferencia: texto(form.motivoReferencia),
    especialidad: texto(form.especialidad),
    condicion: texto(form.condicion),
    relacionPertenencias: texto(form.relacionPertenencias),
    // Va el username del empleado (p. ej. "jrojas"), no su nombre.
    personaIndicaTraslado: texto(form.user_medicoFirma),
});

// Mensaje del primer problema de la referencia (o null si se puede enviar).
const validarReferencia = (form) => {
    if (!form.numeroTicket || !form.ticketCargado) return "Debe buscar un N° de Ticket válido antes de registrar.";
    if (!texto(form.establecimientoDestino)) return "Indique el establecimiento de destino.";
    if (!texto(form.motivoReferencia)) return "Indique el motivo de la referencia.";
    if (!texto(form.condicion)) return "Seleccione la condición del paciente.";
    return null;
};

// SubmitData devuelve el Response SIN parsear cuando el HTTP no es 2xx: se lee para mostrar el motivo
// que da el backend (p. ej. "condición inválida").
const detalleError = async (res) => {
    const cuerpo = res?.ok === false ? await res.json().catch(() => null) : res;
    return cuerpo?.resultado?.detalle ?? cuerpo?.resultado?.mensaje ?? cuerpo?.mensaje ?? cuerpo?.message ?? "";
};

// Registra o actualiza la Hoja de Referencia: POST ...?usuario=. Upsert por numeroTicket (como Historia
// Clínica / Descanso Médico del módulo): el backend resuelve la auditoría con ?usuario=.
export const SubmitDataService = async (form, token, userlogued, limpiar, datosFooter) => {
    const error = validarReferencia(form);
    if (error) {
        await Swal.fire("Datos incompletos", error, "warning");
        return;
    }

    const query = new URLSearchParams({ usuario: userlogued ?? "" });
    // Se captura antes de limpiar: el formulario se vacía al terminar de guardar.
    const numeroTicket = form.numeroTicket;

    try {
        LoadingDefault("Registrando Datos");
        const res = await SubmitData(construirBody(form), `${baseUrl}?${query.toString()}`, token);
        Swal.close();

        const fallo = !res || res.ok === false || res.error === true || (res.codigo && Number(res.codigo) >= 400);
        if (fallo) {
            Swal.fire("Error", (await detalleError(res)) || "Ocurrió un error al registrar la Hoja de Referencia.", "error");
            return;
        }

        const { isConfirmed } = await Swal.fire({
            title: "Éxito",
            text: "Hoja de Referencia registrada correctamente.\n¿Desea imprimir?",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        });
        limpiar();
        if (isConfirmed) PrintHojaR(numeroTicket, token, datosFooter);
    } catch (e) {
        Swal.close();
        console.error(e);
        Swal.fire("Error", "Ocurrió un error inesperado al registrar la Hoja de Referencia.", "error");
    }
};

// ===== Impresión =====
const PARTICULAS = new Set(["DE", "DEL", "LA", "LAS", "LOS", "SAN", "SANTA", "VAN", "VON", "Y"]);

// El DTO trae los apellidos juntos y el formato los separa: el último apellido (con las partículas que lo
// preceden, p. ej. "DE LA CRUZ") es el materno y lo anterior el paterno. Un solo apellido va al paterno.
export const separarApellidos = (apellidos) => {
    const partes = texto(apellidos).split(/\s+/).filter(Boolean);
    if (partes.length <= 1) return { apellidoPaterno: partes[0] ?? "", apellidoMaterno: "" };

    let inicio = partes.length - 1;
    while (inicio > 1 && PARTICULAS.has(partes[inicio - 1].toUpperCase())) inicio -= 1;

    const paterno = partes.slice(0, inicio);
    if (paterno.every((parte) => PARTICULAS.has(parte.toUpperCase()))) {
        return { apellidoPaterno: partes.join(" "), apellidoMaterno: "" };
    }
    return { apellidoPaterno: paterno.join(" "), apellidoMaterno: partes.slice(inicio).join(" ") };
};

// Datos que consume el Jasper (ver HojaReferencia.jsx), armados con la referencia GUARDADA para que la
// impresión y la pantalla no se desalineen. `fecha` es la de registro de la referencia.
const construirDatosImpresion = (data, paciente, numeroTicket) => {
    const empleados = useAuthStore.getState().listaEmpleados || [];
    const persona = normalizar(data.personaIndicaTraslado);
    const empleado = persona ? empleados.find((emp) => normalizar(emp.username) === persona) : undefined;

    return {
        numeroTicket: data.numeroTicket ?? numeroTicket,
        numeroHistoriaClinica: data.numeroHistoriaClinica ?? paciente?.numeroHistoriaClinica ?? "",
        sede: sedeDelTicket(paciente),
        fecha: auditoriaFromRegistro(data).fechaRegistro.slice(0, 10),

        establecimientoOrigen: texto(data.establecimientoOrigen),
        establecimientoDestino: texto(data.establecimientoDestino),
        areaAtencionDestino: texto(data.areaAtencion),

        ...separarApellidos(data.pacienteApellidos),
        nombres: texto(data.pacienteNombres),
        direccion: texto(data.direccion),
        celular: texto(data.celular),
        sexo: texto(data.sexo),
        edad: data.edad,
        empresa: texto(data.empresa),

        resumenClinico: texto(data.resumenHistoriaClinica),
        temperatura: data.temperatura,
        presionArterial: data.presionArterial,
        frecuenciaCardiaca: data.frecuenciaCardiaca,
        frecuenciaRespiratoria: data.frecuenciaRespiratoria,
        saturacionOxigeno: data.saturacionO2,
        msnm: data.msnm,
        examenFisico: texto(data.examenFisico),
        diagnosticos: texto(data.diagnostico),
        tratamiento: texto(data.tratamiento),

        motivoReferencia: texto(data.motivoReferencia),
        especialidad: texto(data.especialidad),
        condicion: texto(data.condicion),
        relacionPertenencias: texto(data.relacionPertenencias),
        autoridadTraslado: empleado?.nombres ?? texto(data.personaIndicaTraslado),
    };
};

// Imprime la Hoja de Referencia GUARDADA de un ticket: GET .../ticket/{numeroTicket} y Jasper.
export const PrintHojaR = async (numeroTicket, token, datosFooter) => {
    LoadingDefault("Cargando Formato a Imprimir");

    try {
        // El paciente del ticket aporta la sede (la referencia no la trae).
        const [res, paciente] = await Promise.all([
            getFetch(`${baseUrl}/ticket/${numeroTicket}`, token),
            buscarPacientePorTicket(numeroTicket, token),
        ]);
        const data = unwrap(res);

        if (res?.error || !data) {
            Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
            return;
        }
        if (!tieneReferencia(data)) {
            Swal.fire(
                "Sin Hoja de Referencia",
                `El ticket N° ${numeroTicket} todavía no tiene una Hoja de Referencia registrada.`,
                "warning"
            );
            return;
        }

        const modulo = await jasperModules[rutaJasper]();
        if (typeof modulo.default !== "function") {
            console.error(`El módulo ${rutaJasper} no exporta una función por defecto`);
            Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
            return;
        }

        // El GET no trae "digitalizacion": el sello de quien indica el traslado se busca en el archivo de
        // empleados (sin sello cargado, el reporte sale con la línea para firmar a mano).
        const digitalizacion = await completarSellosFirma({ usuarioFirma: data.personaIndicaTraslado }, token);
        await modulo.default({ ...construirDatosImpresion(data, paciente, numeroTicket), digitalizacion, ...datosFooter });
        Swal.close();
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
    }
};

// Botón IMPRIMIR: pide confirmación y luego imprime la referencia del ticket indicado.
export const ConfirmarImpresion = async (numeroTicket, token, datosFooter) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe colocar un N° de Ticket", "error");
        return;
    }

    const { isConfirmed } = await Swal.fire({
        title: "¿Desea Imprimir Reporte?",
        html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Ticket: ${numeroTicket}</b></div>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, Imprimir",
        cancelButtonText: "Cancelar",
    });

    if (isConfirmed) PrintHojaR(numeroTicket, token, datosFooter);
};
