import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
  VerifyTRPerzonalizadoDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero, getHoraActual } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";
import { VerifyTRPerzonalizado } from "../FichaCertificadoAltura/controllerFichaCertificadoAltura";

const obtenerReporteUrl = "/api/v01/ct/exposicionCalor/obtenerReporte";
const registrarUrl = "/api/v01/ct/exposicionCalor/registrarActualizar";

export const GetInfoServicio = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { },
) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish,
  );
  const rese = res.resultado
  if (res) {
    let resultadosSignosVitales =
      "-PA: " +
      "SISTOLICA: " +
      (rese.sistolica ?? "N/A") +
      " / " +
      "DIASTOLICA: " +
      (rese.diastolica ?? "N/A") +
      "\n" +
      "-FRECUENCIA CARDIACA: " +
      (rese.fcardiaca ?? "N/A") +
      "\n" +
      "-FRECUENCIA RESPIRATORIA: " +
      (rese.frespiratoria ?? "N/A") +
      "\n" +
      "-TEMPERATURA: " +
      (rese.temperatura ?? "N/A") +
      "\n" +
      "-SATURACIÓN DE OXIGENO: " +
      (rese.saturacionOxigeno ?? "N/A");

    let observacionSignosVitales = "";
    if (rese.sistolica !== "" && rese.diastolica !== "") {
      const sistolica = parseFloat(rese.sistolica);
      const diastolica = parseFloat(rese.diastolica);

      if (sistolica >= 140 || diastolica >= 90) {
        observacionSignosVitales = "- HTA NO CONTROLADA.\n";
      }
    }

    let frecuenciaCardiaca = "";
    if (rese.fcardiaca) {
      const fcardiaca = parseFloat(rese.fcardiaca);

      if (fcardiaca >= 40 && fcardiaca <= 49) {
        frecuenciaCardiaca = "- FRECUENCIA CARDIACA: BRADICARDIA." + "\n";
      } else if (fcardiaca >= 50 && fcardiaca <= 99) {
        frecuenciaCardiaca = "- FRECUENCIA CARDIACA: NORMAL." + "\n";
      } else if (fcardiaca >= 100 && fcardiaca <= 250) {
        frecuenciaCardiaca = "- FRECUENCIA CARDIACA: TAQUICARDIA." + "\n";
      }
    }

    let frecuenciaRespiratoria = "";
    if (rese.frespiratoria) {
      const frespiratoria = parseFloat(rese.frespiratoria);

      if (frespiratoria <= 13) {
        frecuenciaRespiratoria = "- FRECUENCIA RESPIRATORIA: BRADIPNEA." + "\n";
      } else if (frespiratoria >= 14 && frespiratoria <= 20) {
        frecuenciaRespiratoria = "- FRECUENCIA RESPIRATORIA: NORMAL." + "\n";
      } else if (frespiratoria >= 21 && frespiratoria <= 50) {
        frecuenciaRespiratoria = "- FRECUENCIA RESPIRATORIA: TAQUIPNEA." + "\n";
      }
    }

    let estadoTemperatura = "";
    if (rese.temperatura) {
      const temperatura = parseFloat(rese.temperatura);

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
      id: rese.id,
      norden: rese.norden ?? "",
      nombreExamen: rese.nombreExamen ?? "",
      // nombres: res.nombresPaciente ?? "",
      nombres: rese.nombres + " " + rese.apellidosPaciente,
      dni: rese.dni ?? "",
      edad: rese.edad ?? "",
      sexo: convertirGenero(rese.sexo) ?? "",
      fecha: (rese.fechaExamen || rese.fecha) ?? prev.fecha,

      fechaNacimiento: formatearFechaCorta(rese.fechaNacimiento) ?? "",
      lugarNacimiento: rese.lugarNacimiento ?? "",
      estadoCivil: rese.estadoCivil ?? "",
      nivelEstudios: rese.nivelEstudios ?? "",

      empresa: rese.empresa ?? "",
      contrata: rese.contrata ?? "",
      ocupacion: rese.ocupacion ?? "",
      cargoDesempenar: rese.cargoDesempenar ?? "",

      signosVitalesResultados: resultadosSignosVitales,
      signosVitalesObservaciones:
        (observacionSignosVitales ?? "") +
        (frecuenciaCardiaca ?? "") +
        (estadoTemperatura ?? "") +
        "- SATURACIÓN DE OXIGENO: NORMAL.",

      user_medicoFirma: rese.usuarioFirma ? rese.usuarioFirma : prev.user_medicoFirma
    }));
  }
};

