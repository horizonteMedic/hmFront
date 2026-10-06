import Swal from "sweetalert2";
import { getFetch } from "../../../../utils/apiHelpers";
import {
    GetInfoPacNroTicketDefault,
    LoadingDefault,
    RegistrarServicioAsistencialDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero, fixEncodingModern } from "../../../../utils/helpers";
import { useAuthStore } from "../../../../../store/auth";

const triajeUrl = "/asistencial/triaje";
const empleadoUrl = "/api/v01/st/empleado";
const archivoEmpleadoUrl = "/api/v01/st/registros/detalleUrlArchivosEmpleados";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por eso
// se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../jaspers/ModuloAsistencial/Triaje/*.jsx");
const rutaJasper = "../../../../jaspers/ModuloAsistencial/Triaje/ReporteTriajeAsistencial.jsx";

const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

// Mappers puros (respuesta del backend -> campos del formulario). Los usan tanto la pantalla
// (setFormFromTicket / aplicarTriaje) como la impresión, para que nunca se desalineen.
const formFromTicket = (resultado) => ({
    pacienteId: resultado.pacienteId ?? null,
    ticketId: resultado.ticketId ?? null,
    numeroTicket: resultado.numeroTicket ?? String(resultado.numeroTicket ?? ""),
    nroHistorial: resultado.numeroHistoriaClinica ?? "",
    nombres: resultado.nombres ?? "",
    apellidos: resultado.apellidos ?? "",
    edad: resultado.edad ?? "",
    sexo: convertirGenero(resultado.sexo) ?? "",
    numeroDocumento: resultado.numeroDocumento ?? "",
    fechaNacimiento: formatearFechaCorta(resultado.fechaNacimiento) ?? "",
    lugarNacimiento: resultado.lugarNacimiento ?? "",
    estadoCivil: resultado.estadoCivil ?? "",
    nivelEstudios: resultado.nivelEstudios ?? "",
    ocupacion: resultado.ocupacion ?? "",
    empresa: resultado.empresa ?? "",
    contrata: resultado.contrata ?? "",
    nomExam: resultado.nomExam ?? resultado.tipoServicio ?? "",
});

const formFromTriaje = (data) => ({
    talla: data.tallaCm ?? "",
    peso: data.pesoKg ?? "",
    imc: data.imc ?? "",
    cintura: data.cinturaCm ?? "",
    icc: data.icc ?? "",
    cadera: data.caderaCm ?? "",
    temperatura: data.temperaturaC ?? "",
    fCardiaca: data.frecuenciaCardiaca ?? "",
    sat02: data.saturacionO2 ?? "",
    perimetroCuello: data.perimetroCuelloCm ?? "",
    sistolica: data.presionSistolica ?? "",
    diastolica: data.presionDiastolica ?? "",
    fRespiratoria: data.frecuenciaRespiratoria ?? "",
    diagnostico: data.diagnostico ?? "",
});

const setFormFromTicket = (setForm, resultado, nroTicket) => {
    setForm((prev) => ({
        ...prev,
        ...formFromTicket(resultado),
    }));
};

// Médico por defecto de un Triaje nuevo: el usuario logueado (mismo valor inicial del formulario,
// ver useSessionData).
const medicoPorDefecto = () => {
    const { userlogued } = useAuthStore.getState();
    return {
        user_medicoFirma: userlogued?.sub ?? "",
        nombre_medico: fixEncodingModern(userlogued?.datos?.nombres_user?.toUpperCase() ?? ""),
    };
};

// "usuarioMedicoFirma" viaja como username. EmpleadoComboBox resuelve el nombre a mostrar
// buscando ese username en listaEmpleados; mientras tanto (o si no está en la lista) se muestra el
// username en vez de dejar el nombre del médico anterior.
const medicoFromTriaje = (data, prev) => {
    const usuario = data.usuarioMedicoFirma;
    if (!usuario) return { user_medicoFirma: prev.user_medicoFirma, nombre_medico: prev.nombre_medico };
    return {
        user_medicoFirma: usuario,
        nombre_medico: usuario === prev.user_medicoFirma ? prev.nombre_medico : usuario,
    };
};

