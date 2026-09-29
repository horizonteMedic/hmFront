import Swal from "sweetalert2";
import { getFetch } from "../../../../utils/apiHelpers";
import {
    GetInfoPacNroTicketDefault,
    LoadingDefault,
    RegistrarServicioAsistencialDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../utils/helpers";

const triajeUrl = "/asistencial/triaje";

const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

const setFormFromTicket = (setForm, resultado, nroTicket) => {
    setForm((prev) => ({
        ...prev,
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
    }));
};

const aplicarTriaje = (setForm, data) => {
    setForm((prev) => ({
        ...prev,
        id: data.id ?? null,
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
        diagnosticoCompleto: data.diagnosticoCompleto ?? prev.diagnosticoCompleto,
        fechaExamen: data.fechaTriaje ?? prev.fechaExamen,
        // Registro existente: bloquea edición (useRegistroEditable) + datos de auditoría
        // (sin confirmar contra el backend real, se mapean defensivamente).
        tieneRegistro: true,
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
        // Sin triaje cargado todavía: registro "nuevo" (editable) hasta que aplicarTriaje
        // lo marque como existente, o se confirme que no hay uno.
        tieneRegistro: false,
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
});

export const RegistrarTriaje = async (form, token, usuario, onSuccess) => {
    if (!form.numeroTicket) {
        await Swal.fire("Error", "Debe buscar un Número de Ticket válido antes de registrar el Triaje.", "error");
        return;
    }

    const error = validarRangos(form);
    if (error) {
        await Swal.fire("Error", error, "error");
        return;
    }

    const body = construirBody(form);
    const url = `${triajeUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;

    await RegistrarServicioAsistencialDefault(token, body, url, onSuccess, "Triaje registrado correctamente.");
};
