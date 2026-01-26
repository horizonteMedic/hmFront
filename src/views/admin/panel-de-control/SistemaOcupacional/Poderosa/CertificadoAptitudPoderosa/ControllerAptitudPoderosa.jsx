import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    handleSubirArchivoDefault,
    LoadingDefault,
    PrintHojaRDefault,
    ReadArchivosFormDefault,
    SubmitDataServiceDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { getHoraActual, getToday } from "../../../../../utils/helpers";

const obtenerReporteUrl =
    "/api/v01/ct/aptitudAltura/obtenerReporteAptitudAlturaPoderosa";
const registrarUrl =
    "/api/v01/ct/aptitudAltura/registrarActualizarAptitudAlturaPoderosa";
const registrarPDF =
    "/api/v01/ct/archivos/archivoInterconsulta"
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

            user_medicoFirma: res.usuarioFirma,
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
        onFinish,
        true
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
            apto: res.apto ? "APTO" : res.aptoRestriccion ? "APTOCONRESTRICCION" : res.aptoTemporal ? "NOAPTOTEMPORAL" : res.noApto ? "NOAPTO" : "",
            nombre_medico: res.nombreMedico,
            SubirDoc: true,
            digitalizacion: res.digitalizacion,
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
    const jasperModules = import.meta.glob("../../../../../jaspers/AptitupAlturaPoderosa/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/AptitupAlturaPoderosa"
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
                    "Este paciente ya cuenta con registros de C. de Aptitud Altura Poderosa",
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

export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
    const coordenadas = {
        HUELLA: { x: 400, y: 680, width: 60, height: 60 },
        FIRMA: { x: 466, y: 680, width: 120, height: 60 },
        SELLOFIRMA: { x: 40, y: 680, width: 120, height: 80 },
    };
    handleSubirArchivoDefault(form, selectedSede, registrarPDF, userlogued, token, coordenadas)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
    ReadArchivosFormDefault(form, setVisualerOpen, token)
}