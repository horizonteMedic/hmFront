import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";

const registrarUrl = "/api/v01/ct/empresaContrata/crearActualizar";
const obtenerReporteUrl = "/api/v01/ct/empresaContrata/obtenerDatos"
const obtenerListArchivosUrl = "/api/v01/ct/tipoArchivo/obtenerTiposDeArchivoPlantillaCorreo"
const obtenerPlantillaUrl = "/api/v01/ct/plantillaCorreo/obtenerPlantillaCorreoPorEmpresaContrata"
const registrarPlantillaUrl = "/api/v01/ct/plantillaCorreo/crearActualizar";

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
    if (form.empresaContrataList.some(a => a.rucEmpresa === form.rucEmpresa && (a.rucContrata ?? "") === form.rucContrata)) {
        await Swal.fire("Error", "Esta relación Empresa - Contrata ya existe", "error");
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

export const SubmitPlantillaCorreo = async (
    form,
    token,
    user,
    limpiar
) => {
    const esListaCorreosValida = (destino) => {
        if (!destino || destino.trim() === "") return false;

        return destino
            .split(",")
            .map(c => c.trim()) // 🔥 elimina espacios antes/después
            .filter(c => c !== "") // evita errores por comas extra
            .every(correo =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
            );
    };
    let mensajeError = ""

    if (!form.plantillaConfig || form.plantillaConfig.filter(a => !a.anulado).length == 0) mensajeError += "Debe ingresar almenos un correo\n";
    else if (!form.idRelacionEmpresaContrata) mensajeError += "Debe ingresar almenos un correo válido\n";
    else if (form.plantillaConfig.some(a => !esListaCorreosValida(a.destino))) mensajeError += "Debe ingresar correos destino válidos\n";
    else if (form.plantillaConfig.some(a => a.conCopia ? !esListaCorreosValida(a.conCopia) : false)) mensajeError += "Debe ingresar correos válidos en CC\n";
    else if (form.plantillaConfig.some(a => !a.asunto)) mensajeError += "Debe ingresar un asunto válido\n";
    if (mensajeError) {
        await Swal.fire("Error", mensajeError, "error");
        return;
    }

    const body = [
        ...form.plantillaConfig.map(a => ({
            id: a.id,
            idEmpresaContrata: form.idRelacionEmpresaContrata,
            destino: (a.destino ?? "").replace(/\s+/g, ""),
            conCopia: (a.conCopia ?? "").replace(/\s+/g, ""),
            asunto: a.asunto,
            mensaje: a.mensaje,
            usuarioRegistro: user,
            adicional: a?.adicional ?? false,
            anulado: a?.anulado ?? false,
            archivos: [
                ...a?.archivos.map(suba => ({
                    id: suba.idArchivoPlantilla ?? null,
                    idTipoArchivo: suba.idTipoArchivo,
                    idPlantillaCorreo: null,
                    usuarioRegistro: user,
                    anulado: suba.anulado ?? false,
                })),
            ]
        }))
    ];
    console.log(body)
    Loading("Registrando Datos");
    SubmitData(body, registrarPlantillaUrl, token).then((res) => {
        console.log(res)
        if (res.codigo == 201) {
            limpiar();
            Swal.fire({
                title: "Exito",
                text: `Se ha registrado con Éxito`,
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
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
        const res = await getFetch(`${obtenerReporteUrl}`, token);
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
            set(res?.resultado.filter(a => ![
                "EMOA",
                "EMOR",
                "EMPO",
                "TEST ALTURA",
                "PSICOSENSOMETRICO",
                "MANIPULADOR ALIMENTOS",
                "ANEXO 16A"].includes(a.nomenclatura)))
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