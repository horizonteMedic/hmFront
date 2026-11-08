import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
} from "../../../../../utils/functionUtils";
import { getHoraActual } from "../../../../../utils/helpers";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../../utils/registroOcupacionalUtils";

// PENDIENTE BACKEND: estos endpoints aún no existen.
const obtenerReporteUrl =
  "/api/v01/ct/rayosX/obtenerReporteConsentimientoRayosXGeneral";
const registrarUrl =
  "/api/v01/ct/rayosX/registrarActualizarConsentimientoRayosXGeneral";

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
      ...res,
      userRegistro: res.userRegistro ?? res.usuarioRegistro ?? "",
      fechaRegistro: res.fechaRegistro ?? "",
      usuarioActualizacion: res.usuarioActualizacion ?? "",
      fechaActualizacion: res.fechaActualizacion ?? "",
      tieneRegistro: true,
    }));
  }
};

// verificarRegistro valida la sede del N° Orden y decide nuevo / existente.
export const VerifyTR = async (nro, tabla, token, set, sede) =>
  verificarRegistro({
    nro,
    tabla,
    token,
    sede,
    onNuevo: () => GetInfoPac(nro, set, token, sede),
    onExistente: () =>
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Consentimiento.",
          "warning"
        );
      }),
  });

const datosCompletos = async (form) => {
  if (!form.norden || !form.fecha) {
    await Swal.fire("Error", "Datos incompletos", "error");
    return false;
  }
  return true;
};

// ===== Mapeo: Body =====
const construirBody = (form, user) => ({
  norden: form.norden,
  fecha: form.fecha,
  hora: getHoraActual(),
  userRegistro: user,
});

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
  if (!(await datosCompletos(form))) return;
  await guardarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
  });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
  if (!(await datosCompletos(form))) return;
  await actualizarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
  });
};

// El backend debe devolver nameJasper = "ConsentimientoRayosXGeneral_Digitalizado".
export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob(
    "../../../../../jaspers/RayosX/consentimientoRayosX/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/RayosX/consentimientoRayosX"
  );
};

export const GetInfoPac = async (nro, set, token, sede) => {
  const res = await GetInfoPacDefault(nro, token, sede);

  // Norden inexistente / paciente no encontrado / error del backend.
  if (!res || res.error || !res.nombresApellidos) {
    Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
      html: `No se encontró ningún registro con el N° Orden ${nro}.`,
    });
    return;
  }

  set((prev) => ({
    ...prev,
    ...res,
    nombres: res.nombresApellidos ?? "",
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
    tieneRegistro: false,
  }));
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
