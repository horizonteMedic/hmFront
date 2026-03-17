import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";

const registrarUrl = "/api/v01/ct/empresaContrata/crearActualizar";
const obtenerReporteUrl = "/api/v01/ct/empresaContrata/obtenerDatos"
const obtenerListArchivosUrl = "/api/v01/ct/tipoArchivo/obtenerTiposDeArchivoPlantillaCorreo"
const obtenerPlantillaUrl = "/api/v01/ct/plantillaCorreo/obtenerPlantillaCorreoPorEmpresaContrata"

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
    Loading("Registrando Datos");
    SubmitData(body, registrarUrl, token).then((res) => {
        console.log(res)
        if (res.codigo == 201) {
            limpiar();
            Swal.fire({
                title: "Exito",
                text: `Se ha registrado con Éxito`,
                icon: "success",
                confirmButtonColor: "#3085d6",
            })
        } else {
            Swal.fire("Error", "Ocurrio un error al Registrar", "error");
        }
    });
};

export const GetListEmpresaContrata = async (
    set,
    token,
    onFinish = () => { }
) => {
    try {
        const res = await getFetch(
            `${obtenerReporteUrl}`,
            token
        );
        if (res?.resultado) {
            set(res?.resultado)
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
export const GetListArchivos = async (
    set,
    token,
    onFinish = () => { }
) => {
    try {
        const res = await getFetch(
            `${obtenerListArchivosUrl}`,
            token
        );
        if (res?.resultado) {
            set(res?.resultado)
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

export const getPlantillaPorEmpresaContrata = async (
    empresaContrataId,
    set,
    token,
    onFinish = () => { }
) => {
    try {
        Loading("Cargando Datos");
        const res = await getFetch(
            `${obtenerPlantillaUrl}/${empresaContrataId}`,
            token
        );

        console.log("Respuesta API:", res);

        if (res?.estatus === "OK") {
            console.log(res.resultado);
            set((prev) => ({
                ...prev,
                plantillaConfig: res.resultado
            }));
            Swal.close();
        }
        else if (res?.status === 404) {
            Swal.fire("Sin registros", "No tiene registros de plantilla", "info");
        }
        else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
        }

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
    } finally {
        onFinish?.();
    }
};


export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};