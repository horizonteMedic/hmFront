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

const obtenerReporteUrl =
    "/api/v01/ct/aptitudLicenciaConducir/obtenerReporteAptitudLicenciaConducir";
const registrarUrl =
    "/api/v01/ct/aptitudLicenciaConducir/registrarActualizarAptitudLicenciaConducir";
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
            fechaExamen: prev.fechaExamen,

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
            edadPaciente: res.edadPaciente,
            dniUser: res.dniUsuario,
            nombre_medico: res.nombreMedico,
            apto: res.apto ? "APTO" : res.aptoRestriccion ? "APTOCONRESTRICCION" : res.aptoTemporal ? "NOAPTOTEMPORAL" : res.noApto ? "NOAPTO" : "",

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
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
        "fechaHasta": form.fechaHasta,
        "nombreMedico": form.nombre_medico,
        "apto": form.apto === "APTO" ? true : false,
        "aptoRestriccion": form.apto === "APTOCONRESTRICCION" ? true : false,
        "noAptoTemporal": form.apto === "NOAPTOTEMPORAL" ? true : false,
        "noApto": form.apto === "NOAPTO" ? true : false,
        "observaciones": form.observaciones,
        "horaSalida": getHoraActual(),
        "usuarioRegistro": form.userlogued,

        usuarioFirma: form.user_medicoFirma,
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
    const jasperModules = import.meta.glob("../../../../../jaspers/AptitudLicenciaInterna/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/AptitudLicenciaInterna"
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
                    "Este paciente ya cuenta con registros de Aptitud Licencia Interna",
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