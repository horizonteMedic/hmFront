import Swal from "sweetalert2";
import { SubmitDataServiceDefault } from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";

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

export const GetListEmpresaContrata = async (
    set,
    token
) => {
    try {
        const res = await getFetch(
            `${obtenerReporteUrl}`,
            token,true
        );
        if (res) {
            console.log(res)
        } else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
            return null;
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        return null;
    } finally {
        onFinish?.();
    }

};
