import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils.js";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils.js";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarLaboratorioClinicp";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
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
      codLabclinico: res.codLabclinico ?? null,
      fechaExamen: res.fechaLab,
      responsable: res.resLab ?? "",

      nombreExamen: res.nombreExamen ?? "",
      dni: res.dniPaciente ?? "",

      nombres: res.nombres ?? "",
      fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
      lugarNacimiento: res.lugarNacimientoPaciente ?? "",
      edad: res.edadPaciente ?? "",
      sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
      estadoCivil: res.estadoCivilPaciente,
      nivelEstudios: res.nivelEstudioPaciente,
      // Datos Laborales
      empresa: res.empresa,
      contrata: res.contrata,
      ocupacion: res.ocupacionPaciente,
      cargoDesempenar: res.cargoPaciente,

      grupoSanguineo: res.chka ? 'A' : res.chkab ? 'AB' : res.chkb ? 'B' : res.chko ? 'O' : '',
      factorRh: res.rbrhpositivo === true ? 'RH(+)' : res.rbrhnegativo === true ? 'RH(-)' : '',
      //HEMATOLOGIA
      hemoglobina: res.txtHemoglobina ?? "",
      hematocrito: res.txtHematocrito ?? "",
      vsg: res.txtVsg ?? "",
      leucocitos: res.txtLeucocitosHematologia ?? "",
      hematies: res.txtHematiesHematologia ?? "",
      plaquetas: res.txtPlaquetas ?? "",
      neutrofilos: res.txtNeutrofilos ?? "",
      abastonados: res.txtAbastonados ?? "",
      segmentados: res.txtSegmentadosHematologia ?? "",
      monocitos: res.txtMonocitosHematologia ?? "",
      eosinofilos: res.txtEosinofilosHematologia ?? "",
      basofilos: res.txtBasofilosHematologia ?? "",
      linfocitos: res.txtLinfocitosHematologia ?? "",
      //BIO
      rpr: res.chkPositivo === true ? 'POSITIVO' : res.chkNegativo === true ? 'NEGATIVO' : 'N/A',
      vih: res.txtVih ?? "",
      glucosa: res.txtGlucosaBio ?? "",
      creatinina: res.txtCreatininaBio ?? "",

      color: res.txtColorEf ?? 'AMARILLO CLARO',
      aspecto: res.txtAspectoEf ?? 'TRANSPARENTE',
      densidad: res.txtDensidadEf ?? "",
      ph: res.txtPhEf ?? "",
      // Examen Químico
      nitritos: res.txtNitritosEq ?? 'NEGATIVO',
      proteinas: res.txtProteinasEq ?? 'NEGATIVO',
      cetonas: res.txtCetonasEq ?? 'NEGATIVO',
      leucocitosExamenQuimico: res.txtLeucocitosEq ?? 'NEGATIVO',
      acAscorbico: res.txtAcAscorbico ?? 'NEGATIVO',
      urobilinogeno: res.txtUrobilinogenoEq ?? 'NEGATIVO',
      bilirrubina: res.txtBilirrubinaEq ?? 'NEGATIVO',
      glucosaExamenQuimico: res.txtGlucosaEq ?? 'NEGATIVO',
      sangre: res.txtSangreEq ?? 'NEGATIVO',
      // Sedimento
      leucocitosSedimentoUnitario: res.txtLeucocitosSu ?? '0-0',
      hematiesSedimentoUnitario: res.txtHematiesSu ?? '0-1',
      celEpiteliales: res.txtCelEpitelialesSu ?? 'ESCASAS',
      cristales: res.txtCristalesSu ?? 'NO SE OBSERVAN',
      cilindros: res.txtCilindrosSu ?? 'NO SE OBSERVAN',
      bacterias: res.txtBacteriasSu ?? 'NO SE OBSERVAN',
      gramSc: res.txtPusSu ?? 'NO SE OBSERVAN',
      otros: res.txtOtrosSu ?? 'NO SE OBSERVAN',
      // Drogas
      cocaina: res.txtCocaina ?? "",
      marihuana: res.txtMarihuana ?? "",
      // Observaciones
      observaciones: res.txtObservacionesLb ?? "",

      user_medicoFirma: res.usuarioFirma,
    }));
  }
};

