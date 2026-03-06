import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
    PrintHojaRJsReportDefault
} from "../../../../../utils/functionUtils";

import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoAptitudBrigadista/obtenerReporte";
const registrarUrl =
    "/api/v01/ct/certificadoAptitudBrigadista/registrarActualizar";
const obtenerReporteJsReportUrl =
    "/api/v01/ct/certificadoAptitudBrigadista/descargarReporte";

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
            norden: res.norden ?? "",
            fechaExam: prev.fechaExam ?? "",
            // Datos personales
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            estadoCivil: res.estadoCivil ?? "",
            nivelEstudios: res.nivelEstudios ?? "",
            dni: res.dni ?? "",
            edad: res.edad ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            // Campos usados por la interfaz principal
            cargoDesempenar: res.cargo ?? "",
            ocupacion: res.areaO ?? "",
            user_medicoFirma: res.user_medicoFirma,
            digitalizacion: res.digitalizacion && res.digitalizacion.length > 0 
                ? res.digitalizacion 
                : prev.digitalizacion // Mantiene la del médico logueado si existe
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
        set((prev) => ({
            ...prev,
            // Header
            norden: res.norden ?? "",
            fechaExam: res.fechaExamen ?? "",
            tipoExamen: res.nombreExamen ?? "",
            // Datos personales
            nombres: res.nombreCompletoPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            estadoCivil: res.estadoCivilPaciente ?? "",
            nivelEstudios: res.nivelEstudioPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            // Campos usados por la interfaz principal
            cargoDesempenar: res.cargoPaciente ?? "",
            ocupacion: res.ocupacionPaciente ?? "",

            // observacion
            aptitud: res.apto === true ? "APTO" : res.noApto === true ? "NOAPTO" : "",
            conclusiones: res.conclusiones ?? "",
            restricciones: res.restricciones ?? "",
            recomendaciones: res.recomendaciones ?? "",
            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
            // CORRECCIÓN: Guardamos la firma recibida en el estado
            digitalizacion: res.digitalizacion ?? [], 
            user_doctorAsignado: res.doctorAsignado,
        }));
    }
};

export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos: El N° de Orden es obligatorio.", "error");
        return;
    }

    const body = {
        "norden": form.norden,
        "fechaExamen": form.fechaExam,
        "conclusiones": form.conclusiones,
        "apto": form.aptitud === "APTO",
        "noApto": form.aptitud === "NOAPTO",
        "restricciones": form.restricciones,
        "recomendaciones": form.recomendaciones,
        // CORRECCIÓN: Usamos el parámetro 'user' que es el 'userlogued' del componente
        "userRegistor": user, 
        "usuarioFirma": form.user_medicoFirma,
        "doctorAsignado": form.user_doctorAsignado,
        // CORRECCIÓN: Enviamos la digitalización que está en el formulario
        "digitalizacion": form.digitalizacion || [] 
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

export const GetInfoServicioTabla = (nro, set, token, sede) => {
    GetInfoServicio(nro, set, token, sede);
    Swal.close();
};

export const PrintHojaR = (nro, token, tabla) => {
    PrintHojaRJsReportDefault(
        nro,
        token,
        tabla,
        obtenerReporteJsReportUrl
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
            GetInfoServicio(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de C. de Aptitud Brigadista",
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

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};