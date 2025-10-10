import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";
import { getToday } from "../../../../utils/helpers";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoAptitudMedicoOcupacional/obtenerReporteCertificadoMedicoOcupacional";
const registrarUrl =
    "/api/v01/ct/certificadoAptitudMedicoOcupacional/registrarActualizarCertificadoAptitudMedicoOcupacional";
const today = getToday();
export const GetInfoServicio = async (
    nro,
    especialidad,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoNoRegisterInterconsulta(
        nro,
        especialidad,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    console.log(res)
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            ...res,
            nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            PA: `${res.sistolica}/${res.diastolica}`,
            edadPaciente: `${res.edadPaciente} AÑOS`,
            fechaExamen: `${res.fechaExamen ? res.fechaExamen : today}`,
            apto: res.apto ? res.apto : false
        }));
    }
};

export const GetInfoServicioEditar = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            ...res,
            // Header
            nombres: `${res.nombrePaciente} ${res.apellidoPaciente}`,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            PA: `${res.sistolica}/${res.diastolica}`,
            edadPaciente: `${res.edadPaciente} AÑOS`,
            dniUser: res.dniUsuario
            
        }));
    }
};


export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        "codigoFichaInterconsulta": form.codigoFichaInterconsulta ? form.codigoFichaInterconsulta : null,
        "norden": form.norden,
        "fechaExamen": form.fechaExamen,
        "edadPaciente": form.edadPaciente,
        "dniUsuario": form.dniUser,
        "especialidad": form.especialidad,
        "motivo": form.motivo,
        "hallazgo": form.hallazgo,
        "diagnostico": form.diagnostico,
        "tratamiento": form.tratamiento,
        "apto": form.apto ? true : false,
        "noApto": form.apto ? false : true
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, form.especialidad, token, tabla, datosFooter);
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

export const PrintHojaR = (nro, especialidad, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../jaspers/FichaInterconsulta/*.jsx");
    PrintHojaRFichaInterconsulta(
        nro,
        especialidad,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/FichaInterconsulta"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRPerzonalizado(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de C. Medico Ocupacional",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Triaje.",
                "warning"
            );
        }
    );
};

export const VerifyTRPerzonalizado = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }, necesitaExamen = () => { }) => {
    if (!nro) {
        await Swal.fire(
            "Error",
            "Debe Introducir un Nro de Historia Clínica válido",
            "error"
        );
        return;
    }
    Loading("Validando datos");
    getFetch(
        `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
        token
    ).then((res) => {
        console.log(res)
        if (res.id === 0) {
            //No tiene registro previo 
            noTieneRegistro();//datos paciente
        } else if (res.id === 2) {
            necesitaExamen();
        } else {
            tieneRegistro();//obtener data servicio
        }
    });
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

export const GetInfoServicioInterconsulta = async (
    nro,
    especialidad,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish = () => { }
) => {
    try {
        console.log('llegue a consultar causam',especialidad)
        const res = await getFetch(
            `${obtenerReporteUrl}?nOrden=${nro}&especialidad=${especialidad}&nameService=${tabla}&esJasper=false`,
            token
        );
        if (res?.norden || res?.norden_n_orden||res?.n_orden) {
            return res;
        } else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
            return null;
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        return null;
    } finally {
        onFinish();
    }
};

export const GetInfoNoRegisterInterconsulta = async (
    nro,
    especialidad,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish = () => { }
) => {
    try {
        const res = await getFetch(
            `${obtenerReporteUrl}?nOrden=${nro}&especialidad=${especialidad}&nameService=${tabla}&esJasper=false`,
            token
        );
        if (res?.norden || res?.norden_n_orden||res?.n_orden) {
            return res;
        } else {
            Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
            return null;
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
        return null;
    } finally {
        onFinish();
    }
};

export const PrintHojaRFichaInterconsulta = (nro, especialidad, token, tabla, datosFooter, obtenerReporteUrl, jasperModules, nombreCarpeta) => {

    LoadingDefault("Cargando Formato a Imprimir");

    getFetch(
        `${obtenerReporteUrl}?nOrden=${nro}&especialidad=${especialidad}&nameService=${tabla}&esJasper=true`,
        token
    )
        .then(async (res) => {
            console.log(res)
            if (res.norden || res.norden_n_orden|| res.n_orden) {
                const nombre = res.nameJasper;
                console.log(nombre)
                const modulo = await jasperModules[
                    `${nombreCarpeta}/${nombre}.jsx`
                ]();
                // Ejecuta la función exportada por default con los datos
                if (typeof modulo.default === "function") {
                    modulo.default({ ...res, ...datosFooter });
                }
            }
        })
        .finally(() => {
            Swal.close();
        });
};