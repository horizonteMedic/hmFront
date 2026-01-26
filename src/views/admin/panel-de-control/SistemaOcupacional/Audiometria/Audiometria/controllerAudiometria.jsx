import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

// ================= URLs =================
const obtenerReporteUrl =
  "/api/v01/ct/manipuladores/obtenerReporteAudiometria";
const registrarUrl =
  "/api/v01/ct/manipuladores/registrarActualizarManipuladoresAudiometria";

// ================= GET INFO SERVICIO =================
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
      codAu: res.codAu,
      norden: res.norden ?? "",
      fecha: res.fechaAu,

      nomExam: res.nomExam ?? "",
      dni: res.dni ?? "",

      nombres: res.nombres ?? "",
      fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
      lugarNacimiento: res.lugarNacimiento ?? "",
      edad: res.edad ?? "",
      sexo: res.sexo === "M" ? "MASCULINO" : "FEMENINO",
      estadoCivil: res.estadoCivil ?? "",
      nivelEstudios: res.nivelEstudio ?? "",
      // Datos Laborales
      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      ocupacion: res.areaTrabajo ?? "",
      cargoDesempenar: res.ocupacion ?? "",

      sordera: res.rbsasorderaSi,
      acufenos: res.rbsaacufenosSi,
      vertigo: res.rbsavertigoSi,
      otalgia: res.rbsaotalgiaSi,
      secrecion_otica: res.rbsasecrecionSi,
      otros_sintomas_orl: res.txtsaotrossintomas,

      rinitis: res.rbamrenitisSi,
      sinusitis: res.rbamsinusitisSi,
      otitis_media_cronica: res.rbamotitisSi,
      medicamentos_ototoxicos: res.rbamototoxicosSi,
      meningitis: res.rbammeningitisSi,
      tec: res.rbamtecSi,
      sordera_am: res.rbamsorderaSi,
      parotiditis: res.rbamparotiditisSi,
      sarampion: res.rbamsarampionSi,
      tbc: res.rbamtbcSi,
      cuales_antecedentes: res.txtamcuales,

      exposicion_ruido: res.rbeoexposicionSi,
      protectores_auditivos: res.rbeoprotectoresSi,
      exposicion_quimicos: res.rbeosustanciasSi,

      promedio_horas: res.rbte0a2
        ? "0-2"
        : res.rbte2a4
          ? "2-4"
          : res.rbte4a6
            ? "4-6"
            : res.rbte6a8
              ? "6-8"
              : res.rbte8a10
                ? "8-10"
                : res.rbte10a12
                  ? "10-12"
                  : res.rbtem12
                    ? ">12"
                    : res.rbteeventual
                      ? "EVENTUAL"
                      : "",
      anios_exposicion: res.txtanios,
      meses_exposicion: res.txtmeses,

      tapones: res.chktapones,
      orejeras: res.chkorejeras,

      plomo_hrs: res.txthplomo,
      mercurio_hrs: res.txthmercurio,
      tolueno_hrs: res.txthtolueno,
      xileno_hrs: res.txthxileno,
      plaguicidas_hrs: res.txthplaguic,
      organofosforados_hrs: res.txthorganofos,

      plomo_anios: res.txttplomo,
      mercurio_anios: res.txttmercurio,
      tolueno_anios: res.txtttolueno,
      xileno_anios: res.txttxileno,
      plaguicidas_anios: res.txttplaguic,
      organofosforados_anios: res.txttorganofos,
      otros_quimicos: res.txteootros,

      practica_tiro: res.rbaepraticaSi,
      uso_walkman: res.rbaeusoSi,
      otros_antecedentes: res.rbaeotrosSi,
      cuales_antecedentes_extralaborales: res.txtaecuales,
      otoscopia_odiocho: res.txtood,
      otoscopia_odilzquierdo: res.txtooi,

      od_500: res.od500,
      od_1000: res.od1000,
      od_2000: res.od2000,
      od_3000: res.od3000,
      od_4000: res.od4000,
      od_6000: res.od6000,
      od_8000: res.od8000,

      oi_500: res.oi500,
      oi_1000: res.oi1000,
      oi_2000: res.oi2000,
      oi_3000: res.oi3000,
      oi_4000: res.oi4000,
      oi_6000: res.oi6000,
      oi_8000: res.oi8000,

      diagnostico_od: res.txtdiagOd,
      diagnostico_oi: res.txtdiagOi,
      comentarios_audiometria: res.txtcomentarios,
      proteccion_simpleODoble: res.chkrpasimple
        ? "SIMPLE"
        : res.chkrpadoble
          ? "DOBLE"
          : "",
      control_semestralOAnual: res.chkcasemestral
        ? "SEMESTRAL"
        : res.chkcaanual
          ? "ANUAL"
          : "",
      recomendaciones_otras: res.txtotrasrecomendaciones,

      od_o_500: res.od1500,
      od_o_1000: res.od11000,
      od_o_2000: res.od12000,
      od_o_3000: res.od13000,
      od_o_4000: res.od14000,
      od_o_6000: res.od16000,
      od_o_8000: res.od18000,

      oi_o_500: res.oi1500,
      oi_o_1000: res.oi11000,
      oi_o_2000: res.oi12000,
      oi_o_3000: res.oi13000,
      oi_o_4000: res.oi14000,
      oi_o_6000: res.oi16000,
      oi_o_8000: res.oi18000,

      user_medicoFirma: res.usuarioFirma,
      user_doctorAsignado: res.doctorAsignado,
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
    codAu: form.codAu,
    norden: form.norden,
    fechaAu: form.fecha,

    rbsasorderaSi: form.sordera,
    rbsasorderaNo: !form.sordera,
    rbsaacufenosSi: form.acufenos,
    rbsaacufenosNo: !form.acufenos,
    rbsavertigoSi: form.vertigo,
    rbsavertigoNo: !form.vertigo,
    rbsaotalgiaSi: form.otalgia,
    rbsaotalgiaNo: !form.otalgia,
    rbsasecrecionSi: form.secrecion_otica,
    rbsasecrecionNo: !form.secrecion_otica,
    txtsaotrossintomas: form.otros_sintomas_orl,

    rbamrenitisSi: form.rinitis,
    rbamrenitisNo: !form.rinitis,
    rbamsinusitisSi: form.sinusitis,
    rbamsinusitisNo: !form.sinusitis,
    rbamotitisSi: form.otitis_media_cronica,
    rbamotitisNo: !form.otitis_media_cronica,
    rbamototoxicosSi: form.medicamentos_ototoxicos,
    rbamototoxicosNo: !form.medicamentos_ototoxicos,
    rbammeningitisSi: form.meningitis,
    rbammeningitisNo: !form.meningitis,
    rbamtecSi: form.tec,
    rbamtecNo: !form.tec,
    rbamsorderaSi: form.sordera_am,
    rbamsorderaNo: !form.sordera_am,
    rbamparotiditisSi: form.parotiditis,
    rbamparotiditisNo: !form.parotiditis,
    rbamsarampionSi: form.sarampion,
    rbamsarampionNo: !form.sarampion,
    rbamtbcSi: form.tbc,
    rbamtbcNo: !form.tbc,
    txtamcuales: form.cuales_antecedentes,

    rbeoexposicionSi: form.exposicion_ruido,
    rbeoexposicionNo: !form.exposicion_ruido,
    rbeoprotectoresSi: form.protectores_auditivos,
    rbeoprotectoresNo: !form.protectores_auditivos,
    rbeosustanciasSi: form.exposicion_quimicos,
    rbeosustanciasNo: !form.exposicion_quimicos,

    rbte0a2: form.promedio_horas == "0-2",
    rbte2a4: form.promedio_horas == "2-4",
    rbte4a6: form.promedio_horas == "4-6",
    rbte6a8: form.promedio_horas == "6-8",
    rbte8a10: form.promedio_horas == "8-10",
    rbte10a12: form.promedio_horas == "10-12",
    rbtem12: form.promedio_horas == ">12",
    rbteeventual: form.promedio_horas == "EVENTUAL",
    txtanios: form.anios_exposicion,
    txtmeses: form.meses_exposicion,

    chktapones: form.tapones,
    chkorejeras: form.orejeras,
    txthplomo: form.plomo_hrs,
    txthmercurio: form.mercurio_hrs,
    txthtolueno: form.tolueno_hrs,
    txthxileno: form.xileno_hrs,
    txthplaguic: form.plaguicidas_hrs,
    txthorganofos: form.organofosforados_hrs,

    txttplomo: form.plomo_anios,
    txttmercurio: form.mercurio_anios,
    txtttolueno: form.tolueno_anios,
    txttxileno: form.xileno_anios,
    txttplaguic: form.plaguicidas_anios,
    txttorganofos: form.organofosforados_anios,
    txteootros: form.otros_quimicos,

    rbaepraticaSi: form.practica_tiro,
    rbaepraticaNo: !form.practica_tiro,
    rbaeusoSi: form.uso_walkman,
    rbaeusoNo: !form.uso_walkman,
    rbaeotrosSi: form.otros_antecedentes,
    rbaeotrosNo: !form.otros_antecedentes,
    txtaecuales: form.cuales_antecedentes_extralaborales,
    txtood: form.otoscopia_odiocho,
    txtooi: form.otoscopia_odilzquierdo,

    od500: form.od_500,
    od1000: form.od_1000,
    od2000: form.od_2000,
    od3000: form.od_3000,
    od4000: form.od_4000,
    od6000: form.od_6000,
    od8000: form.od_8000,

    oi500: form.oi_500,
    oi1000: form.oi_1000,
    oi2000: form.oi_2000,
    oi3000: form.oi_3000,
    oi4000: form.oi_4000,
    oi6000: form.oi_6000,
    oi8000: form.oi_8000,

    txtdiagOd: form.diagnostico_od,
    txtdiagOi: form.diagnostico_oi,
    txtcomentarios: form.comentarios_audiometria,
    chkrpasimple: form.proteccion_simpleODoble == "SIMPLE",
    chkrpadoble: form.proteccion_simpleODoble == "DOBLE",
    chkcasemestral: form.control_semestralOAnual == "SEMESTRAL",
    chkcaanual: form.control_semestralOAnual == "ANUAL",
    txtotrasrecomendaciones: form.recomendaciones_otras,

    od1500: form.od_o_500,
    od11000: form.od_o_1000,
    od12000: form.od_o_2000,
    od13000: form.od_o_3000,
    od14000: form.od_o_4000,
    od16000: form.od_o_6000,
    od18000: form.od_o_8000,

    oi1500: form.oi_o_500,
    oi11000: form.oi_o_1000,
    oi12000: form.oi_o_2000,
    oi13000: form.oi_o_3000,
    oi14000: form.oi_o_4000,
    oi16000: form.oi_o_6000,
    oi18000: form.oi_o_8000,

    userRegistro: user,
    userMedicoOcup: "",
    formato: "",
    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
  };

  await SubmitDataServiceDefault(
    token,
    limpiar,
    body,
    registrarUrl,
    () => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    }
  );
};

// ================= PRINT =================
export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob(
    "../../../../../jaspers/Audiometria/*.jsx"
  );

  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/Audiometria"
  );
};

// ================= VERIFY =================
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
          "Este paciente ya cuenta con registros de Audiometría.",
          "warning"
        );
      });
    }
  );
};

// ================= GET INFO PAC =================
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

// ================= LOADING =================
export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};