const aplicarTriaje = (setForm, data) => {
    setForm((prev) => ({
        ...prev,
        id: data.id ?? null,
        ...formFromTriaje(data),
        ...medicoFromTriaje(data, prev),
        diagnosticoCompleto: data.diagnosticoCompleto ?? prev.diagnosticoCompleto,
        fechaExamen: data.fechaTriaje ?? prev.fechaExamen,
        // Registro existente: bloquea edición (useRegistroEditable) + datos de auditoría
        // (sin confirmar contra el backend real, se mapean defensivamente).
        tieneRegistro: true,
        // Si ya hay Triaje, el bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: String(prev.numeroTicket ?? ""),
        userRegistro: data.usuarioRegistro ?? data.userRegistro ?? "",
        fechaRegistro: data.fechaRegistro ?? "",
        usuarioActualizacion: data.usuarioActualizacion ?? data.userActualizacion ?? "",
        fechaActualizacion: data.fechaActualizacion ?? "",
    }));
};

const limpiarVitales = (setForm) => {
    setForm((prev) => ({
        ...prev,
        id: null,
        talla: "",
        peso: "",
        imc: "",
        cintura: "",
        icc: "",
        cadera: "",
        temperatura: "",
        fCardiaca: "",
        sat02: "",
        perimetroCuello: "",
        sistolica: "",
        diastolica: "",
        fRespiratoria: "",
        diagnostico: "",
        diagnosticoCompleto: "",
        // Evita que el médico del ticket anterior quede asignado al nuevo.
        ...medicoPorDefecto(),
        // Sin triaje cargado todavía: registro "nuevo" (editable) hasta que aplicarTriaje
        // lo marque como existente, o se confirme que no hay uno.
        tieneRegistro: false,
        ticketImprimir: "",
        userRegistro: "",
        fechaRegistro: "",
        usuarioActualizacion: "",
        fechaActualizacion: "",
    }));
};

export const ObtenerTablaTickets = async (filters, token, setTablehc) => {
    let arr = [];

    if (filters?.numero) {
        const res = await GetInfoPacTicketDefault(filters.numero, token);
        const data = res?.resultado;
        arr = data ? [data] : [];
    } else {
        // Sin nombre de búsqueda: se restringe al rango de fechas (por defecto, el día actual)
        // para que la tabla se comporte igual que en SistemaOcupacional/Triaje, que solo
        // muestra los triajes registrados el mismo día. Al buscar por nombre no se restringe
        // por fecha, para poder encontrar historial de cualquier día.
        const query = new URLSearchParams();
        if (filters?.nombres) {
            query.set("nombreApellido", filters.nombres);
        } else if (filters?.fecha) {
            query.set("desde", filters.fecha);
            query.set("hasta", filters.fecha);
        }
        const res = await getFetch(`${triajeUrl}/buscar?${query.toString()}`, token);
        if (res && !res.error) {
            const data = unwrap(res);
            arr = Array.isArray(data) ? data : (data ? [data] : []);
        }
    }

    if (setTablehc) setTablehc(arr);
    return arr;
};

export const BuscarPorNroTicket = async (numeroTicket, token, setForm) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe ingresar un N° de Ticket", "error");
        return;
    }

    limpiarVitales(setForm);
    LoadingDefault("Buscando Número de Ticket");

    const res = await GetInfoPacNroTicketDefault(numeroTicket, token);
    const resultado = res?.resultado;

    if (!resultado) {
        Swal.close();
        await Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
        return;
    }

    setFormFromTicket(setForm, resultado, String(numeroTicket));

    const triaje = await getFetch(`${triajeUrl}/numero-ticket/${numeroTicket}`, token);
    Swal.close();

    const data = unwrap(triaje);
    if (!triaje || triaje.error || !data) {
        return;
    }

    aplicarTriaje(setForm, data);
};


