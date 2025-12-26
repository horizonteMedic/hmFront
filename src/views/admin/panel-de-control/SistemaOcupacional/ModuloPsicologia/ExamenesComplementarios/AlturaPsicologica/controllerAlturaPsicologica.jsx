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

// Reutilizamos los endpoints generales de Informe Psicológico
const obtenerReporteUrl =
  "/api/v01/ct/informePsicologicoFobias/obtenerReporteInformePsicologicoFobias";
const registrarUrl =
  "/api/v01/ct/informePsicologicoFobias/registrarActualizarInformePsicologicoFobias";

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
      fecha: res.fecha,

      esApto: res.apto ?? false,

      nombreExamen: res.nombreExamenPsicologico ?? "",
      dni: res.dniPaciente ?? "",

      nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
      fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
      lugarNacimiento: res.lugarNacimientoPaciente ?? "",
      edad: res.edadPaciente ?? "",
      sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
      estadoCivil: res.estadoCivilPaciente ?? "",
      nivelEstudios: res.nivelEstudioPaciente ?? "",
      // Datos Laborales
      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      ocupacion: res.ocupacionPaciente ?? "",
      cargoDesempenar: res.cargoPaciente ?? "",

      razonamiento: res.razonamientoI ? "I" :
        res.razonamientoNPI ? "NPI" :
          res.razonamientoNP ? "NP" :
            res.razonamientoNPS ? "NPS" :
              res.razonamientoS ? "S" : "",

      memoria: res.memoriaI ? "I" :
        res.memoriaNPI ? "NPI" :
          res.memoriaNP ? "NP" :
            res.memoriaNPS ? "NPS" :
              res.memoriaS ? "S" : "",

      atencionConcentracion: res.atencionI ? "I" :
        res.atencionNPI ? "NPI" :
          res.atencionNP ? "NP" :
            res.atencionNPS ? "NPS" :
              res.atencionS ? "S" : "",

      coordinacionVisoMotora: res.coordinacionI ? "I" :
        res.coordinacionNPI ? "NPI" :
          res.coordinacionNP ? "NP" :
            res.coordinacionNPS ? "NPS" :
              res.coordinacionS ? "S" : "",

      orientacionEspacial: res.orientacionI ? "I" :
        res.orientacionNPI ? "NPI" :
          res.orientacionNP ? "NP" :
            res.orientacionNPS ? "NPS" :
              res.orientacionS ? "S" : "",

      // Aspectos de Personalidad
      estabilidad: res.estabilidadInestable ? "INESTABLE" :
        res.estabilidadEstable ? "ESTABLE" : "",

      ansiedadTendencias: res.nivelAnsiedadCaso ? "CASO" :
        res.nivelAnsiedadNoCaso ? "NO CASO" : "",

      consumoAlcohol: res.consumoAlcoholCaso ? "CASO" :
        res.consumoAlcoholNoCaso ? "NO CASO" : "",

      fobiaAltura: res.fobiaAlturaNada ? "NADA" :
        res.fobiaAlturaLigeramente ? "LIGERAMENTE" :
          res.fobiaAlturaModeradamente ? "MODERADAMENTE" :
            res.fobiaAlturaMarcadamente ? "MARCADAMENTE" :
              res.fobiaAlturaMiedoExtremo ? "MIEDO EXTREMO" : "",

      // Analisis y recomendaciones
      analisisResultados: res.analisis ?? "",
      recomendaciones: res.recomendacion ?? "",
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
  if (form.esApto === undefined || form.esApto === null) {
    await Swal.fire("Error", "Debe marcar aptitud", "error");
    return;
  }

  const body = {
    norden: form.norden,
    fecha: form.fechaExamen,

    nombreExamen: form.nombreExamen,

    razonamientoI: form.razonamiento == "I",
    razonamientoNPI: form.razonamiento == "NPI",
    razonamientoNP: form.razonamiento == "NP",
    razonamientoNPS: form.razonamiento == "NPS",
    razonamientoS: form.razonamiento == "S",

    memoriaI: form.memoria == "I",
    memoriaNPI: form.memoria == "NPI",
    memoriaNP: form.memoria == "NP",
    memoriaNPS: form.memoria == "NPS",
    memoriaS: form.memoria == "S",

    atencionI: form.atencionConcentracion == "I",
    atencionNPI: form.atencionConcentracion == "NPI",
    atencionNP: form.atencionConcentracion == "NP",
    atencionNPS: form.atencionConcentracion == "NPS",
    atencionS: form.atencionConcentracion == "S",

    coordinacionI: form.coordinacionVisoMotora == "I",
    coordinacionNPI: form.coordinacionVisoMotora == "NPI",
    coordinacionNP: form.coordinacionVisoMotora == "NP",
    coordinacionNPS: form.coordinacionVisoMotora == "NPS",
    coordinacionS: form.coordinacionVisoMotora == "S",

    orientacionI: form.orientacionEspacial == "I",
    orientacionNPI: form.orientacionEspacial == "NPI",
    orientacionNP: form.orientacionEspacial == "NP",
    orientacionNPS: form.orientacionEspacial == "NPS",
    orientacionS: form.orientacionEspacial == "S",

    estabilidadInestable: form.estabilidad == "INESTABLE",
    estabilidadEstable: form.estabilidad == "ESTABLE",

    nivelAnsiedadCaso: form.ansiedadTendencias == "CASO",
    nivelAnsiedadNoCaso: form.ansiedadTendencias == "NO CASO",

    consumoAlcoholCaso: form.consumoAlcohol == "CASO",
    consumoAlcoholNoCaso: form.consumoAlcohol == "NO CASO",

    fobiaAlturaNada: form.fobiaAltura == "NADA",
    fobiaAlturaLigeramente: form.fobiaAltura == "LIGERAMENTE",
    fobiaAlturaModeradamente: form.fobiaAltura == "MODERADAMENTE",
    fobiaAlturaMarcadamente: form.fobiaAltura == "MARCADAMENTE",
    fobiaAlturaMiedoExtremo: form.fobiaAltura == "MIEDO EXTREMO",

    apto: form.esApto,
    noApto: !form.esApto,

    analisis: form.analisisResultados,
    recomendacion: form.recomendaciones,

    usuarioRegistro: user,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob("../../../../../jaspers/ModuloPsicologia/InformePsicologicoADECO/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/ModuloPsicologia/InformePsicologicoADECO"
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
          "Este paciente ya cuenta con registros de Informe Psicológico para Altura.",
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
      nombres: res.nombresApellidos ?? "",
      fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
      edad: res.edad,
      ocupacion: res.areaO ?? "",
      cargoDesempenar: res.cargo ?? "",
      lugarNacimiento: res.lugarNacimiento ?? "",
      sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};