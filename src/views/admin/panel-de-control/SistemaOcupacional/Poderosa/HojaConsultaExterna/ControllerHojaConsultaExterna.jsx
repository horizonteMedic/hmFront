import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { getHoraActual, getToday } from "../../../../../utils/helpers";
import Hoja_Consulta_Externa from "../../../../../jaspers/HojaConsultaExterna/Hoja_Consulta_Externa";

const obtenerReporteUrl =
    "/api/v01/ct/hojaConsultaExterna/obtenerReporteHojaConsultaExterna";
const registrarUrl =
    "/api/v01/ct/hojaConsultaExterna/registrarActualizarHojaConsultaExterna";
const today = getToday();

export const GetInfoServicio = async (
    nro,
    set,
    token,
    sede
) => {
    const res = await GetInfoPacDefault(
        nro,
        token,
        sede
    );
    console.log(res)
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            dniPaciente: res.dni,
            edadPaciente: res.edad,
            nombreExamen: res.nomExam,
            empresa: res.empresa,
            contrata: res.contrata,
            cargoPaciente: res.cargo,
            ocupacionPaciente: res.areaO,
            fechaExamen: prev.fechaExamen

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
            nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            edadPaciente: `${res.edadPaciente} AÑOS`,
            dniUser: res.dniUsuario,
            cajon: res.paraiso ? "PARAISO" : res.postaVijus ? "POSTA VIJUS" : res.cedro ? "CEDRO" : res.otros ? "OTROS" : "",
            nombre_medico: res.nombreMedico
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
        "norden": form.norden,
        "dni": form.dniPaciente,
        "fechaExamen": form.fechaExamen,
        "horaSalida": getHoraActual(),
        "nombreMedico": form.nombre_medico,
        "postaVijus": form.cajon === "POSTA VIJUS" ? true : false,
        "cedro": form.cajon === "CEDRO" ? true : false,
        "paraiso": form.cajon === "PARAISO" ? true : false,
        "otros": form.cajon === "OTROS" ? true : false,
        "otrosDescripcion": form.otrosDescripcion,
        "observaciones": form.observaciones
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/HojaConsultaExterna/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/HojaConsultaExterna"
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
            GetInfoServicio(nro, set, token, sede);
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