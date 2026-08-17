import { getFetch, SubmitData } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const SubmitURLVisita = "/api/visitas"

export const getInfoTabla = (setData, token) => {
    getFetch(`/api/reportes/visitas`, token)
        .then(setData);
};

export const getEspecialidades = (setData, token) => {
    getFetch(`/api/especialidades`, token)
        .then(setData);
};

export const SubmitRegistro = async (form, token, userlogued, limpiar) => {
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
            }
        })
}