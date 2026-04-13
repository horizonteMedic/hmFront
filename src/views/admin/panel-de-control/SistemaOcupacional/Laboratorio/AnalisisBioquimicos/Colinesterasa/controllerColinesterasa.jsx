import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

import { getFetch } from "../../../../../../utils/apiHelpers";

// CAMBIAR SOLO LAS URL
const obtenerReporteUrl = "/api/v01/ct/colinesterasa/reporte";
const obtenerReporteJsReportUrl = "/api/v01/ct/colinesterasa/descargar";
const registrarUrl = "/api/v01/ct/colinesterasa/registrar";

// ===================== GET INFO SERVICIO =====================
export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res?.resultado) {
        const rese = res.resultado
        set((prev) => ({
            ...prev,

            // DATOS PRINCIPALES
            norden: rese.norden ?? "",
            fecha: rese.fechaExamen ?? "",

            nombres: rese.nombres ?? "",
            apellidos: rese.apellidos ?? "",
            dni: rese.dniPaciente ?? "",
            edad: rese.edad ?? "",

            fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
            sexo: rese.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",

            estadoCivil: rese.estadoCivilPaciente ?? "",
            nivelEstudios: rese.nivelEstudioPaciente ?? "",

            ocupacion: rese.ocupacionPaciente ?? "",
            cargoDesempenar: rese.cargoPaciente ?? "",
            area: rese.areaPaciente ?? "",

            empresa: rese.empresa ?? "",
            contrata: rese.contrata ?? "",

            // EXAMEN
            resultado: rese.resultado ? parseFloat(rese.resultado).toFixed(2) : "",
            tipoExamen: rese.tipoExamen ?? "",

            // USUARIOS
            user_medicoFirma: rese.usuarioFirma ?? "",
            user_doctorAsignado: rese.doctorAsignado ?? "",

        }));
    }
};

// ===================== SUBMIT =====================
export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        norden: form.norden,
        fechaRegistro: form.fecha,
        muestra: form.muestra,
        resultado: form.resultado,
        userRegistro: user,

        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

// ===================== PRINT =====================
export const PrintHojaR = (nro, token, tabla) => {
    Loading('Cargando Formato a Imprimir')
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            if (res?.resultado?.norden) {
                const nombre = "COLINESTERASA";
                console.log(nombre)
                const jasperModules = import.meta.glob('../../../../../../jaspers/AnalisisBioquimicos/*.jsx');
                const modulo = await jasperModules[`../../../../../../jaspers/AnalisisBioquimicos/${nombre}.jsx`]();
                // Ejecuta la función exportada por default con los datos
                if (typeof modulo.default === 'function') {
                    modulo.default(res.resultado);
                } else {
                    console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
                }
                Swal.close()
            } else {
                Swal.close()
            }
        })
}

// ===================== VERIFY (CORREGIDO PARA PCR ULTRASENSIBLE) =====================
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
                    "Este paciente ya cuenta con registros de Colinesterasa",
                    "warning"
                );
            });
        }
    );
};

// ===================== GET INFO PAC =====================
const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);

    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            tipoExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        }));
    }
};

// ===================== LOADING =====================
export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};