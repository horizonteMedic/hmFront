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

// ================= GET INFO SERVICIO =================
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
  norden: res.antecedentes?.norden ?? "",
  fecha: res.antecedentes?.fechaAntecedente ?? "",
  nombreExamen: "ANTECEDENTES DE ALTURA",
  esApto: res.antecedentes?.esApto ?? "",
  dni: res.dni ?? "",
  nombres: res.nombres ?? "",
  apellidos: res.apellidos ?? "",
  fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
  lugarNacimiento: res.lugarnacimiento ?? "",
  edad: res.edad ?? "",
  sexo: res.sexo === "M" ? "MASCULINO" : res.sexo === "F" ? "FEMENINO" : "",
  estadoCivil: "",
  nivelEstudios: "",
  empresa: res.empresa ?? "",
  contrata: res.contrata ?? "",
  ocupacion: res.area ?? "",
  cargoDesempenar: res.cargo ?? "",
  accidenteCerebrovascular: res.antecedentes?.accidenteCerebroVascularSi ? "SI" : "NO",
  anginaInestable: res.antecedentes?.anginaInestableSi ? "SI" : "NO",
  antecedenteBypass: res.antecedentes?.antecedenteBypassArterialSi ? "SI" : "NO",
  antecedenteEdemaCerebral: res.antecedentes?.antecedenteEdemaCerebralSi ? "SI" : "NO",
  antecedenteEdemaPulmonar: res.antecedentes?.antecedenteEdemaPulmonarSi ? "SI" : "NO",
  antecedenteNeumotorax: res.antecedentes?.antecedenteNeumotoraxSi ? "SI" : "NO",
  arritmiaCardiaca: res.antecedentes?.arritmiaCardiacaSi ? "SI" : "NO",
  cardiomiopatiaHipertrofica: res.antecedentes?.cardiomiopatiaSi ? "SI" : "NO",
  cirugiaMayor: res.antecedentes?.cirujiaMayorSi ? "SI" : "NO",
  insuficienciaValvulaAortica: res.antecedentes?.cualquierInsuficienciaSi ? "SI" : "NO",
  diabetesMellitus: res.antecedentes?.diabetesMellitusSi ? "SI" : "NO",
  embarazo: res.antecedentes?.embarazoSi ? "SI" : "NO",
  epilepsia: res.antecedentes?.epilepsiaSi ? "SI" : "NO",
  epoc: res.antecedentes?.epocSi ? "SI" : "NO",
  eritrocitosisExcesiva: res.antecedentes?.eritrocitosisSi ? "SI" : "NO",
  hipertensionArterial: res.antecedentes?.hipertensionArterialSi ? "SI" : "NO",
  hipertensionPulmonar: res.antecedentes?.hipertensionPulmonarSi ? "SI" : "NO",
  infartoMiocardio: res.antecedentes?.infartoMiocardioSi ? "SI" : "NO",
  insuficienciaCardiaca: res.antecedentes?.insuficienciaCardiacaSi ? "SI" : "NO",
  patologiaHemorragicaRetina: res.antecedentes?.patologiaHemorragicaSi ? "SI" : "NO",
  patologiaValvularCardiaca: res.antecedentes?.patologiaValvularSi ? "SI" : "NO",
  presenciaMarcapasos: res.antecedentes?.presenciaMarcaPasosSi ? "SI" : "NO",
  riesgoCardiovascularAlto: res.antecedentes?.presenciaRiesgoCardioSi ? "SI" : "NO",
  trastornosCoagulacion: res.antecedentes?.transtornoCoagulacionSi ? "SI" : "NO",
  trombosisVenosaCerebral: res.antecedentes?.trombosisSi ? "SI" : "NO",
  otros: res.antecedentes?.otrosSi ? "SI" : "NO",
  otrosDescripcion: res.antecedentes?.otrosDescripcion ?? "",
  comentarios: res.antecedentes?.observaciones ?? "",
  user_medicoFirma: res.antecedentes?.usuarioFirma ?? ""
}));
}
};

// ================= SUBMIT =================
export const SubmitDataService = async (
  form,
  token,
  user,
  limpiar,
  tabla,
  datosFooter
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos incompletos", "error");
    return;
  }
const body = {
  codigoEnfermedadesAltura: form.codigoAntecedentesAltura,
  fechaAntecedente: form.fecha,
  edad: form.edad?.replace(" años", ""),
  dniUsuario: form.dniMedico,
  direccionUsuario: form.direccionMedico,
  emailUsuario: form.email,
  norden: form.norden,
  esApto: form.esApto,
  noEsApto: !form.esApto,

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

// ================= UTILIDADES =================
export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => Swal.close());
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
      GetInfoPac(nro, set, token, sede);
    },
    () => {
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
      fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
      edad: res.edad + " años",
      nombres: res.nombresApellidos,
      dni: res.dni,
      sexo: res.genero,
      cargoDesempenar: res.cargo,
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
