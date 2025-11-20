import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { SubmitHematologia } from "../ControllerLC/model.js";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarLaboratorioClinicp";
const tabla = 'lab_clinico';

export const GetInfoServicio = async (nro, tabla, set, setO, token, setSearchMedico, onFinish = () => { }) => {
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
      paciente: res.nombres ?? "",
      fecha: res.fechaLab ?? prev.fecha,
      responsable: res.resLab ?? "",
      empContratista: res.contrata ?? "",
      grupo: res.chka ? 'A' : res.chkab ? 'AB' : res.chkb ? 'B' : res.chko ? 'O' : '',
      rh: res.rbrhpositivo === true ? 'Rh(+)' : res.rbrhnegativo === true ? 'Rh(-)' : '',
      //HEMATOLOGIA
      hemoglobina: res.txtHemoglobina ?? "",
      hematocrito: res.txtHematocrito ?? "",
      vsg: res.txtVsg ?? "",
      leucocitos: res.txtLeucocitosHematologia ?? "",
      hematies: res.txtHematiesHematologia ?? "",
      plaquetas: res.txtPlaquetas ?? "",
      linfocitos: res.txtLinfocitosHematologia ?? "",
      neutrofilos: res.txtNeutrofilos ?? "",
      abastonados: res.txtAbastonados ?? "",
      segmentados: res.txtSegmentadosHematologia ?? "",
      monocitos: res.txtMonocitosHematologia ?? "",
      eosinofilos: res.txtEosinofilosHematologia ?? "",
      basofilos: res.txtBasofilosHematologia ?? "",
      //BIO
      glucosa: res.txtGlucosaBio ?? "",
      creatinina: res.txtCreatininaBio ?? "",
      rpr: res.chkPositivo === true ? 'POSITIVO' : res.chkNegativo === true ? 'NEGATIVO' : 'N/A',
      vih: res.txtVih ?? "",
    }));
    setO((prev) => ({
      ...prev,
      Incoloro: false,
      Medicamentosa: false,
      Transparente: false,
      Turbio: false,
      NoAplica: false,
      Color: res.txtColorEf ?? 'AMARILLO CLARO',
      Aspecto: res.txtAspectoEf ?? 'TRANSPARENTE',
      Densidad: res.txtDensidadEf ?? "",
      PH: res.txtPhEf ?? "",
      // Examen Químico
      Nitritos: res.txtNitritosEq ?? 'NEGATIVO',
      Proteínas: res.txtProteinasEq ?? 'NEGATIVO',
      Cetonas: res.txtCetonasEq ?? 'NEGATIVO',
      LeucocitosQ: res.txtLeucocitosEq ?? 'NEGATIVO',
      AcAscorbico: res.txtAcAscorbico ?? 'NEGATIVO',
      Urobilinogeno: res.txtUrobilinogenoEq ?? 'NEGATIVO',
      Bilirrubina: res.txtBilirrubinaEq ?? 'NEGATIVO',
      GlucosaQ: res.txtGlucosaEq ?? 'NEGATIVO',
      Sangre: res.txtSangreEq ?? 'NEGATIVO',
      // Sedimento
      LeucocitosS: res.txtLeucocitosSu ?? '0-0',
      Hematies: res.txtHematiesSu ?? '0-1',
      CelEpiteliales: res.txtCelEpitelialesSu ?? 'ESCASAS',
      Cristales: res.txtCristalesSu ?? 'NO SE OBSERVAN',
      Cilindros: res.txtCilindrosSu ?? 'NO SE OBSERVAN',
      Bacterias: res.txtBacteriasSu ?? 'NO SE OBSERVAN',
      GramSC: res.txtPusSu ?? 'NO SE OBSERVAN',
      Otros: res.txtOtrosSu ?? 'NO SE OBSERVAN',
      // Drogas
      Cocaina: res.txtCocaina ?? "",
      Marihuana: res.txtMarihuana ?? "",
      ScreeningPos: false,
      ScreeningNeg: false,
      ScreeningNA: false,
      ConfirmPos: false,
      ConfirmNeg: false,
      ConfirmNA: false,
      // Observaciones
      observaciones: res.txtObservacionesLb ?? "",
    }));
    if (setSearchMedico && res.resLab) {
      setSearchMedico(res.resLab);
    }
  }
};

export const SubmitDataService = async (form, formO, token, user, limpiar) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  LoadingDefault('Registrando Datos');
  try {
    const res = await SubmitHematologia(form, formO, token, user);
    if (res.id === 1 || res.id === 0) {
      const result = await Swal.fire({
        title: 'Exito',
        text: `${res.mensaje},\n¿Desea imprimir?`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
      limpiar();
      if (result.isConfirmed) {
        await PrintHojaR(form.norden, token);
      }
    } else {
      Swal.fire('Error', 'Ocurrio un error al Registrar', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'Ocurrio un error al Registrar', 'error');
  } finally {
    Swal.close();
  }
};

export const PrintHojaR = async (nro, token) => {
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

export const VerifyTR = async (nro, tabla, token, set, setO, sede, setSearchMedico) => {
  await VerifyTRDefault(
    nro,
    tabla,
    token,
    set,
    sede,
    async () => {
      const res = await GetInfoPacDefault(nro, token, sede);
      if (res) {
        set((prev) => ({
          ...prev,
          ...res,
          paciente: res.nombresApellidos ?? "",
          empContratista: res.contrata ?? "",
        }));
      }
    },
    async () => {
      await GetInfoServicio(nro, tabla, set, setO, token, setSearchMedico, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros en Laboratorio Clinico",
          "warning"
        );
      });
    }
  );
};

export const SubmitHematologiaLabCLinico = SubmitDataService;

