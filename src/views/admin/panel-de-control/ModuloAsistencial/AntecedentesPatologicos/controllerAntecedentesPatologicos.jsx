import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

const fichaPorTicketUrl = "/api/antecedentes/ticket";
const registrarUrl = "/api/antecedentes";
const listaAntecedentesUrl = "/api/antecedentes/paciente";

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

// Arma los campos clínicos del formulario a partir de un antecedente previo del paciente
// (ver OpenModalAntecedentesPrevios). No toca datos del paciente/ticket actual (id, fecha,
// datos personales): solo "copia hacia adelante" lo clínico, igual que
// GetInfoServicioParaNuevoRegistro en SistemaOcupacional/AntecedentesPatologicos.
const formFromAntecedentePrevio = (registro, enfermedadesKeys, vacunasKeys) => {
    const personalesSet = new Set(registro?.personales ?? []);
    const vacunasSet = new Set(registro?.vacunas ?? []);
    return {
        etapaVida: registro?.etapaVida ?? "",
        observaciones: registro?.observaciones ?? "",
        otrasPatologias: registro?.otrasPatologias ?? "",
        reaccionAdversaMedicamentosEspecificar: registro?.reaccionAdversaMedicamentosEspecificar ?? "",
        reaccionAdversaMedicamentos: Boolean(registro?.reaccionAdversaMedicamentosEspecificar),
        dosisVacunas: registro?.dosisVacunas ?? "",
        // Quirúrgicos se copian sin id: al guardar se crean como filas nuevas del registro actual.
        quirurgicos: (registro?.quirurgicos ?? []).map((q) => ({ ...q, id: null })),
        padre: registro?.familiares?.padre ?? "",
        madre: registro?.familiares?.madre ?? "",
        hermanos: registro?.familiares?.hermanos ?? "",
        hijos: registro?.familiares?.hijos ?? "",
        esposaConyuge: registro?.familiares?.esposaConyuge ?? "",
        ...Object.fromEntries(enfermedadesKeys.map((key) => [key, personalesSet.has(key)])),
        ...Object.fromEntries(vacunasKeys.map((key) => [key, vacunasSet.has(key)])),
    };
};

