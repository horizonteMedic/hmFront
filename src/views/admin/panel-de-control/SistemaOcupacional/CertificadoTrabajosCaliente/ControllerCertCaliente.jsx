import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";
import { getHoraActual, getToday } from "../../../../utils/helpers";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoAptitudMedicoOcupacional/obtenerReporteCertificadoMedicoOcupacional";
const registrarUrl =
    "/api/v01/ct/certificadoAptitudMedicoOcupacional/registrarActualizarCertificadoAptitudMedicoOcupacional";
const today = getToday();

export const GetInfoServicio = async (
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
    console.log(res)
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            ...res,
            nombres: `${res.nombrePaciente} ${res.apellidoPaciente}`,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            dniPaciente: res.dniPaciente,
            edadPaciente: res.edadPaciente,
            nombreExamen: res.nombreExamen,
            empresa: res.empresa,
            contrata: res.contrata,
            cargoPaciente: res.cargoPaciente,
            ocupacionPaciente: res.ocupacionPaciente,
            apto: "APTO",
            fechaExamen: `${res.fechaExamen ? res.fechaExamen : today}`,
            fechaDesde: `${res.fechaDesde ? res.fechaDesde : today}`,
            fechahasta: `${res.fechahasta ? res.fechahasta : today}`,
            nombreMedico: res.nombreMedico ? res.nombreMedico : prev.nombreMedico

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
            dniUser: res.dniUsuario,
            apto: res.apto ? "APTO" : res.aptoconrestriccion ? "APTOCONRESTRICCION" : "NOAPTO"
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
        "dniPaciente": form.dniPaciente,
        "fecha": form.fechaDesde,
        "nombreMedico": form.nombreMedico,
        "apto": form.apto === "APTO" ? true : false,
        "aptoConRestriccion": form.apto === "APTOCONRESTRICCION" ? true : false,
        "noApto": form.apto === "NOAPTO" ? true : false,
        "horaSalida": getHoraActual(),
        "fechaHasta": form.fechahasta,
        "conclusiones": form.conclusiones,
        "usuarioRegistro": user
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
    const jasperModules = import.meta.glob("../../../../jaspers/CertificadoMedicoOcupacional/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/CertificadoMedicoOcupacional"
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