export const BuscarPorTicket = async (numeroTicket, token, setForm) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe ingresar un N° de Ticket", "error");
        return;
    }

    limpiarVitales(setForm);
    LoadingDefault("Buscando Ticket");

    const res = await GetInfoPacNroTicketDefault(numeroTicket, token);
    const resultado = res?.resultado;

    if (!resultado) {
        Swal.close();
        await Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
        return;
    }

    setFormFromTicket(setForm, resultado, String(numeroTicket));

    const ticketId = resultado.ticketId ?? null;
    const triaje = await getFetch(`${triajeUrl}/ticket/${ticketId}`, token);
    Swal.close();

    const data = unwrap(triaje);
    if (!triaje || triaje.error || !data) {
        return;
    }

    aplicarTriaje(setForm, data);
};

export const CargarDesdeFila = async (row, token, setForm) => {
    // row.id puede ser el id propio del Triaje (cuando la fila viene de /asistencial/triaje/buscar),
    // por lo que ticketId se resuelve antes desde numeroTicket/ticketId que desde id.
    const numeroTicket = row.numeroTicket ?? "";
    if (!numeroTicket) return;

    limpiarVitales(setForm);
    setFormFromTicket(setForm, row, String(numeroTicket));
    LoadingDefault("Cargando Triaje");

    const res = await getFetch(`${triajeUrl}/ticket/${numeroTicket}`, token);
    Swal.close();

    const data = unwrap(res);
    if (!res || res.error || !data) {
        return;
    }

    aplicarTriaje(setForm, data);
};

export const VerDetalleTriaje = async (id, token) => {
    if (!id) return;
    LoadingDefault("Cargando Triaje");
    const res = await getFetch(`${triajeUrl}/${id}`, token);
    Swal.close();

    const data = unwrap(res);
    if (!res || res.error || !data) {
        Swal.fire("Error", "No se pudo cargar este registro de Triaje", "error");
        return;
    }

    Swal.fire({
        title: `Triaje del ${data.fechaTriaje ?? ""}`,
        html: `
            <div style="text-align:left;font-size:0.95em;line-height:1.6;">
                <p><b>Talla:</b> ${data.tallaCm ?? "-"} m &nbsp; <b>Peso:</b> ${data.pesoKg ?? "-"} kg &nbsp; <b>IMC:</b> ${data.imc ?? "-"}</p>
                <p><b>Cintura:</b> ${data.cinturaCm ?? "-"} cm &nbsp; <b>Cadera:</b> ${data.caderaCm ?? "-"} cm &nbsp; <b>ICC:</b> ${data.icc ?? "-"}</p>
                <p><b>Temperatura:</b> ${data.temperaturaC ?? "-"} °C &nbsp; <b>F.Cardiaca:</b> ${data.frecuenciaCardiaca ?? "-"}</p>
                <p><b>SAT.O2:</b> ${data.saturacionO2 ?? "-"} &nbsp; <b>P.Cuello:</b> ${data.perimetroCuelloCm ?? "-"} cm</p>
                <p><b>P.Arterial:</b> ${data.presionSistolica ?? "-"}/${data.presionDiastolica ?? "-"} mmHg &nbsp; <b>F.Respiratoria:</b> ${data.frecuenciaRespiratoria ?? "-"}</p>
                <p style="margin-top:8px;"><b>Diagnóstico:</b><br/>${(data.diagnostico ?? "-").replace(/\n/g, "<br/>")}</p>
            </div>
        `,
        icon: "info",
        confirmButtonText: "Cerrar",
    });
};