export const GetInfoServicioEditar = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { },
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
    const rese = res.resultado
    set((prev) => ({
      ...prev,
      // Header
      norden: rese.norden ?? "",
      fecha: rese.fecha ?? "",
      nombreExamen: rese.nombreExamen ?? "",
      nombres: rese.nombres + " " + rese.apellidosPaciente,
      dni: rese.dni ?? "",
      edad: rese.edad ?? "",
      sexo: convertirGenero(rese.sexo) ?? "",

      hora: rese.hora ?? "",

      fechaNacimiento: formatearFechaCorta(rese.fechaNacimiento) ?? "",
      lugarNacimiento: rese.lugarNacimiento ?? "",
      estadoCivil: rese.estadoCivil ?? "",
      nivelEstudios: rese.nivelEstudios ?? "",

      signosVitalesResultados: rese.signosVitalesResultados,
      signosVitalesObservaciones: rese.signosVitalesObservaciones,
      sistemaCardiovascularResultados: rese.sistemaCardiovascularResultados,
      sistemaCardiovascularObservaciones:
        rese.sistemaCardiovascularObservaciones,
      sistemaRespiratorioResultados: rese.sistemaRespiratorioResultados,
      sistemaRespiratorioObservaciones: rese.sistemaRespiratorioObservaciones,
      estadoNeurologicoResultados: rese.estadoNeurologicoResultados,
      estadoNeurologicoObservaciones: rese.estadoNeurologicoObservaciones,
      estadoHidratacionResultados: rese.estadoHidratacionResultados,
      estadoHidratacionObservaciones: rese.estadoHidratacionObservaciones,
      toleranciaCalorResultados: rese.toleranciaCalorResultados,
      toleranciaCalorObservaciones: rese.toleranciaCalorObservaciones,
      sudoracionResultados: rese.sudoracionResultados,
      sudoracionObservaciones: rese.sudoracionObservaciones,

      empresa: rese.empresa ?? "",
      contrata: rese.contrata ?? "",
      ocupacion: rese.ocupacion ?? "",
      cargoDesempenar: rese.cargoDesempenar ?? "",

      aptitud: rese.esApto
        ? "APTO"
        : rese.noEsApto
          ? "NO APTO"
          : rese.aptoRestriccion
            ? "RESTRICCION"
            : "",

      observaciones: rese.observaciones,
      restricciones: rese.restricciones,

      user_medicoFirma: rese.user_medicoFirma
        ? rese.user_medicoFirma
        : prev.user_medicoFirma,
    }));
  }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }


  if (form.aptitud == "") {
    await Swal.fire("Advertencia", "Debe seleccionar la aptitud", "warning");
    return;
  }

  const body = {
    norden: form.norden,
    id: form.id,
    fecha: form.fecha,

    horaRegistro:  getHoraActual(),

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
    aptoRestriccion: form.aptitud == "RESTRICCION",
    noEsApto: form.aptitud == "NO APTO",

    observaciones: form.observaciones,
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
      const nombre = "CertificadoExposicionAlCalor";
      console.log(nombre);
      const jasperModules = import.meta.glob(
        "../../../../jaspers/CertificadoExposicionAlCalor/*.jsx",
      );
      const modulo =
        await jasperModules[
          `../../../../jaspers/CertificadoExposicionAlCalor/${nombre}.jsx`
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
  VerifyTRPerzonalizadoDefault(
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

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
