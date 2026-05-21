import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../utils/helpers";

const obtenerReporteUrl = "/api/v01/ct/exposicionCalor/obtenerReporte";
const registrarUrl = "/api/v01/ct/exposicionCalor/registrarActualizar";

export const GetInfoServicio = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => {},
) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish,
  );
  if (res) {
    let resultadosSignosVitales =
      "-PA: " +
      "SISTOLICA: " +
      (res.sistolica ?? "N/A") +
      " / " +
      "DIASTOLICA: " +
      (res.diastolica ?? "N/A") +
      "\n" +
      "-FRECUENCIA CARDIACA: " +
      (res.fcardiaca ?? "N/A") +
      "\n" +
      "-FRECUENCIA RESPIRATORIA: " +
      (res.frespiratoria ?? "N/A") +
      "\n" +
      "-TEMPERATURA: " +
      (res.temperatura ?? "N/A") +
      "\n" +
      "-SATURACIÓN DE OXIGENO: " +
      (res.saturacionOxigeno ?? "N/A");

    let observacionSignosVitales = "";
    if (res.sistolica !== "" && res.diastolica !== "") {
      const sistolica = parseFloat(res.sistolica);
      const diastolica = parseFloat(res.diastolica);

      if (sistolica >= 140 || diastolica >= 90) {
        observacionSignosVitales = "- HTA NO CONTROLADA.\n";
      }
    }

    let frecuenciaCardiaca = "";
    if (res.fcardiaca) {
      const fcardiaca = parseFloat(res.fcardiaca);

      if (fcardiaca >= 40 && fcardiaca <= 49) {
        frecuenciaCardiaca = "- FRECUENCIA CARDIACA: BRADICARDIA." + "\n";
      } else if (fcardiaca >= 50 && fcardiaca <= 99) {
        frecuenciaCardiaca = "- FRECUENCIA CARDIACA: NORMAL." + "\n";
      } else if (fcardiaca >= 100 && fcardiaca <= 250) {
        frecuenciaCardiaca = "- FRECUENCIA CARDIACA: TAQUICARDIA." + "\n";
      } else if (fcardiaca > 250) {
        await Swal.fire(
          "Valor Absurdo",
          "Ingrese otro dato por favor.",
          "error",
        );
        return;
      }
    }

    let frecuenciaRespiratoria = "";
    if (res.frespiratoria) {
      const frespiratoria = parseFloat(res.frespiratoria);

      if (frespiratoria <= 13) {
        frecuenciaRespiratoria = "- FRECUENCIA RESPIRATORIA: BRADIPNEA." + "\n";
      } else if (frespiratoria >= 14 && frespiratoria <= 20) {
        frecuenciaRespiratoria = "- FRECUENCIA RESPIRATORIA: NORMAL." + "\n";
      } else if (frespiratoria >= 21 && frespiratoria <= 50) {
        frecuenciaRespiratoria = "- FRECUENCIA RESPIRATORIA: TAQUIPNEA." + "\n";
      }
    }

    let estadoTemperatura = "";
    if (res.temperatura) {
      const temperatura = parseFloat(res.temperatura);

      if (temperatura >= 17 && temperatura <= 28) {
        estadoTemperatura = "- HIPOTERMIA PROFUNDA";
      } else if (temperatura >= 29 && temperatura <= 35) {
        estadoTemperatura = "- HIPOTERMIA LIGERA";
      } else if (temperatura >= 36 && temperatura <= 37.4) {
        estadoTemperatura = "- TEMPERATURA: NORMAL." + "\n";
      } else if (temperatura >= 37.5 && temperatura <= 37.9) {
        estadoTemperatura = "- TEMPERATURA: FEBRICULA." + "\n";
      } else if (temperatura >= 38 && temperatura <= 38.9) {
        estadoTemperatura = "- TEMPERATURA: FIEBRE." + "\n";
      } else if (temperatura >= 39 && temperatura <= 39.9) {
        estadoTemperatura = "- TEMPERATURA: FIEBRE ALTA." + "\n";
      } else if (temperatura >= 40 && temperatura <= 41.5) {
        estadoTemperatura = "- FIEBRE MUY ALTA";
      }
    }

    //const rese = res.resultado
    set((prev) => ({
      ...prev,
      id: res.id,
      norden: res.norden ?? "",
      nombreExamen: res.nombreExamen ?? "",
      // nombres: res.nombresPaciente ?? "",
      nombres: res.nombres + " " + res.apellidosPaciente,
      dni: res.dni ?? "",
      edad: res.edad ?? "",
      sexo: convertirGenero(res.sexo) ?? "",
      fecha: res.fechaExamen ?? prev.fecha,

      fechaNacimiento: formatearFechaCorta(res.fechaNacimiento) ?? "",
      lugarNacimiento: res.lugarNacimiento ?? "",
      estadoCivil: res.estadoCivil ?? "",
      nivelEstudios: res.nivelEstudios ?? "",

      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      ocupacion: res.ocupacion ?? "",
      cargoDesempenar: res.cargoDesempenar ?? "",

      signosVitalesResultados: resultadosSignosVitales,
      signosVitalesObservaciones:
        (observacionSignosVitales ?? "") +
        (frecuenciaCardiaca ?? "") +
        (estadoTemperatura ?? "") +
        "- SATURACIÓN DE OXIGENO: NORMAL.",
    }));
  }
};

