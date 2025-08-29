import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  getInfoTablaDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
  "/api/v01/ct/antecedentesAltura/obtenerReporteAntecedentesAltura";
const registrarUrl =
  "/api/v01/ct/antecedentesAltura/registrarActualizarAntecedentesAltura";
const obtenerReporteInfoTablaUrl =
  "/api/v01/ct/antecedentesAltura/obtenerAntecedentesAlturaPorFiltros";

export const GetInfoServicio = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => {}
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
      ...res,
      norden: res.norden,
      codigoAntecedentesAltura: res.codigoAntecedentesAltura,
      nombre: res.nombres,
      edad: res.edad + " años",
      fechaNac: formatearFechaCorta(res.fechaNac),
      fechaExam: res.fechaInforme,
      contrata: res.contrata,
      empresa: res.empresa,
      dni: res.dni,
      sexo: res.sexo,
      actividadRealizar: res.actividadRealizar,
      apto: res.apto,
      
      // Información del médico
      nombreMedico: res.nombreMedico,
      cmp: res.cmp,
      emailMedico: res.emailMedico,
      direccionMedico: res.direccionMedico,
      
      // Antecedentes patológicos
      accidenteCerebrovascular: res.accidenteCerebrovascular,
      anginaInestable: res.anginaInestable,
      antecedenteBypass: res.antecedenteBypass,
      antecedenteEdemaCerebral: res.antecedenteEdemaCerebral,
      antecedenteEdemaPulmonar: res.antecedenteEdemaPulmonar,
      antecedenteNeumotorax: res.antecedenteNeumotorax,
      arritmiaCardiaca: res.arritmiaCardiaca,
      cardiomiopatiaHipertrofica: res.cardiomiopatiaHipertrofica,
      cirugiaMayor: res.cirugiaMayor,
      insuficienciaValvulaAortica: res.insuficienciaValvulaAortica,
      diabetesMellitus: res.diabetesMellitus,
      embarazo: res.embarazo,
      epilepsia: res.epilepsia,
      epoc: res.epoc,
      eritrocitosisExcesiva: res.eritrocitosisExcesiva,
      hipertensionArterial: res.hipertensionArterial,
      hipertensionPulmonar: res.hipertensionPulmonar,
      infartoMiocardio: res.infartoMiocardio,
      insuficienciaCardiaca: res.insuficienciaCardiaca,
      patologiaHemorragicaRetina: res.patologiaHemorragicaRetina,
      patologiaValvularCardiaca: res.patologiaValvularCardiaca,
      presenciaMarcapasos: res.presenciaMarcapasos,
      riesgoCardiovascularAlto: res.riesgoCardiovascularAlto,
      trastornosCoagulacion: res.trastornosCoagulacion,
      trombosisVenosaCerebral: res.trombosisVenosaCerebral,
      otros: res.otros,
      otrosDescripcion: res.otrosDescripcion,
      
      comentarios: res.comentarios,
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
    codigoAntecedentesAltura: form.codigoAntecedentesAltura,
    norden: form.norden,
    fechaInforme: form.fechaExam,
    dni: form.dni,
    nombres: form.nombre,
    sexo: form.sexo,
    fechaNac: form.fechaNac,
    edad: form.edad?.replace(" años", ""),
    actividadRealizar: form.actividadRealizar,
    apto: form.apto,
    
    // Información del médico
    nombreMedico: form.nombreMedico,
    cmp: form.cmp,
    emailMedico: form.emailMedico,
    direccionMedico: form.direccionMedico,
    
    // Antecedentes patológicos
    accidenteCerebrovascular: form.accidenteCerebrovascular,
    anginaInestable: form.anginaInestable,
    antecedenteBypass: form.antecedenteBypass,
    antecedenteEdemaCerebral: form.antecedenteEdemaCerebral,
    antecedenteEdemaPulmonar: form.antecedenteEdemaPulmonar,
    antecedenteNeumotorax: form.antecedenteNeumotorax,
    arritmiaCardiaca: form.arritmiaCardiaca,
    cardiomiopatiaHipertrofica: form.cardiomiopatiaHipertrofica,
    cirugiaMayor: form.cirugiaMayor,
    insuficienciaValvulaAortica: form.insuficienciaValvulaAortica,
    diabetesMellitus: form.diabetesMellitus,
    embarazo: form.embarazo,
    epilepsia: form.epilepsia,
    epoc: form.epoc,
    eritrocitosisExcesiva: form.eritrocitosisExcesiva,
    hipertensionArterial: form.hipertensionArterial,
    hipertensionPulmonar: form.hipertensionPulmonar,
    infartoMiocardio: form.infartoMiocardio,
    insuficienciaCardiaca: form.insuficienciaCardiaca,
    patologiaHemorragicaRetina: form.patologiaHemorragicaRetina,
    patologiaValvularCardiaca: form.patologiaValvularCardiaca,
    presenciaMarcapasos: form.presenciaMarcapasos,
    riesgoCardiovascularAlto: form.riesgoCardiovascularAlto,
    trastornosCoagulacion: form.trastornosCoagulacion,
    trombosisVenosaCerebral: form.trombosisVenosaCerebral,
    otros: form.otros,
    otrosDescripcion: form.otrosDescripcion,
    
    comentarios: form.comentarios,
    userRegistro: user,
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
  const jasperModules = import.meta.glob("../../../../jaspers/AntecedentesDeAltura/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../jaspers/AntecedentesDeAltura"
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
          "Este paciente ya cuenta con registros de Antecedentes de Altura.",
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
      fechaNac: formatearFechaCorta(res.fechaNac ?? ""),
      edad: res.edad + " años",
      nombres: res.nombresApellidos,
      dni: res.dni,
      sexo: res.sexo,
    }));
  }
};

export const getInfoTabla = (
  nombreSearch,
  codigoSearch,
  usuario,
  setData,
  token
) => {
  try {
    getFetch(
      `${obtenerReporteInfoTablaUrl}?${codigoSearch == "" ? "" : `&nOrden=${codigoSearch}`
      }
    ${nombreSearch == "" ? "" : `&nombres=${nombreSearch}`}&usuario=${usuario}`,
      token
    ).then((res) => {
      console.log("pros", res);
      setData(res);
    });
  } catch (error) {
    console.error("Error en getInfoTabla:", error);
    Swal.fire(
      "Error",
      "Ocurrió un error al obtener los datos de la tabla",
      "error"
    );
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
