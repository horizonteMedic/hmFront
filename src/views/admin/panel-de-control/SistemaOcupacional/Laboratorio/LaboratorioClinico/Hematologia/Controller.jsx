import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { SubmitHematograma } from "../ControllerLC/model.js";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/obtenerReporteLabHematograma";
const tabla = 'hemograma_autom';

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
      paciente: res.nombres ?? "",
      edad: res.edad ?? "",
      fecha: res.fechaExamen ?? prev.fecha,
      // Pruebas
      hemoglobina: res.txtHemoglobina ?? "",
      hematocrito: res.txtHematocrito ?? "",
      hematies: res.txtHematies ?? "",
      volumen_corpuscular_medio: res.txtVolumen ?? "",
      hemoglobina_corpuscular_media: res.txtHemocorpuscular ?? "",
      concentracion_hemoglobina_corpuscular: res.txtConcentracion ?? "",
      leucocitos: res.txtLeucocitos ?? "",
      plaquetas: res.txtPlaquetas ?? "",
      // Diferencial
      neutrofilos: res.txtNeutrofilos ?? "",
      abastonados: res.txtAbastonados ?? "",
      segmentados: res.txtSegmentados ?? "",
      monocitos: res.txtMonocitos ?? "",
      eosinofilos: res.txtEosinofios ?? "",
      basofilos: res.txtBasofilos ?? "",
      linfocitos: res.txtLinfocitos ?? "",
    }));
  }
};

export const SubmitDataService = async (form, token, user, limpiar) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  LoadingDefault('Registrando Datos');
  try {
    const res = await SubmitHematograma(form, token, user);
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
    "../../../../../../jaspers/LaboratorioClinico/*.jsx"
  );
  await PrintHojaRDefault(
    nro,
    token,
    tabla,
    null,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/LaboratorioClinico"
  );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
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
        }));
      }
    },
    async () => {
      await GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Hematología",
          "warning"
        );
      });
    }
  );
};

export const SubmitHematogramaLabClinic = SubmitDataService;