export const SubmitDataService = async (
  form,
  token,
  user,
  limpiar,
  tabla
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  const body = {
    codLabclinico: form.codLabclinico ? form.codLabclinico : null,
    fechaLab: form.fechaExamen,
    resLab: form.responsable,
    chko: form.grupoSanguineo === "O" ? true : false,
    chka: form.grupoSanguineo === "A" ? true : false,
    chkb: form.grupoSanguineo === "B" ? true : false,
    chkab: form.grupoSanguineo === "AB" ? true : false,
    rbrhpositivo: form.factorRh === "RH(+)" ? true : false,
    rbrhnegativo: form.factorRh === "RH(-)" ? true : false,
    txtHemoglobina: form.hemoglobina,
    txtHematocrito: form.hematocrito,
    txtVsg: form.vsg,
    txtPlaquetas: form.plaquetas,
    txtLeucocitosHematologia: form.leucocitos,
    txtHematiesHematologia: form.hematies,
    txtNeutrofilos: form.neutrofilos,
    txtAbastonados: form.abastonados,
    txtSegmentadosHematologia: form.segmentados,
    txtMonocitosHematologia: form.monocitos,
    txtEosinofilosHematologia: form.eosinofilos,
    txtBasofilosHematologia: form.basofilos,
    txtLinfocitosHematologia: form.linfocitos,
    txtGlucosaBio: form.glucosa,
    txtCreatininaBio: form.creatinina,
    chkPositivo: form.rpr === 'POSITIVO' ? true : false,
    chkNegativo: form.rpr === 'NEGATIVO' ? true : false,
    txtVih: form.vih,
    //ORINA
    txtColorEf: form.color,
    txtDensidadEf: form.densidad,
    txtAspectoEf: form.aspecto,
    txtPhEf: form.ph,
    //EXAMEN QUIMICO
    txtNitritosEq: form.nitritos,
    txtProteinasEq: form.proteinas,
    txtCetonasEq: form.cetonas,
    txtLeucocitosEq: form.leucocitosExamenQuimico,
    txtAcAscorbico: form.acAscorbico,
    txtUrobilinogenoEq: form.urobilinogeno,
    txtBilirrubinaEq: form.bilirrubina,
    txtGlucosaEq: form.glucosaExamenQuimico,
    txtSangreEq: form.sangre,
    //SEDIMIETNO
    txtLeucocitosSu: form.leucocitosSedimentoUnitario,
    txtCelEpitelialesSu: form.celEpiteliales,
    txtCilindrosSu: form.cilindros,
    txtBacteriasSu: form.bacterias,
    txtHematiesSu: form.hematiesSedimentoUnitario,
    txtCristalesSu: form.cristales,
    txtPusSu: form.gramSc,
    txtOtrosSu: form.otros,
    //DROGAS
    txtCocaina: form.cocaina,
    txtMarihuana: form.marihuana,
    txtObservacionesLb: form.observaciones,
    userRegistro: user,
    userMedicoOcup: "",
    norden: form.norden,
    usuarioFirma: form.user_medicoFirma,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla);
  });
};

export const PrintHojaR = async (nro, token, tabla) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/AnalisisBioquimicos/*.jsx"
  );
  await PrintHojaRDefault(
    nro,
    token,
    tabla,
    null,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/AnalisisBioquimicos"
  );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
  await VerifyTRDefault(
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
          "Este paciente ya cuenta con registros en Laboratorio Clinico",
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
      nombreExamen: res.nomExam ?? "",
      cargoDesempenar: res.cargo ?? "",
      lugarNacimiento: res.lugarNacimiento ?? "",
      sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};