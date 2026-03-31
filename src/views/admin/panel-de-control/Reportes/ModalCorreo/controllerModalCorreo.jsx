import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getToday } from "../../../../utils/helpers";

const obtenerListArchivosUrl = "/api/v01/ct/tipoArchivo/obtenerTiposDeArchivoPlantillaCorreo"
const obtenerListArchivosDisponiblesUrl = "/api/v01/ct/archivos/detalleArchivoServidor"
const obtenerCorreosGuardados = "/api/v01/st/email/buscarPorNordenYEstado"
const obtenerPlantillaPorNordenUrl = "/api/v01/ct/plantillaCorreo/obtenerPlantillaCorreoDatosNorden"
const registrarCorreoUrl = "/api/v01/st/email/registrarActualizarCorreo"
const autorizarCorreoUrl = "/api/v01/st/email/enviarCorreos"

const nombresExamen = {
    ANUAL: "EMOA",
    REUBICACION: "EMPO",
    RETIRO: "EMOR",
    "PRE-OCUPACIONAL": "EMPO",
    "TEST-ALTURA": "TEST ALTURA",
    "PSICOSENSOMETRIA": "PSICOSENSOMETRICO",
    "MANIPULADOR-ALIMENTOS": "MANIPULADOR ALIMENTOS",
    "ANEXO 16A": "ANEXO 16A"
}

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
            Swal.fire("Error", "Ocurrió un error al traer la lista de archivos", "error");
            return null;
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer la lista de archivos", "error");
        return null;
    } finally {
        onFinish?.();
    }
};

