import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { convertirGenero } from "../../../../../utils/helpers";

const obtenerReporteUrl = "/api/v01/ct/certificadoAptitudCuadrador/obtenerReporte";
const registrarUrl = "/api/v01/ct/certificadoAptitudCuadrador/registrarActualizar";

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
    if (res) {
        set((prev) => ({
            ...prev,
            nombres: res.nombresApellidos,
            sexo: convertirGenero(res.genero ?? ""),
            dniPaciente: res.dni,
            edadPaciente: res.edad,
            nombreExamen: res.nomExam,
            empresa: res.empresa,
            contrata: res.contrata,
            cargoPaciente: res.cargo,
            ocupacionPaciente: res.areaO,
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
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            nombreExamen: res.tipoExamen ?? "",
            nombres: `${res.nombres} ${res.apellidos}`,
            dniPaciente: res.dniPaciente ?? "",
            edadPaciente: res.edad ?? "",
            sexo: convertirGenero(res.sexoPaciente ?? ""),
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            cargoPaciente: res.cargoPaciente ?? "",
            ocupacionPaciente: res.ocupacionPaciente ?? "",
            fechaExamen: res.fechaExamen ?? "",
            fechaHasta: res.fechaCaducidad ?? "",
            observaciones: res.observacion ?? "",

            apto: res.apto ? "APTO" :
                res.noApto ? "NO_APTO" :
                    res.aptoTemporal ? "APTO_TEMPORAL" :
                        res.aptoConRestriccion ? "APTO_CON_RESTRICCION" : "",

            // Médico que Certifica 
            user_medicoFirma: res.usuarioFirma ?? "",
            user_doctorAsignado: res.doctorAsignado ?? "",
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
        norden: form.norden,
        fechaExamen: form.fechaExamen,
        fechaCaducidad: form.fechaHasta,

        apto: form.apto === "APTO",
        aptoConRestriccion: form.apto === "APTO_CON_RESTRICCION",
        aptoTemporal: form.apto === "APTO_TEMPORAL",
        noApto: form.apto === "NO_APTO",


        userRegistro: user,
        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,

        observacion: form.observaciones,
        userRegistro: form.userlogued,
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
                    "Este paciente ya cuenta con registros de Cuadrador Vigia",
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