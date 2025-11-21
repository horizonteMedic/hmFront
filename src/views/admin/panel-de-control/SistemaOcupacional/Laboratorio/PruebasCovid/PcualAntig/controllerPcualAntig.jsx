import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";

const sintomasList = [
  'Tos', 'Dolor de garganta', 'Congestión nasal', 'Dificultad respiratoria',
  'Fiebre/Escalofrío', 'Malestar general', 'Pérdida olfato o gusto',
  'Diarrea', 'Náuseas/vómitos', 'Cefalea', 'Irritabilidad/confusión',
  'Dolor', 'Expectoración'
];

const obtenerReporteUrl = "/api/v01/ct/pruebasCovid/obtenerReporteExamenInmunologico";
const registrarUrl = "/api/v01/ct/pruebasCovid/registrarActualizarExamenInmunologico";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish
  );
  if (res) {
    const observacionesRaw = res.txtObservaciones || '';

    // Normaliza: quita guiones, espacios y pasa a minúsculas
    const observacionesNormalizadas = observacionesRaw
      .split('\n')
      .map(linea => linea.replace(/^-\s*/, '').trim().toLowerCase());

    // Normaliza la lista de síntomas también
    const sintomasMarcados = sintomasList.filter(sintoma => {
      const sintomaNorm = sintoma.trim().toLowerCase();
      return observacionesNormalizadas.some(obs => obs === sintomaNorm);
    });

    set((prev) => ({
      ...prev,
      norden: res.norden ?? "",
      fecha: res.fechaExamen ?? prev.fecha,
      nombres: res.nombres ?? prev.nombres,
      dni: res.dni ?? prev.dni,
      edad: res.edad ?? prev.edad,
      marca: res.cboMarca ?? "",
      doctor: res.medico ?? "N/A",
      positivo: res.chkIgmReactivo === true ? true : false,
      negativo: res.chkIggReactivo === true ? true : false,
      fechaSintomas: res.fechaSintomas ?? prev.fechaSintomas,
      marsa: res.formatoMarsa ?? false,
      observaciones: res.txtObservaciones ?? "",
      sintomas: sintomasMarcados,
    }));
  }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  const body = {
    norden: form.norden,
    chkIgmReactivo: form.positivo === true ? true : false,
    chkIggReactivo: form.negativo === true ? true : false,
    fechaExamen: form.fecha,
    cuantitativoAntigeno: false,
    cboMarca: form.marca,
    txtObservaciones: form.observaciones,
    fechaSintomas: form.fechaSintomas,
    formatoMarsa: form.marsa,
    user_registro: user,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/Covid/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/Covid"
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
          "Este paciente ya cuenta con registros de Prueba Cualitativa de Antígenos.",
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
      dni: res.dni ?? "",
      edad: res.edad ?? "",
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