export const GetListArchivosDisponibles = async (
    nordenConSede,
    set,
    token,
    onFinish = () => { }
) => {
    try {
        const res = await getFetch(
            `${obtenerListArchivosDisponiblesUrl}/${nordenConSede}`,
            token
        );
        if (res?.resultado) {
            set(res.resultado);
        } else if (res?.status === 404) {
            set([]);
        } else {
            Swal.fire("Error", "Ocurrió un error al traer la lista de archivos disponibles", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer la lista de archivos disponibles", "error");
        set([]);
    } finally {
        onFinish?.();
    }
};

export const GetCorreosGuardados = async (
    norden,
    estado,
    token,
    onFinish = () => { }
) => {
    try {
        const res = await getFetch(
            `${obtenerCorreosGuardados}/${norden}/${estado}`,
            token
        );

        if (res?.resultado) {
            return res.resultado;
        } else if (res?.status === 404) {
            return [];
        }
        else {
            Swal.fire("Error", "Ocurrió un error al traer los datos de correo", "error");

        }
    } catch (error) {
        Swal.fire("Error", "Ocurrió un error fatal al traer los datos de correo", "error");
        return [];
    } finally {
        onFinish?.();
    }
};

const reemplazarTextoCorreo = (texto, palabrasReemplazo) => {
    let resultado = texto;
    for (const [clave, valor] of Object.entries(palabrasReemplazo)) {
        const regex = new RegExp(`{${clave}}`, "g");
        resultado = resultado.replace(regex, valor);
    }
    return resultado;
}
const listarArchivos = (archivos) => {
    const nombres = archivos.map(item => item.nombreTipoArchivo);
    let resultado = "";
    if (nombres.length === 1) {
        resultado = nombres[0];
    } else if (nombres.length === 2) {
        resultado = nombres.join(" y ");
    } else if (nombres.length > 2) {
        resultado =
            nombres.slice(0, -1).join(", ") +
            " y " +
            nombres[nombres.length - 1];
    }
    return resultado;
}

export const GetPlantillaPorNorden = async (
    norden,
    set,
    onClose,
    token,
    archivosList,
    userName,
    onFinish = () => { }
) => {
    try {
        Loading("Cargando Datos");
        const res = await getFetch(
            `${obtenerPlantillaPorNordenUrl}/${norden}`,
            token
        );

        console.log("Respuesta API:", res);

        if (res?.estatus === "OK") {
            console.log(res.resultado);
            set(prev => {
                const resu = res.resultado;
                return ({
                    ...prev,
                    idRelacionEmpresaContrata: resu.plantillaCorreo[0]?.idEmpresaContrata,
                    nombresPaciente: resu.nombresPaciente ?? "",
                    apellidosPaciente: resu.apellidosPaciente ?? "",
                    rucEmpresa: resu.rucEmpresa ?? "",
                    empresa: resu.empresa ?? "",
                    rucContrata: resu.rucContrata ?? "",
                    contrata: resu.contrata ?? "",
                    fechaApartura: resu.fechaApartura ?? "",
                    plantillaConfig: resu.plantillaCorreo.map(a => {

                        const archivoCorrespondiente = archivosList.find(item => item.nomenclatura === nombresExamen[resu.tipoExamen] ?? "");
                        console.log({ archivosList: archivosList })
                        const newArchivos = [
                            ...a.archivos,
                            ...(a.adicional && archivoCorrespondiente ? [archivoCorrespondiente] : [])
                        ];

                        const palabrasReemplazo = {
                            empresa: resu.empresa ?? "",
                            contrata: resu.contrata ?? "",
                            nombrePaciente: `${(resu.nombresPaciente ?? "").trim()} ${(resu.apellidosPaciente ?? "").trim()}`,
                            tipoExamen: resu.tipoExamen ?? "",
                            nombreExamen: nombresExamen[resu.tipoExamen] ?? "",
                            fechaExamen: formatearFechaCorta(resu.fechaApertura),
                            fechaCorreo: formatearFechaCorta(getToday()),
                            listaAdjuntos: listarArchivos(newArchivos) ?? "",
                            nombreUsuario: userName ?? "",
                        }
                        // console.log({ palabrasReemplazo })

                        return ({
                            ...a,
                            archivos: newArchivos,
                            asunto: reemplazarTextoCorreo(a.asunto ?? "", palabrasReemplazo),
                            mensaje: reemplazarTextoCorreo(a.mensaje ?? "", palabrasReemplazo),
                        })
                    })
                })
            })
            Swal.close();
        }
        else if (res?.status === 404) {
            Swal.fire("Sin registros", "No tiene registros de plantilla, requiere configurar una plantilla para esa empresa y contrata para enviar el correo", "info");
            onClose();
        }
        else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
            onClose();
        }

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
        onClose();
    } finally {
        onFinish?.();
    }
};

export const SubmitCorreo = async (
    form,
    token,
    user,
    isEdit,
    onFinish
) => {
    const esListaCorreosValida = (destino) => {
        if (!destino || destino.trim() === "") return false;

        return destino
            .split(";")
            .map(c => c.trim())
            .filter(c => c.length > 0)
            .every(correo =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
            );
    };
    let mensajeError = ""

    if (!isEdit && (!form.plantillaConfig || form.plantillaConfig.filter(a => !a.anulado).length == 0)) mensajeError += "Debe ingresar almenos un correo\n";
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
            id: isEdit ? a.id : null,
            norden: form.norden,
            idEmpresaContrata: a.idEmpresaContrata,
            destino: (a.destino ?? "").replace(/\s+/g, ""),
            conCopia: (a.conCopia ?? "").replace(/\s+/g, ""),
            asunto: a.asunto,
            mensaje: a.mensaje,
            usuarioRegistro: user,
            anulado: a.anulado || false,
            archivos: [
                ...a?.archivos.map(suba => suba.idTipoArchivo),
            ]
        }))
    ];
    console.log(body)
    Loading("Registrando Datos");
    SubmitData(body, registrarCorreoUrl, token).then((res) => {
        console.log(res)
        if (res.codigo == 202) {
            Swal.fire({
                title: "Exito",
                text: `Se ha registrado con Éxito`,
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
            onFinish();
        } else {
            Swal.fire("Error", "Ocurrio un error al Registrar", "error");
        }
    });
};

export const AutorizarEnvioCorreo = async (
    nordenYSede,
    token,
    onFinish
) => {
    const body = {};
    Loading("Enviando Correos");
    SubmitData(body, `${autorizarCorreoUrl}/${nordenYSede}`, token).then((res) => {
        console.log(res)
        if (res.codigo == 202) {
            Swal.fire({
                title: "Exito",
                text: `Los correos se han autorizado para ser enviados con Éxito`,
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
            onFinish();
        } else {
            Swal.fire("Error", "Ocurrio un error al autorizar los correos", "error");
        }
    });
};


export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};