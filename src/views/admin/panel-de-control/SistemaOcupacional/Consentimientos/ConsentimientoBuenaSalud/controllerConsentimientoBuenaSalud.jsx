import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { getHoraActual } from "../../../../../utils/helpers";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import { guardarRegistro, actualizarRegistro, validarSede } from "../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl =
  "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoBuenaSalud";
const registrarUrl =
  "/api/v01/ct/anexos/anexo16/registrarActualizarConsentimientoBuenaSalud";

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
      norden: res.norden ?? prev.norden ?? "",
      fecha: res.fecha ?? prev.fecha,
      nombres: res.nombres ?? prev.nombres ?? "",
      edad: res.edad ?? prev.edad ?? "",
      dni: res.dni ?? prev.dni ?? "",
      // Preservar el texto estático si no viene del backend
      textoFinalConsentimiento: res.textoFinalConsentimiento ?? prev.textoFinalConsentimiento ?? "",

      // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
      // OJO: este reporte devuelve el creador como `usuarioRegistro` (no `userRegistro`) y aún no trae
      // fechas de registro/edición ni usuario de edición: mientras tanto quedan vacíos.
      fechaRegistro: res.fechaRegistro ?? "",
      userRegistro: res.userRegistro ?? res.usuarioRegistro ?? "",
      fechaActualizacion: res.fechaActualizacion ?? "",
      usuarioActualizacion: res.usuarioActualizacion ?? "",
      tieneRegistro: true,
    }));
  }
};

// ===== Mapeo: Body base =====
// Campos propios del examen (sin auditoría): el usuario que registra lo agrega sellarAuditoria.
const construirBase = (form) => ({
  norden: form.norden,
  fecha: form.fecha,
  hora: getHoraActual(),
});

// Body completo (creación / actualización). ConsentimientoBuenaSaludDTO usa `userRegistro` para el usuario que
// registra. El reporte (GET) aún no devuelve la fecha de registro, así que al editar, si no se conoce el
// creador, se manda el usuario en sesión (como siempre) en vez de null para no borrarlo.
const construirBody = (form, user, esActualizacion) =>
  sellarAuditoria(construirBase(form), {
    user,
    esActualizacion,
    userRegistro: form.userRegistro || user,
    fechaRegistro: form.fechaRegistro,
  });

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

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob("../../../../../jaspers/ModuloConsentimientos/ConsentimientoBuenaSalud/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/ModuloConsentimientos/ConsentimientoBuenaSalud"
  );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
  if (!nro) {
    await Swal.fire({
      icon: "error",
      title: '<i class="fa-solid fa-keyboard"></i>Error',
      html: "Debe Introducir un N° Orden válido",
    });
    return;
  }

  Loading("Validando datos");

  // Como el resto de formularios de la plantilla: el N° Orden debe pertenecer a la sede actual.
  if (sede) {
    const { estado, descripcionSede } = await validarSede(nro, sede, token);
    if (estado === "otraSede") {
      Swal.fire({
        icon: "warning",
        title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
        html: `El N° Orden ${nro} pertenece a la sede${descripcionSede ? `: ${descripcionSede}` : ""}.`,
      });
      return;
    }
    if (estado !== "ok") {
      Swal.fire({
        icon: "error",
        title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
        html: `Verifique el número de orden ${nro} e intente nuevamente.`,
      });
      return;
    }
  }

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
          "Este paciente ya cuenta con registros de Consentimiento de Buena Salud.",
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
      nombres: res.nombresApellidos ?? prev.nombres ?? "",
      dni: res.dni ?? prev.dni ?? "",
      edad: res.edad ? `${res.edad} años` : prev.edad ?? "",
      // Preservar el texto estático
      textoFinalConsentimiento: prev.textoFinalConsentimiento ?? "",
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