// Modal con la lista de antecedentes previos del paciente: GET /api/antecedentes/paciente/{pacienteId}.
// Se abre cuando el ticket buscado todavía no tiene Antecedentes Patológicos propios, para que
// el usuario pueda completar el formulario actual con lo registrado en una visita anterior
// (misma lógica que OpenModalNorden en SistemaOcupacional/AntecedentesPatologicos).
const OpenModalAntecedentesPrevios = async (pacienteId, token, set, enfermedadesKeys, vacunasKeys) => {
    if (!pacienteId) return;

    const res = await getFetch(`${listaAntecedentesUrl}/${pacienteId}`, token);
    const registros = Array.isArray(res)
        ? res
        : Array.isArray(res?.resultado)
            ? res.resultado
            : [];

    if (registros.length === 0) return;

    const inputOptions = registros.reduce((acc, item, index) => {
        const key = String(item.id ?? index);
        const fechaLabel = formatearFechaCorta(item.fecha ?? "") || item.fecha || "Sin fecha";
        const ticketLabel = item.numeroTicket ?? item.nticket;
        acc[key] = ticketLabel ? `${fechaLabel} - Ticket N° ${ticketLabel}` : fechaLabel;
        return acc;
    }, {});

    const resultadoModal = await Swal.fire({
        title: "Antecedentes previos del paciente",
        html: `<p style="margin:0 0 4px;color:#64748b;font-size:12px;">Selecciona un registro anterior para completar el formulario actual.</p>`,
        input: "radio",
        inputOptions,
        inputValidator: (value) => {
            if (!value) return "Debes seleccionar una opción o cancelar.";
        },
        showCancelButton: true,
        confirmButtonText: "Usar seleccionado",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        customClass: {
            popup: "swal-dinamico swal-norden-popup",
        },
        didOpen: () => {
            const popup = Swal.getPopup();

            const applyLayout = () => {
                const title = popup.querySelector(".swal2-title");
                const htmlContainer = popup.querySelector(".swal2-html-container");
                const radioGroup = popup.querySelector(".swal2-radio");
                const actions = popup.querySelector(".swal2-actions");

                popup.style.maxWidth = "350px";
                popup.style.width = "80vw";
                popup.style.maxHeight = "80vh";
                popup.style.display = "flex";
                popup.style.flexDirection = "column";
                popup.style.overflow = "hidden";

                if (title) title.style.flex = "0 0 auto";
                if (htmlContainer) htmlContainer.style.flex = "0 0 auto";
                if (actions) actions.style.flex = "0 0 auto";
                if (radioGroup) {
                    radioGroup.style.flex = "1 1 auto";
                    radioGroup.style.minHeight = "0";
                }
            };

            applyLayout();
            window.addEventListener("resize", applyLayout);
            popup._nordenResizeHandler = applyLayout;

            let style = document.getElementById("swal-norden-styles");
            if (!style) {
                style = document.createElement("style");
                style.id = "swal-norden-styles";
                document.head.appendChild(style);
            }
            style.textContent = `
                .swal-norden-popup {
                    padding-bottom: 1em;
                }
                .swal-norden-popup .swal2-title {
                    margin: 0;
                    padding: .5rem .5rem .5rem;
                    font-size: 1.4em;
                }
                .swal-norden-popup .swal2-html-container {
                    margin: 0.3em 0.9em 0 ;
                }
                .swal-norden-popup .swal2-radio {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 6px;
                    width: auto;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 6px 6px 2px;
                    margin: 1em 1em 0 !important;
                    padding-top: 15px;
                }
                .swal-norden-popup .swal2-radio label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 0 !important;
                    padding: 8px 12px;
                    border: 1px solid #d7dde5;
                    border-radius: 8px;
                    background: #f8fafc;
                    cursor: pointer;
                    box-sizing: border-box;
                    transition: border-color .15s ease, background-color .15s ease;
                }
                .swal-norden-popup .swal2-radio label:hover {
                    border-color: #0d9488;
                    background: #f0fdfa;
                }
                .swal-norden-popup .swal2-radio label:has(input:checked) {
                    border-color: #0d9488;
                    background: #e6fbf8;
                    box-shadow: 0 0 0 1px #0d9488 inset;
                }
                .swal-norden-popup .swal2-radio input[type="radio"] {
                    width: 16px;
                    height: 16px;
                    margin: 0;
                    accent-color: #0d9488;
                    flex-shrink: 0;
                }
                .swal-norden-popup .swal2-radio .swal2-label {
                    margin: 0;
                    font-size: 11px;
                    color: #1f2937;
                    text-align: left;
                }
                .swal-norden-popup .swal2-radio::-webkit-scrollbar {
                    width: 6px;
                }
                .swal-norden-popup .swal2-radio::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
            `;
        },
        willClose: () => {
            const popup = Swal.getPopup();
            if (popup?._nordenResizeHandler) {
                window.removeEventListener("resize", popup._nordenResizeHandler);
            }
        }
    });

    const seleccion = resultadoModal.value;
    if (!seleccion) return;

    const registro = registros.find((item, index) => String(item.id ?? index) === seleccion);
    if (!registro) return;

    set((prev) => ({
        ...prev,
        ...formFromAntecedentePrevio(registro, enfermedadesKeys, vacunasKeys),
    }));
};

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
    const pacienteId = data.paciente?.id ?? data.pacienteId ?? null;

    set((prev) => ({
        ...prev,
        ...formFromPaciente(data.paciente),
        pacienteId,
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
    } else {
        // Ticket sin Antecedentes Patológicos propios: se ofrece copiar los datos
        // clínicos de una visita anterior del mismo paciente (si existen).
        await OpenModalAntecedentesPrevios(pacienteId, token, set, enfermedadesKeys, vacunasKeys);
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