const RANGOS = [
    ["cintura", "Cintura"],
    ["cadera", "Cadera"],
    ["temperatura", "Temperatura"],
    ["fCardiaca", "F. Cardiaca"],
    ["sat02", "SAT. 02"],
    ["perimetroCuello", "Perímetro Cuello"],
    ["sistolica", "Sistólica"],
    ["diastolica", "Diastólica"],
    ["fRespiratoria", "F. Respiratoria"],
];

const validarRangos = (form) => {
    const vacios = RANGOS.filter(([campo]) => !form[campo]).map(([, label]) => label);
    if (vacios.length > 0) return `Faltan completar: ${vacios.join(", ")}`;

    const tieneValor = (v) => v !== "" && v != null;
    if (tieneValor(form.talla) && (form.talla < 1.3 || form.talla > 2.8)) return "No se permite este dato en Talla";
    if (tieneValor(form.peso) && (form.peso < 40 || form.peso > 150)) return "No se permite este dato en Peso";
    if (form.cintura < 45 || form.cintura > 180) return "No se permite este dato en Cintura";
    if (form.cadera < 70 || form.cadera > 180) return "No se permite este dato en Cadera";
    if (form.temperatura < 35 || form.temperatura >= 40) return "No se permite este dato en Temperatura";
    if (form.fCardiaca <= 39) return "No se permite este dato en Frecuencia Cardiaca";
    if (form.sat02 < 92 || form.sat02 > 100) return "No se permite este dato en Sat02";
    if (form.perimetroCuello < 30 || form.perimetroCuello > 55) return "No se permite este dato en Perímetro Cuello";
    if (form.sistolica < 90 || form.sistolica >= 250) return "No se permite este dato en Sistólica";
    if (form.diastolica < 60 || form.diastolica >= 150) return "No se permite este dato en Diastólica";
    if (form.fRespiratoria == 0) return "No se permite este dato en Frecuencia Respiratoria";

    return null;
};

const construirBody = (form) => ({
    id: form.id ?? null,
    numeroTicket: form.numeroTicket,
    pacienteId: form.pacienteId ?? null,
    edadAlMomento: form.edad,
    fechaTriaje: form.fechaExamen,
    tallaCm: form.talla,
    pesoKg: form.peso,
    imc: form.imc,
    cinturaCm: form.cintura,
    icc: form.icc,
    caderaCm: form.cadera,
    temperaturaC: form.temperatura,
    frecuenciaCardiaca: form.fCardiaca,
    saturacionO2: form.sat02,
    perimetroCuelloCm: form.perimetroCuello,
    presionSistolica: form.sistolica,
    presionDiastolica: form.diastolica,
    frecuenciaRespiratoria: form.fRespiratoria,
    diagnostico: form.diagnostico,
    diagnosticoCompleto: form.diagnosticoCompleto,
    usuarioMedicoFirma: form.user_medicoFirma,
});

