import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const SubmitURLVisita = "/api/visitas"
const SearchURLDNI = "/api/pacientes/buscar-por-dni"
const SearchURLName = "/api/pacientes/buscar-por-nombre-apellido"
const BuscarVisitasURL = "/api/visitas/buscar"

export const getInfoTabla = (setData, token) => {
    getFetch(`/api/reportes/visitas`, token)
        .then(setData);
};

export const getEspecialidades = (setData, token) => {
    getFetch(`/api/especialidades`, token)
        .then(setData);
};

export const SubmitRegistro = async (form, token, userlogued, limpiar, setRefresh, onSuccess) => {
    LoadingDefault("Registrando...")
    const body = {
        pacienteId: form.pacienteId,
        especialidadIds: (form.Seleccionespecialidades ?? []).map((e) => e.id),
        usuarioRegistro: userlogued
    };
    SubmitData(body, SubmitURLVisita, token)
        .then(async (res) => {
            // SubmitData devuelve el Response object cuando hay error HTTP
            if (res && typeof res.json === "function") {
                const error = await res.json();
                Swal.close();
                Swal.fire("Error", error.mensaje ?? "No se pudo registrar la visita", "error");
                return;
            }
            if (res.norden) {
                limpiar();
                setRefresh();
                Swal.fire("Éxito", "Visita creada correctamente", "success")
                    .then(() => onSuccess?.(res));
            }
        })
}

export const SearchPaciente = async (form, token, handleLimpiar, set, tipoBusqueda) => {
    LoadingDefault("Buscando...")
    const url = tipoBusqueda === "DNI"
        ? `${SearchURLDNI}?dni=${form.dni}`
        : `${SearchURLName}?texto=${form.nombres}`;

    const res = await getFetch(url, token);

    console.log(res);

    const paciente = res[0];

    set((prev) => ({
        ...prev,
        dni: paciente.numeroDocumento,
        nombres: `${paciente.nombres} ${paciente.apellidos}`,
        pacienteId: paciente.id
    }));

    Swal.close();

}

export const BuscarPacientePorDniONombre = async (params, token) => {
    const url = params.dni
        ? `${SearchURLDNI}?dni=${params.dni}`
        : `${SearchURLName}?texto=${params.nombres}`;

    const res = await getFetch(url, token);

    if (!Array.isArray(res) || res.length === 0) return null;
    return res[0];
}

export const getVisitaById = (visitaId, token) =>
    getFetch(`/api/visitas/${visitaId}`, token);

export const BuscarVisitasPrevias = async (params, token) => {
    const query = new URLSearchParams();
    if (params.dni) query.set("dni", params.dni);
    if (params.nombres) query.set("nombres", params.nombres);
    if (params.apellidos) query.set("apellidos", params.apellidos);

    const res = await getFetch(`${BuscarVisitasURL}?${query.toString()}`, token);
    return Array.isArray(res) ? res : [];
}