import Swal from "sweetalert2";
import { SubmitDataServiceDefault } from "../../../../utils/functionUtils";
import { URLAzure } from '../../../../config/config';

const registrarUrl = "/api/v01/ct/empresaContrata/crearActualizar";
const obtenerReporteUrl = "/api/v01/ct/empresaContrata/obtenerDatos"

export const SubmitEmpresaContrata = async (
    form,
    token,
    user,
    limpiar
) => {
    if (!form.rucEmpresa) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        id: form.idRelacionEmpresaContrata,
        rucEmpresa: form.rucEmpresa,
        rucContrata: form.rucContrata,
        userRegistro: user,
    };
    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => { });
};

export const GetListEmpresaContrata = async (token) => {
    const response = await fetch(`${URLAzure}${obtenerReporteUrl}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    console.log("Respuesta:", data);
    return data;
};