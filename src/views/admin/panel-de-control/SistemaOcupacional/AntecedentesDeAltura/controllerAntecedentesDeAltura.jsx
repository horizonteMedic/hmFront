import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../utils/auditoriaUtils";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl =
  "/api/v01/ct/antecedentesEnfermedadesAltura/obtenerReporteAntecedentesEnfermedadesAltura";
export const registrarUrl =
  "/api/v01/ct/antecedentesEnfermedadesAltura/registrarActualizarAntecedentesEnfermedadesAltura";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
// Este examen tiene 2 formatos posibles (AnexoCB / AnexoCB_boro) que el backend resuelve
// vía `nameJasper`, por eso se mantiene PrintHojaRDefault (resolución dinámica por carpeta).
const jasperModules = import.meta.glob("../../../../jaspers/AntecedentesAltura/*.jsx");
const rutaCarpeta = "../../../../jaspers/AntecedentesAltura";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
  const res = await GetInfoPacDefault(nro, token, sede);
  if (!res || res.error || !res.norden) {
    Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
      html: `No se encontró ningún registro con el N° Orden ${nro}.`,
    });
    return;
  }

  // Validación HTA (mal de altura): si la presión está fuera de rango se marca el
  // antecedente de hipertensión arterial automáticamente.
  const sistolica = parseFloat(res.sistolica);
  const diastolica = parseFloat(res.diastolica);
  const hipertension =
    (!isNaN(sistolica) && sistolica >= 140) ||
    (!isNaN(diastolica) && diastolica >= 90);

  set((prev) => ({
    ...prev,
    norden: res.norden ?? "",
    nombres: res.nombresApellidos ?? "",
    fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
    lugarNacimiento: res.lugarNacimiento ?? "",
    estadoCivil: res.estadoCivil ?? "",
    nivelEstudios: res.nivelEstudios ?? "",
    dni: res.dni ?? "",
    edad: res.edad ?? "",
    sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
    empresa: res.empresa ?? "",
    contrata: res.contrata ?? "",
    ocupacion: res.areaO ?? "",
    cargoDesempenar: res.cargo ?? "",
    cargo: res.cargo ?? "",

    hipertensionArterial: hipertension,
    tieneRegistro: false,
  }));
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = async (
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
  if (!res) return;

  const a = res.antecedentes ?? {};

  set((prev) => ({
    ...prev,
    norden: a.norden ?? res.norden ?? "",
    codigoAntecedentesAltura: a.codigoEnfermedadesAltura ?? null,
    nombres: `${res.nombres ?? ""} ${res.apellidos ?? ""}`.trim(),
    edad: res.edad ?? "",
    fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
    fechaExam: a.fechaAntecedente ?? "",
    lugarNacimiento: res.lugarNacimientoPaciente ?? "",
    estadoCivil: res.estadoCivilPaciente ?? "",
    nivelEstudios: res.nivelEstudiosPaciente ?? "",
    contrata: res.contrata ?? "",
    empresa: res.empresa ?? "",
    ocupacion: res.ocupacionPaciente ?? "",
    cargoDesempenar: res.cargoPaciente ?? "",
    dni: res.dni ?? "",
    sexo: res.sexo === "M" ? "MASCULINO" : "FEMENINO",
    cargo: res.cargo ?? "",
    apto: a.esApto,

    // Antecedentes patológicos
    accidenteCerebrovascular: a.accidenteCerebroVascularSi,
    anginaInestable: a.anginaInestableSi,
    antecedenteBypass: a.antecedenteBypassArterialSi,
    antecedenteEdemaCerebral: a.antecedenteEdemaCerebralSi,
    antecedenteEdemaPulmonar: a.antecedenteEdemaPulmonarSi,
    antecedenteNeumotorax: a.antecedenteNeumotoraxSi,
    arritmiaCardiaca: a.arritmiaCardiacaSi,
    cardiomiopatiaHipertrofica: a.cardiomiopatiaSi,
    cirugiaMayor: a.cirujiaMayorSi,
    insuficienciaValvulaAortica: a.cualquierInsuficienciaSi,
    diabetesMellitus: a.diabetesMellitusSi,
    embarazo: a.embarazoSi,
    epilepsia: a.epilepsiaSi,
    epoc: a.epocSi,
    eritrocitosisExcesiva: a.eritrocitosisSi,
    hipertensionArterial: a.hipertensionArterialSi,
    hipertensionPulmonar: a.hipertensionPulmonarSi,
    infartoMiocardio: a.infartoMiocardioSi,
    insuficienciaCardiaca: a.insuficienciaCardiacaSi,
    patologiaHemorragicaRetina: a.patologiaHemorragicaSi,
    patologiaValvularCardiaca: a.patologiaValvularSi,
    presenciaMarcapasos: a.presenciaMarcaPasosSi,
    riesgoCardiovascularAlto: a.presenciaRiesgoCardioSi,
    trastornosCoagulacion: a.transtornoCoagulacionSi,
    trombosisVenosaCerebral: a.trombosisSi,
    otros: a.otrosSi,
    otrosDescripcion: a.otrosDescripcion ?? "",
    comentarios: a.observaciones ?? "",

    user_medicoFirma: a.usuarioFirma ? a.usuarioFirma : prev.user_medicoFirma,

    // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
    fechaRegistro: a.fechaRegistro ?? res.fechaRegistro ?? "",
    userRegistro: a.userRegistro ?? res.userRegistro ?? a.usuarioRegistro ?? "",
    fechaActualizacion: a.fechaActualizacion ?? res.fechaActualizacion ?? "",
    usuarioActualizacion:
      a.usuarioActualizacion ?? res.usuarioActualizacion ?? "",
    tieneRegistro: true,
  }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
  codigoEnfermedadesAltura: form.codigoAntecedentesAltura,
  fechaAntecedente: form.fechaExam,
  edad: form.edad,
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
});

// Body completo (creación / actualización). El backend de este módulo espera la
// clave "usuarioRegistro" (no "userRegistro") para el usuario que registra.
export const construirBody = (form, user, esActualizacion) =>
  sellarAuditoria(construirBase(form), {
    user,
    esActualizacion,
    userRegistro: form.userRegistro,
    fechaRegistro: form.fechaRegistro,
    campoUserRegistro: "usuarioRegistro",
  });

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    rutaCarpeta
  );
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) =>
  guardarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
  });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) =>
  actualizarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
  });

// ===== Búsqueda / verificación por N° Orden =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
  verificarRegistro({
    nro,
    tabla,
    token,
    sede,
    onNuevo: () => GetInfoServicio(nro, set, token, sede),
    onExistente: () =>
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        Swal.fire({
          icon: "warning",
          title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
          html: "Este paciente ya cuenta con registros de Antecedentes de Altura.",
        });
      }),
  });

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
