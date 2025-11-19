import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

const obtenerReporteUrl =
  "/api/v01/ct/antecedentesEnfermedadesAltura/obtenerReporteAntecedentesEnfermedadesAltura";
const registrarUrl =
  "/api/v01/ct/antecedentesEnfermedadesAltura/registrarActualizarAntecedentesEnfermedadesAltura";

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
      norden: res.antecedentes?.norden ?? "",
      codigoAntecedentesAltura: res.antecedentes?.codigoEnfermedadesAltura,
      nombres: `${res.nombres ?? ""} ${res.apellidos ?? ""}`,
      edad: res.edad + " años",
      fechaNac: formatearFechaCorta(res?.fechaNacimientoPaciente ?? ""),
      fechaExam: res.antecedentes?.fechaAntecedente ?? "",
      contrata: res.contrata ?? "",
      empresa: res.empresa ?? "",
      dni: res.dni ?? "",
      sexo: res.sexo ?? "",
      cargo: res.cargo ?? "",
      apto: res.antecedentes?.esApto,

      // Antecedentes patológicos
      accidenteCerebrovascular: res.antecedentes?.accidenteCerebroVascularSi,
      anginaInestable: res.antecedentes?.anginaInestableSi,
      antecedenteBypass: res.antecedentes?.antecedenteBypassArterialSi,
      antecedenteEdemaCerebral: res.antecedentes?.antecedenteEdemaCerebralSi,
      antecedenteEdemaPulmonar: res.antecedentes?.antecedenteEdemaPulmonarSi,
      antecedenteNeumotorax: res.antecedentes?.antecedenteNeumotoraxSi,
      arritmiaCardiaca: res.antecedentes?.arritmiaCardiacaSi,
      cardiomiopatiaHipertrofica: res.antecedentes?.cardiomiopatiaSi,
      cirugiaMayor: res.antecedentes?.cirujiaMayorSi,
      insuficienciaValvulaAortica: res.antecedentes?.cualquierInsuficienciaSi,
      diabetesMellitus: res.antecedentes?.diabetesMellitusSi,
      embarazo: res.antecedentes?.embarazoSi,
      epilepsia: res.antecedentes?.epilepsiaSi,
      epoc: res.antecedentes?.epocSi,
      eritrocitosisExcesiva: res.antecedentes?.eritrocitosisSi,
      hipertensionArterial: res.antecedentes?.hipertensionArterialSi,
      hipertensionPulmonar: res.antecedentes?.hipertensionPulmonarSi,
      infartoMiocardio: res.antecedentes?.infartoMiocardioSi,
      insuficienciaCardiaca: res.antecedentes?.insuficienciaCardiacaSi,
      patologiaHemorragicaRetina: res.antecedentes?.patologiaHemorragicaSi,
      patologiaValvularCardiaca: res.antecedentes?.patologiaValvularSi,
      presenciaMarcapasos: res.antecedentes?.presenciaMarcaPasosSi,
      riesgoCardiovascularAlto: res.antecedentes?.presenciaRiesgoCardioSi,
      trastornosCoagulacion: res.antecedentes?.transtornoCoagulacionSi,
      trombosisVenosaCerebral: res.antecedentes?.trombosisSi,
      otros: res.antecedentes?.otrosSi,
      otrosDescripcion: res.antecedentes?.otrosDescripcion ?? "",
      comentarios: res.antecedentes?.observaciones ?? "",

      user_medicoFirma: res.antecedentes.usuarioFirma,
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
    codigoEnfermedadesAltura: form.codigoAntecedentesAltura,
    fechaAntecedente: form.fechaExam,
    edad: form.edad?.replace(" años", ""),
    dniUsuario: form.dniMedico,
    direccionUsuario: form.direccionMedico,
    emailUsuario: form.email,
    norden: form.norden,
    esApto: form.apto,
    noEsApto: !form.apto,
    accidenteCerebroVascularNo: !form.accidenteCerebrovascular,
    accidenteCerebroVascularSi: form.accidenteCerebrovascular,
    anginaInestableNo: !form.anginaInestable,
    anginaInestableSi: form.anginaInestable,
    antecedenteBypassArterialNo: !form.antecedenteBypass,
    antecedenteBypassArterialSi: form.antecedenteBypass,
    antecedenteEdemaCerebralNo: !form.antecedenteEdemaCerebral,
    antecedenteEdemaCerebralSi: form.antecedenteEdemaCerebral,
    antecedenteEdemaPulmonarNo: !form.antecedenteEdemaPulmonar,
    antecedenteEdemaPulmonarSi: form.antecedenteEdemaPulmonar,
    antecedenteNeumotoraxNo: !form.antecedenteNeumotorax,
    antecedenteNeumotoraxSi: form.antecedenteNeumotorax,
    arritmiaCardiacaNo: !form.arritmiaCardiaca,
    arritmiaCardiacaSi: form.arritmiaCardiaca,
    cardiomiopatiaNo: !form.cardiomiopatiaHipertrofica,
    cardiomiopatiaSi: form.cardiomiopatiaHipertrofica,
    cirujiaMayorNo: !form.cirugiaMayor,
    cirujiaMayorSi: form.cirugiaMayor,
    cualquierInsuficienciaNo: !form.insuficienciaValvulaAortica,
    cualquierInsuficienciaSi: form.insuficienciaValvulaAortica,
    diabetesMellitusNo: !form.diabetesMellitus,
    diabetesMellitusSi: form.diabetesMellitus,
    embarazoNo: !form.embarazo,
    embarazoSi: form.embarazo,
    epilepsiaNo: !form.epilepsia,
    epilepsiaSi: form.epilepsia,
    epocNo: !form.epoc,
    epocSi: form.epoc,
    eritrocitosisNo: !form.eritrocitosisExcesiva,
    eritrocitosisSi: form.eritrocitosisExcesiva,
    hipertensionArterialNo: !form.hipertensionArterial,
    hipertensionArterialSi: form.hipertensionArterial,
    hipertensionPulmonarNo: !form.hipertensionPulmonar,
    hipertensionPulmonarSi: form.hipertensionPulmonar,
    infartoMiocardioNo: !form.infartoMiocardio,
    infartoMiocardioSi: form.infartoMiocardio,
    insuficienciaCardiacaNo: !form.insuficienciaCardiaca,
    insuficienciaCardiacaSi: form.insuficienciaCardiaca,
    patologiaHemorragicaNo: !form.patologiaHemorragicaRetina,
    patologiaHemorragicaSi: form.patologiaHemorragicaRetina,
    patologiaValvularNo: !form.patologiaValvularCardiaca,
    patologiaValvularSi: form.patologiaValvularCardiaca,
    presenciaMarcaPasosNo: !form.presenciaMarcapasos,
    presenciaMarcaPasosSi: form.presenciaMarcapasos,
    presenciaRiesgoCardioNo: !form.riesgoCardiovascularAlto,
    presenciaRiesgoCardioSi: form.riesgoCardiovascularAlto,
    transtornoCoagulacionNo: !form.trastornosCoagulacion,
    transtornoCoagulacionSi: form.trastornosCoagulacion,
    trombosisNo: !form.trombosisVenosaCerebral,
    trombosisSi: form.trombosisVenosaCerebral,
    otrosNo: !form.otros,
    otrosSi: form.otros,
    otrosDescripcion: form.otrosDescripcion,
    observaciones: form.comentarios,

    usuarioFirma: form.user_medicoFirma,
    usuarioRegistro: user,
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
  const jasperModules = import.meta.glob(
    "../../../../jaspers/AntecedentesAltura/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../jaspers/AntecedentesAltura"
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
      sexo: res.genero,
      cargo: res.cargo,
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
