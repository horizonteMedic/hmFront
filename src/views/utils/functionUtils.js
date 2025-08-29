import Swal from "sweetalert2";
import { getFetch, SubmitData } from "./apiHelpers";

export const LoadingDefault = (text) => {
    Swal.fire({
        title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
        html: `<div style=\"font-size:1.1em;\"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
        icon: "info",
        background: "#f0f6ff",
        color: "#22223b",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        customClass: {
            popup: "swal2-border-radius",
            title: "swal2-title-custom",
            htmlContainer: "swal2-html-custom",
        },
        showClass: {
            popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
            popup: "animate__animated animate__fadeOutUp",
        },
        didOpen: () => {
            Swal.showLoading();
        },
    });
};
export const GetInfoPacDefault = async (nro, token, sede) => {
    try {
        const res = await getFetch(
            `/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,
            token
        );

        console.log("pros", res);

        return res; // 🔹 ahora retorna la respuesta
    } catch (error) {
        console.error("Error obteniendo info del paciente:", error);
        Swal.fire(
            "Error",
            "Paciente no encontrado",
            "error"
        );
        throw error;
    } finally {
        Swal.close();
    }
};
export const PrintHojaRDefault = (nro, token, tabla, datosFooter, obtenerReporteUrl, jasperModules, nombreCarpeta) => {

    LoadingDefault("Cargando Formato a Imprimir");

    getFetch(
        `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`,
        token
    )
        .then(async (res) => {
            if (res.norden) {
                console.log(res);
                const nombre = res.nameJasper;
                console.log(nombre);
                const modulo = await jasperModules[
                    `${nombreCarpeta}/${nombre}.jsx`
                ]();
                // Ejecuta la función exportada por default con los datos
                if (typeof modulo.default === "function") {
                    modulo.default({ ...res, ...datosFooter });
                } else {
                    console.error(
                        `El archivo ${nombre}.jsx no exporta una función por defecto`
                    );
                }
            }
        })
        .finally(() => {
            Swal.close();
        });
};

export const getInfoTablaDefault = (nombreSearch, codigoSearch, setData, token, obtenerReporteInfoTablaUrl) => {
    try {
        getFetch(
            `${obtenerReporteInfoTablaUrl}?${codigoSearch == "" ? "" : `nOrden=${codigoSearch}`
            }
    ${nombreSearch == "" ? "" : `&nombres=${nombreSearch}`}`,
            token
        ).then((res) => {
            console.log("pros", res);
            setData(res);
        });
    } catch (error) {
        console.error("Error en al obtener los datos de la tabla:", error);
        Swal.fire(
            "Error",
            "Ocurrió un error al obtener los datos de la tabla",
            "error"
        );
    }
};

export const VerifyTRDefault = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }) => {
    if (!nro) {
        await Swal.fire(
            "Error",
            "Debe Introducir un Nro de Historia Clínica válido",
            "error"
        );
        return;
    }
    LoadingDefault("Validando datos");
    getFetch(
        `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
        token
    ).then((res) => {
        console.log(res);
        if (res.id === 0) {
            //No tiene registro previo 
            noTieneRegistro();//datos paciente
        } else {
            tieneRegistro();//obtener data servicio

        }
    });
};

export const GetInfoServicioDefault = async (
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish = () => { }
) => {
    try {
        const res = await getFetch(
            `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`,
            token
        );

        if (res?.norden) {
            console.log(res);
            return res;
        } else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
            return null;
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        console.error(error);
        return null;
    } finally {
        onFinish();
    }
};

export const SubmitDataServiceDefault = async (
    token,
    limpiar,
    body,
    registrarUrl,
    onFinish = () => { }
) => {
    LoadingDefault("Registrando Datos");
    SubmitData(body, registrarUrl, token).then((res) => {
        console.log(res);
        if (res.id === 1 || res.id === 0) {
            Swal.fire({
                title: "Exito",
                text: `${res.mensaje},\n¿Desea imprimir?`,
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            }).then((result) => {
                limpiar();
                if (result.isConfirmed) {
                    onFinish();
                }
            });
        } else {
            Swal.fire("Error", "Ocurrio un error al Registrar", "error");
        }
    });
};