import Swal from "sweetalert2"; 
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

// CAMBIAR SOLO LAS URL
const obtenerReporteUrl = "/api/v01/ct/pcrUltrasensible/obtenerReporte";
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

      // Datos principales
      norden: res.norden ?? "",
      fecha: res.fechaExamen ?? "",

      // Paciente
      nombres: res.nombres ?? "",
      apellidos: res.apellidos ?? "",
      edad: res.edad ?? "",

      // PCR
      resultado: res.resultado ?? "",
      muestra: res.muestra ?? "SALIVA",

      // Médicos
      user_medicoFirma: res.usuarioFirma ?? prev.user_medicoFirma,
      user_doctorAsignado: res.doctorAsignado ?? "",

      // Fijo porque no viene del backend
      nombreExamen: "PCR ULTRASENSIBLE",

      // Limpieza de campos que tu endpoint NO devuelve
      dni: "",
      fechaNacimiento: "",
      lugarNacimiento: "",
      sexo: "",
      estadoCivil: "",
      nivelEstudios: "",
      empresa: "",
      contrata: "",
      ocupacion: "",
      cargoDesempenar: "",
      examenDirecto: false,
      pruebaRapida: "",
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
    const jasperModules = import.meta.glob(
        "../../../../../../jaspers/AnalisisBioquimicos/*.jsx"
    );

    PrintHojaRDefault(
        nro,
        token,
        tabla,
        null,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/AnalisisBioquimicos"
    );
};

// ===================== VERIFY (CORREGIDO PARA PCR ULTRASENSIBLE) =====================
export const VerifyTR = async (nro, tabla, token, set, sede) => {
  try {
    const res = await GetInfoServicioDefault(
      nro,
      tabla,
      token,
      obtenerReporteUrl,
      () => {}
    );
    console.log("Verify PCR response:", res);

    if (res && res.norden) {
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de PCR Ultrasensible",
          "warning"
        );
      });
    } else {
      GetInfoPac(nro, set, token, sede);
    }

  } catch (error) {
    console.error("Error VerifyTR PCR:", error);

    GetInfoPac(nro, set, token, sede);
  }
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
            nombreExamen: res.nomExam ?? "",
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