export const RegistrarTriaje = async (form, token, usuario, onSuccess, datosFooter) => {
    if (!form.numeroTicket) {
        await Swal.fire("Error", "Debe buscar un Número de Ticket válido antes de registrar el Triaje.", "error");
        return;
    }

    // EmpleadoComboBox deja user_medicoFirma vacío si el texto no coincide con un empleado.
    if (!form.user_medicoFirma) {
        await Swal.fire("Error", "Debe asignar un médico.", "error");
        return;
    }

    const error = validarRangos(form);
    if (error) {
        await Swal.fire("Error", error, "error");
        return;
    }

    const body = construirBody(form);
    const url = `${triajeUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;
    // Se captura antes de limpiar: el formulario se vacía al terminar de guardar.
    const numeroTicket = form.numeroTicket;

    await RegistrarServicioAsistencialDefault(
        token,
        body,
        url,
        onSuccess,
        "Triaje registrado correctamente.",
        () => PrintTriaje(numeroTicket, token, datosFooter)
    );
};

// Nombre de la sede de la sesión actual (misma fuente que el selector de sede del Navbar): lo usa la
// cabecera del reporte.
const nombreSedeActual = () => {
    const { userlogued, selectedSede } = useAuthStore.getState();
    return userlogued?.sedes?.find((sede) => sede.cod_sede === selectedSede)?.nombre_sede ?? "";
};

// Sello y firma del médico asignado. A diferencia de los reportes ocupacionales, el Triaje no trae
// "digitalizacion" desde el backend, así que se arma aquí con el mismo formato (lo lee dibujarFirmas):
// usuarioMedicoFirma (username) -> idEmpleado (listaEmpleados de la sesión) -> DNI (GET empleado/{id})
// -> URL del SELLOFIRMA del empleado. Si algo falla, el reporte se imprime sin sello.
const obtenerDigitalizacionMedico = async (usuarioMedicoFirma, token) => {
    if (!usuarioMedicoFirma) return [];
    try {
        const { listaEmpleados } = useAuthStore.getState();
        const empleado = (listaEmpleados || []).find((emp) => emp.username === usuarioMedicoFirma);
        if (!empleado?.idEmpleado) return [];

        const datosEmpleado = await getFetch(`${empleadoUrl}/${empleado.idEmpleado}`, token);
        const dni = datosEmpleado?.numDocumento;
        if (!dni) return [];

        const sello = await getFetch(`${archivoEmpleadoUrl}/${dni}/SELLOFIRMA`, token);
        if (sello?.id !== 1 || !sello.mensaje) return [];

        return [{ nombreDigitalizacion: "SELLOFIRMADOCASIG", url: sello.mensaje }];
    } catch (error) {
        console.error("No se pudo obtener el sello del médico:", error);
        return [];
    }
};

// Datos que consume el Jasper: mismos nombres de campo del formulario, armados con los mappers de
// arriba a partir del ticket y del Triaje guardado (así la impresión y la pantalla nunca se desalinean).
const construirDatosImpresion = (ticket, triaje, numeroTicket, digitalizacion) => ({
    ...formFromTicket(ticket),
    ...formFromTriaje(triaje),
    fecha: triaje.fechaTriaje ?? "",
    sede: nombreSedeActual(),
    numeroTicket: ticket.numeroTicket ?? numeroTicket,
    numeroHistoriaClinica: ticket.numeroHistoriaClinica ?? "",
    digitalizacion,
});

// Imprime el Triaje GUARDADO de un ticket: triaje (GET .../numero-ticket/{n}) + datos del paciente
// (GET de tickets) y Jasper.
export const PrintTriaje = async (numeroTicket, token, datosFooter) => {
    LoadingDefault("Cargando Formato a Imprimir");

    try {
        const resTriaje = await getFetch(`${triajeUrl}/numero-ticket/${numeroTicket}`, token);
        const triaje = unwrap(resTriaje);

        if (!resTriaje || resTriaje.error || !triaje) {
            Swal.fire(
                "Sin Triaje",
                `El ticket N° ${numeroTicket} todavía no tiene un Triaje registrado.`,
                "warning"
            );
            return;
        }

        const resTicket = await GetInfoPacNroTicketDefault(numeroTicket, token);
        const ticket = resTicket?.resultado;

        if (!ticket) {
            Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
            return;
        }

        const modulo = await jasperModules[rutaJasper]();
        if (typeof modulo.default !== "function") {
            console.error(`El módulo ${rutaJasper} no exporta una función por defecto`);
            Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
            return;
        }

        const digitalizacion = await obtenerDigitalizacionMedico(triaje.usuarioMedicoFirma, token);

        await modulo.default({
            ...construirDatosImpresion(ticket, triaje, numeroTicket, digitalizacion),
            ...datosFooter,
        });
        Swal.close();
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
    }
};

// Botón IMPRIMIR: pide confirmación (como handlePrintDefault, pero por N° de Ticket) y luego imprime.
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

    if (isConfirmed) PrintTriaje(numeroTicket, token, datosFooter);
};
