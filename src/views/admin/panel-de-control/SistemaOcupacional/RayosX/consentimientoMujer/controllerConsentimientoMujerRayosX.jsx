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

const obtenerReporteUrl =
  "/api/v01/ct/rayosX/obtenerReporteConsentimientoRayosX";
const registrarUrl =
  "/api/v01/ct/rayosX/registrarActualizarConsentimientoRayosX";

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
      fechaUltimaRegla: res.fechaUltimaRegla ?? "",

      // Auditoría. ConsentimientoRayosXReporteDTO solo devuelve la fecha de registro (`fechaRegistro`, sin hora):
      // no trae quién registró ni datos de edición (la sección los muestra como "—"). Si el backend los
      // agrega, se leen solos.
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

// La fecha de la última regla es obligatoria tanto al guardar como al editar.
const datosCompletos = async (form) => {
  if (!form.norden || !form.fechaUltimaRegla) {
    await Swal.fire("Error", "Datos incompletos", "error");
    return false;
  }
  return true;
};

// ===== Mapeo: Body =====
// ConsentimientoRayosXDTO usa `userRegistro` para el usuario que registra. Declara `fechaRegistro` como FECHA (sin
// hora), por eso no se sella auditoría (sellarAuditoria manda fecha-hora): el backend sigue manejándola como hasta
// ahora. El reporte (GET) no devuelve el creador: se manda el usuario en sesión, como siempre.
const construirBody = (form, user) => ({
  norden: form.norden,
  fecha: form.fecha,
  fechaUltimaRegla: form.fechaUltimaRegla,
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

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob(
    "../../../../../jaspers/RayosX/consentimientoMujer/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/RayosX/consentimientoMujer"
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
    ocupacion: res.cargo ?? "",
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