export const GetInfoServicioEditar = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => {},
) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish,
    true,
  );
  if (res) {
    set((prev) => ({
      ...prev,
      // Header
      norden: res.norden ?? "",
      fecha: res.fecha ?? "",
      nombreExamen: res.nombreExamen ?? "",
      nombres: res.nombres + " " + res.apellidosPaciente,
      dni: res.dni ?? "",
      edad: res.edad ?? "",
      sexo: convertirGenero(res.sexo) ?? "",

      fechaNacimiento: formatearFechaCorta(res.fechaNacimiento) ?? "",
      lugarNacimiento: res.lugarNacimiento ?? "",
      estadoCivil: res.estadoCivil ?? "",
      nivelEstudios: res.nivelEstudios ?? "",

      signosVitalesResultados: res.signosVitalesResultados,
      signosVitalesObservaciones: res.signosVitalesObservaciones,
      sistemaCardiovascularResultados: res.sistemaCardiovascularResultados,
      sistemaCardiovascularObservaciones:
        res.sistemaCardiovascularObservaciones,
      sistemaRespiratorioResultados: res.sistemaRespiratorioResultados,
      sistemaRespiratorioObservaciones: res.sistemaRespiratorioObservaciones,
      estadoNeurologicoResultados: res.estadoNeurologicoResultados,
      estadoNeurologicoObservaciones: res.estadoNeurologicoObservaciones,
      estadoHidratacionResultados: res.estadoHidratacionResultados,
      estadoHidratacionObservaciones: res.estadoHidratacionObservaciones,
      toleranciaCalorResultados: res.toleranciaCalorResultados,
      toleranciaCalorObservaciones: res.toleranciaCalorObservaciones,
      sudoracionResultados: res.sudoracionResultados,
      sudoracionObservaciones: res.sudoracionObservaciones,

      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      ocupacion: res.ocupacion ?? "",
      cargoDesempenar: res.cargoDesempenar ?? "",

      aptitud: res.esApto
        ? "APTO"
        : res.noEsApto
          ? "NO APTO"
          : res.aptoRestriccion
            ? "RESTRICCION"
            : "",

      observaciones: res.observaciones,
      restricciones: res.restricciones,

      user_medicoFirma: res.usuarioFirma
        ? res.usuarioFirma
        : prev.user_medicoFirma,
      user_doctorAsignado: res.doctorAsignado,
    }));
  }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  const body = {
    norden: form.norden,
    id: form.id,
    fecha: form.fecha,

    signosVitalesResultados: form.signosVitalesResultados,
    signosVitalesObservaciones: form.signosVitalesObservaciones,
    sistemaCardiovascularResultados: form.sistemaCardiovascularResultados,
    sistemaCardiovascularObservaciones: form.sistemaCardiovascularObservaciones,
    sistemaRespiratorioResultados: form.sistemaRespiratorioResultados,
    sistemaRespiratorioObservaciones: form.sistemaRespiratorioObservaciones,
    estadoNeurologicoResultados: form.estadoNeurologicoResultados,
    estadoNeurologicoObservaciones: form.estadoNeurologicoObservaciones,
    estadoHidratacionResultados: form.estadoHidratacionResultados,
    estadoHidratacionObservaciones: form.estadoHidratacionObservaciones,
    toleranciaCalorResultados: form.toleranciaCalorResultados,
    toleranciaCalorObservaciones: form.toleranciaCalorObservaciones,
    sudoracionResultados: form.sudoracionResultados,
    sudoracionObservaciones: form.sudoracionObservaciones,

    esApto: form.aptitud == "APTO",
    aptoRestriccion: form.aptitud == "NO APTO",
    noEsApto: form.aptitud == "RESTRICCION",

    restricciones: form.restricciones,

    usuarioFirma: form.user_medicoFirma,
    userRegistro: user,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla);
  });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
    token,
  ).then(async (res) => {
    if (res?.resultado?.norden) {
      const nombre = "EscalaLakeLouise";
      console.log(nombre);
      const jasperModules = import.meta.glob(
        "../../../../jaspers/EscalaLakeLouise/*.jsx",
      );
      const modulo =
        await jasperModules[
          `../../../../jaspers/EscalaLakeLouise/${nombre}.jsx`
        ]();

      if (typeof modulo.default === "function") {
        modulo.default(res.resultado);
      } else {
        console.error(
          `El archivo ${nombre}.jsx no exporta una función por defecto`,
        );
      }
      Swal.close();
    } else {
      Swal.close();
    }
  });
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
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
      });
    },
    () => {
      //Tiene registro
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Certificado Exposicion Al Calor.",
          "warning",
        );
      });
    },
    () => {
      Swal.fire("Alerta", "El paciente necesita pasar por Triaje.", "warning");
    },
  );
};

const GetInfoPac = async (nro, set, token, sede) => {
  const res = await GetInfoPacDefault(nro, token, sede);
  if (res) {
    set((prev) => ({
      ...prev,
      nombreExamen: res.nomExam ?? "",
      nombres: res.nombresApellidos ?? "",
      edad: res.edad ?? "",
      sexo: convertirGenero(res.genero ?? ""),
      dni: res.dni ?? "",
      fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
      lugarNacimiento: res.lugarNacimiento ?? "",
      estadoCivil: res.estadoCivil,
      nivelEstudios: res.nivelEstudios,
      // Datos Laborales
      empresa: res.empresa,
      contrata: res.contrata,
      ocupacion: res.areaO,
      cargoDesempenar: res.cargo,
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
