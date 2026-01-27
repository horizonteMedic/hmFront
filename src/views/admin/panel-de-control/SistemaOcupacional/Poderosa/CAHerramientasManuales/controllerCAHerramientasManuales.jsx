import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoAptitudHerramientasManuales/obtenerReporteCertificadoAptitudHerramientasManuales";
const registrarUrl =
    "/api/v01/ct/certificadoAptitudHerramientasManuales/registrarActualizarCertificadoAptitudHerramientasManuales";

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
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden,
            idCertificado: res.idCertificado,
            fechaExam: res.fechaCertificado,
            fechahasta: res.fechaCaducidad,
            nombreExamen: res.nombreExamen ?? "",
            aptitud: res.apto ? "APTO" :
                res.aptoRestriccion ? "APTO CON RESTRICCION" :
                    res.aptoTemporal ? "APTO TEMPORAL" : "NO APTO",

            // Datos personales
            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            dni: res.dniPaciente ?? "",
            edad: `${res.edadPaciente ?? ""} AÑOS`,
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            explotacion: res.explotacion ?? "",
            cargo: res.cargoPaciente ?? "",
            areaTrabajo: res.areaPaciente ?? "",

            // observacion
            observacion: res.observacion ?? "",

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
    if (!form.aptitud || form.aptitud == "") {
        await Swal.fire("Error", "Por favor, seleccione la aptitud.", "error");
        return;
    }
    const body = {
        norden: form.norden,
        idCertificado: form.idCertificado,
        apto: form.aptitud == "APTO",
        aptoRestriccion: form.aptitud == "APTO CON RESTRICCION",
        aptoTemporal: form.aptitud == "APTO TEMPORAL",
        observacion: form.observacion,
        fechaCertificado: form.fechaExam,
        fechaCaducidad: form.fechahasta,
        usuarioRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };
    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/Poderosa"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Certificado de Aptitud para Herramientas Manuales.",
                    "warning"
                );
            });
        }
    );
};

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombres,
            dni: res.dni,
            edad: res.edad + " AÑOS",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa,
            contrata: res.contrata,
            cargo: res.cargo ?? "",
            areaTrabajo: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};