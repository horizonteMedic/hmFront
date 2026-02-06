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

    norden: res.norden ?? "",
    fecha: res.fechaAntecedente ?? "",
    nombreExamen: "ANTECEDENTES DE ALTURA",
    esApto: res.esApto,

    dni: res.dni ?? "",
    nombres: res.nombres ?? "",
    apellidos: res.apellidos ?? "",
    fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
    lugarNacimiento: res.lugarNacimientoPaciente ?? "",   
    edad: res.edad + " años",
    sexo: res.sexo ?? "",
    estadoCivil: res.estadoCivilPaciente ?? "",
    nivelEstudios: res.nivelEstudioPaciente ?? "", 
    
    empresa: res.empresa ?? "",
    contrata: res.contrata ?? "",
    ocupacion: res.ocupacion ?? "",
    cargoDesempenar: res.cargo ?? "",

    // ===== ANTECEDENTES =====
    accidenteCerebrovascular: res.accidenteCerebroVascularSi,
    anginaInestable: res.anginaInestableSi,
    antecedenteBypass: res.antecedenteBypassArterialSi,
    antecedenteEdemaCerebral: res.antecedenteEdemaCerebralSi,
    antecedenteEdemaPulmonar: res.antecedenteEdemaPulmonarSi,
    antecedenteNeumotorax: res.antecedenteNeumotoraxSi,
    arritmiaCardiaca: res.arritmiaCardiacaSi,
    cardiomiopatiaHipertrofica: res.cardiomiopatiaSi,
    cirugiaMayor: res.cirujiaMayorSi,
    insuficienciaValvulaAortica: res.cualquierInsuficienciaSi,
    diabetesMellitus: res.diabetesMellitusSi,
    embarazo: res.embarazoSi,
    epilepsia: res.epilepsiaSi,
    epoc: res.epocSi,
    eritrocitosisExcesiva: res.eritrocitosisSi,
    hipertensionArterial: res.hipertensionArterialSi,
    hipertensionPulmonar: res.hipertensionPulmonarSi,
    infartoMiocardio: res.infartoMiocardioSi,
    insuficienciaCardiaca: res.insuficienciaCardiacaSi,
    patologiaHemorragicaRetina: res.patologiaHemorragicaSi,
    patologiaValvularCardiaca: res.patologiaValvularSi,
    presenciaMarcapasos: res.presenciaMarcaPasosSi,
    riesgoCardiovascularAlto: res.presenciaRiesgoCardioSi,
    trastornosCoagulacion: res.transtornoCoagulacionSi,
    trombosisVenosaCerebral: res.trombosisSi,
    otros: res.otrosSi,

    otrosDescripcion: res.otrosDescripcion ?? "",
    comentarios: res.observaciones ?? "",

    user_medicoFirma: res.usuarioFirma,
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
  norden: form.norden,
  fecha: form.fecha,
  nombreExamen: form.nombreExamen,
  esApto: form.esApto,

  dni: form.dni,
  nombres: form.nombres,
  apellidos: form.apellidos,
  fechaNacimiento: form.fechaNacimiento,
  lugarNacimiento: form.lugarNacimiento,   
  edad: form.edad,
  sexo: form.sexo,
  estadoCivil: form.estadoCivil,
  nivelEstudios: form.nivelEstudios,

  empresa: form.empresa,
  contrata: form.contrata,
  ocupacion: form.ocupacion,
  cargoDesempenar: form.cargoDesempenar,

  // ===== ANTECEDENTES =====
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

  user_medicoFirma: form.user_medicoFirma,
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

// ✅ AQUÍ está bien definido VerifyTR
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
