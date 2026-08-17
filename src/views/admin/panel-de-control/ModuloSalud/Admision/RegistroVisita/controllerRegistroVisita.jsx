import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const SubmitURLVisita = "/api/visitas"
const SearchURLDNI = "/api/pacientes/buscar-por-dni"
const SearchURLName = "/api/pacientes/buscar-por-nombre-apellido"

export const getInfoTabla = (setData, token) => {
    getFetch(`/api/reportes/visitas`, token)
        .then(setData);
};

export const getEspecialidades = (setData, token) => {
    getFetch(`/api/especialidades`, token)
        .then(setData);
};

export const SubmitRegistro = async (form, token, userlogued, limpiar, setRefresh) => {
    LoadingDefault("Registrando...")
    const body = {
        pacienteId: form.pacienteId,
        especialidadIds: (form.Seleccionespecialidades ?? []).map((e) => e.id),
        usuarioRegistro: userlogued
    };
    SubmitData(body, SubmitURLVisita, token)
        .then((res) => {
            if (res.norden) {
                Swal.fire("Exito", "Visita Creado correctamente", "success")
                limpiar()
                setRefresh()
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