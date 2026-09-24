import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

const fichaPorTicketUrl = "/api/antecedentes/ticket";
const registrarUrl = "/api/antecedentes";

const sexoToOption = (sexo) => {
    if (sexo === "M") return "MASCULINO";
    if (sexo === "F") return "FEMENINO";
    return "";
};

const formFromPaciente = (paciente) => ({
    dni: paciente?.numeroDocumento ?? "",
    nombres: paciente?.nombres ?? "",
    apellidos: paciente?.apellidos ?? "",
    fechaNacimiento: formatearFechaCorta(paciente?.fechaNacimiento ?? ""),
    lugarNacimiento: paciente?.lugarNacimiento ?? "",
    edad: paciente?.edad ?? "",
    sexo: sexoToOption(paciente?.sexo),
    estadoCivil: paciente?.estadoCivil ?? "",
    nivelEstudios: paciente?.nivelEstudios ?? "",
    ocupacion: paciente?.ocupacion ?? "",
});

// Busca la ficha de antecedentes por N° de Ticket: GET /api/antecedentes/ticket/{numeroTicket}.
// El paciente viaja anidado en la respuesta (resultado.paciente), así que un solo llamado
// alcanza para saber si ya existe registro y para llenar tanto los datos del paciente como
// los campos clínicos ya guardados (si los hay).
export const VerifyTR = async (numeroTicket, token, set, today, enfermedadesKeys, vacunasKeys) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe ingresar un N° de Ticket válido", "error");
        return;
    }

    LoadingDefault("Validando datos");

    const res = await getFetch(`${fichaPorTicketUrl}/${numeroTicket}`, token);

    Swal.close();

    const data = res?.resultado;

    if (!res || res.error || res.codigo !== 200 || !data) {
        Swal.fire("Error", "No se encontró el ticket ingresado", "error");
        return;
    }

    const personalesSet = new Set(data.personales ?? []);
    const vacunasSet = new Set(data.vacunas ?? []);
    const tieneRegistro = Boolean(data.id);

    set((prev) => ({
        ...prev,
        ...formFromPaciente(data.paciente),
        id: data.id ?? null,
        fecha: data.fecha ?? today,
        etapaVida: data.etapaVida ?? "",
        observaciones: data.observaciones ?? "",
        otrasPatologias: data.otrasPatologias ?? "",
        reaccionAdversaMedicamentosEspecificar: data.reaccionAdversaMedicamentosEspecificar ?? "",
        reaccionAdversaMedicamentos: Boolean(data.reaccionAdversaMedicamentosEspecificar),
        dosisVacunas: data.dosisVacunas ?? "",
        quirurgicos: data.quirurgicos ?? [],
        padre: data.familiares?.padre ?? "",
        madre: data.familiares?.madre ?? "",
        hermanos: data.familiares?.hermanos ?? "",
        hijos: data.familiares?.hijos ?? "",
        esposaConyuge: data.familiares?.esposaConyuge ?? "",
        carnetConadis: data.familiares?.carnetConadis ?? "",
        user_medicoFirma: data.user_medicoFirma || prev.user_medicoFirma,
        ...Object.fromEntries(enfermedadesKeys.map((key) => [key, personalesSet.has(key)])),
        ...Object.fromEntries(vacunasKeys.map((key) => [key, vacunasSet.has(key)])),
        // Control de edición (useRegistroEditable) + auditoría. tieneRegistro=true solo si
        // este ticket YA tiene antecedentes guardados (data.id); si no, el ticket existe pero
        // el registro es nuevo (queda editable). Claves de auditoría mapeadas defensivamente
        // (sin confirmar contra el backend real) siguiendo el mismo criterio que Triaje/
        // RegistroAsistencial de este módulo.
        tieneRegistro,
        userRegistro: data.userRegistro ?? data.usuarioRegistro ?? "",
        fechaRegistro: data.fechaRegistro ?? data.fechaCreacion ?? "",
        usuarioActualizacion: data.usuarioActualizacion ?? data.userActualizacion ?? "",
        fechaActualizacion: data.fechaActualizacion ?? data.fechaModificacion ?? "",
    }));

    if (tieneRegistro) {
        Swal.fire(
            "Alerta",
            "Este paciente ya cuenta con Antecedentes Patológicos registrados.",
            "warning"
        );
    }
};

// Registra o actualiza la ficha: POST /api/antecedentes?usuario=...
// Es un upsert -- si form.id viene informado (cargado desde VerifyTR) el backend actualiza
// el registro existente; si no, crea uno nuevo asociado al ticket (nticket).
export const SubmitDataService = async (
    form,
    token,
    userlogued,
    limpiar,
    tabla,
    datosFooter,
    enfermedadesKeys,
    vacunasKeys
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        id: form.id ?? null,
        fecha: form.fecha,
        etapaVida: form.etapaVida ?? "",
        observaciones: form.observaciones ?? "",
        personales: enfermedadesKeys.filter((key) => form[key]),
        otrasPatologias: form.otrasPatologias ?? "",
        reaccionAdversaMedicamentosEspecificar: form.reaccionAdversaMedicamentos
            ? form.reaccionAdversaMedicamentosEspecificar ?? ""
            : "",
        vacunas: vacunasKeys.filter((key) => form[key]),
        dosisVacunas: form.dosisVacunas ?? "",
        quirurgicos: form.quirurgicos,
        familiares: {
            padre: form.padre ?? "",
            madre: form.madre ?? "",
            hermanos: form.hermanos ?? "",
            hijos: form.hijos ?? "",
            esposaConyuge: form.esposaConyuge ?? "",
            carnetConadis: form.carnetConadis ?? "",
        },
        nticket: Number(form.norden),
        user_medicoFirma: form.user_medicoFirma,
    };

    LoadingDefault("Registrando Datos");

    const query = new URLSearchParams({ usuario: userlogued ?? "" });
    const res = await SubmitData(body, `${registrarUrl}?${query.toString()}`, token);

    Swal.close();

    const codigoOk = res?.codigo === 200 || res?.codigo === 201;
    if (!res || res.error || !codigoOk || !res.resultado) {
        Swal.fire("Error", res?.mensaje ?? "Ocurrió un error al registrar", "error");
        return;
    }

    Swal.fire("Éxito", "Antecedentes Patológicos registrados correctamente.", "success");
    limpiar();
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
