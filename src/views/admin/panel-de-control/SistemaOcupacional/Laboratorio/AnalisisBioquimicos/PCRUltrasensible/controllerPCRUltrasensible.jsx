import Swal from "sweetalert2"; 
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRJsReportDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

// CAMBIAR SOLO LAS URL
const obtenerReporteUrl = "/api/v01/ct/pcrUltrasensible/obtenerReporte";
const obtenerReporteJsReportUrl = "/api/v01/ct/pcrUltrasensible/descargarReporte";
const registrarUrl = "/api/v01/ct/pcrUltrasensible/registrarActualizar";

// ===================== GET INFO SERVICIO =====================
export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => {}) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish
  );

  console.log("Respuesta PCR Ultrasensible:", res);

  if (res) {
    set((prev) => ({
      ...prev,

      // DATOS PRINCIPALES
      norden: res.norden ?? "",
      fecha: res.fechaExamen ?? "",

      nombres: res.nombres ?? "",
      apellidos: res.apellidos ?? "",
      dni: res.dniPaciente ?? "",
      edad: res.edad ?? "",

      fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
      lugarNacimiento: res.lugarNacimientoPaciente ?? "",
      sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",

      estadoCivil: res.estadoCivilPaciente ?? "",
      nivelEstudios: res.nivelEstudioPaciente ?? "",

      ocupacion: res.ocupacionPaciente ?? "",
      cargoDesempenar: res.cargoPaciente ?? "",
      area: res.areaPaciente ?? "",

      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",

      // EXAMEN
      resultado: res.resultado ?? "",
      muestra: res.muestra ?? "",
      tipoExamen: res.tipoExamen ?? "",

      // USUARIOS
      user_medicoFirma: res.usuarioFirma ?? prev.user_medicoFirma,
      user_doctorAsignado: res.doctorAsignado ?? "",

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
        codAb: form.codAb,
        fechaAb: form.fecha,

        resultado: form.resultado,
        muestra: form.muestra,
        examenDirecto: form.examenDirecto,
        pruebaRapida: form.pruebaRapida,

        userRegistro: user,
        userMedicoOcup: "",
        nOrden: form.norden,

        numTicket: 0,
        txtReponsable: user,
        fechaRegistro: form.fecha,

        esPCRUltrasensible: true,

        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
      PrintHojaR(form.norden, token, tabla);
    });
};

// ===================== PRINT =====================
export const PrintHojaR = (nro, token, tabla) => {
    PrintHojaRJsReportDefault(
      nro,
      token,
      tabla,
      obtenerReporteJsReportUrl
    );
};

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
                    "Este paciente ya cuenta con registros de Glucosa Basal",
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