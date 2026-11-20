import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch";
import { GetInfoPacDefault, LoadingDefault } from "../../../../../utils/functionUtils";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../../utils/registroOcupacionalUtils";

//===============Zona Modificación===============
// nameService del examen (también lo usa Auditoría de Protocolos para abrir el reporte)
export const TABLA_CUESTIONARIO_AUDIOMETRIA = "cuestionario_audiometria";

const obtenerReporteUrl =
  "/api/v01/ct/audiometria/obtenerReporteCuestionarioAudiometria";
const registrarUrl =
  "/api/v01/ct/audiometria/registrarActualizarCuestionarioAudiometria";

// ===== Mapeo Edición =====
export const GetInfoServicioEditar = (nro, tabla, set, token, onFinish = () => { }) => {
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        set((prev) => ({
          ...prev,
          ...res,

          nombres: res.nombres,
          edad: res.edad,
          norden: res.norden,
          dni: res.dni,
          genero: res.sexo === "M" ? "Masculino" : "Femenino",
          codCuestionario: res.codCuestionario,
          fecha: res.fechaCuestionario,
          p1: res.chksi1 ? "SI" : "NO",
          p1_cual: res.txtrcual1,
          p1_cuando: res.txtrcuando1,
          p1_quehizo: res.txtrque1,

          p2: res.chksi2 ? "SI" : "NO",
          p3: res.chksi3 ? "SI" : "NO",
          p4: res.chksi4 ? "SI" : "NO",
          p5: res.chksi5 ? "SI" : "NO",
          p6: res.chksi6 ? "SI" : "NO",
          p7: res.chksi7 ? "SI" : "NO",
          p8: res.chksi8 ? "SI" : "NO",
          p9: res.chksi9 ? "SI" : "NO",

          p9_cual: res.txtrcual9,
          p9_donde: res.txtrdonde9,
          p9_quehizo: res.txtrque9,

          p10: res.chksi10 ? "SI" : "NO",

          p10_cual: res.txtrcual10,
          p10_donde: res.txtrdonde10,
          p10_quehizo: res.txtrque10,
          p11: res.chksi11 ? "SI" : "NO",
          p11_cual: res.txtrcual11,
          p11_tiempo: res.txtrcuanto11,
          p12: res.chksi12 ? "SI" : "NO",
          p12_cual: res.txtrcual12,
          p12_tiempo: res.txtrcuanto12,
          p13: res.chksi13 ? "SI" : "NO",
          p13_tiempo: res.txtrcuanto13,
          p13_cuando: res.txtrcuando13,
          p13_donde: res.txtrdonde13,
          p14: res.chksi14 ? "SI" : "NO",
          p14_cual: res.txtrcual14,
          p14_donde: res.txtrdonde14,
          p14_quehizo: res.txtrque14,
          p15: res.chksi15 ? "SI" : "NO",
          p15_cuantos: res.txtrcuantos15,
          p16_caza: res.chkcaza16,
          p16_caza_tiempo: res.txtcaza16,
          p16_tiro: res.chktiro16,
          p16_tiro_tiempo: res.txttiro16,
          p16_discoteca: res.chkdiscoteca16,
          p16_discoteca_tiempo: res.txtdiscoteca16,
          p16_auriculares: res.chkauriculares16,
          p16_auriculares_tiempo: res.txtauriculares16,
          p16_servicio: res.chkmilitar16,
          p16_servicio_tiempo: res.txtmilitar16,
          p16_boxeo: res.chkboxeo16,
          p16_boxeo_tiempo: res.txtboxeo16,

          // Auditoría. CuestionarioAudiometriaReporteDTO no devuelve quién registró ni fechas de
          // registro/edición: quedan vacías (el backend tendría que agregarlas al reporte).
          userRegistro: "",
          fechaRegistro: "",
          usuarioActualizacion: "",
          fechaActualizacion: "",
          tieneRegistro: true,
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      Swal.close();
      onFinish();
    });
};

// ===== Mapeo: Body base =====
// Campos propios del formulario (sin auditoría): el usuario que registra lo agrega sellarAuditoria.
// `usuarioFirma` no existe en CuestionarioAudiometriaDTO: se envía igual pero el backend lo ignora, por lo que
// el médico elegido en el formulario no se guarda.
const construirBase = (form) => ({
  codCuestionario: form.codCuestionario,
  norden: form.norden,
  edad: form.edad,
  fechaCuestionario: form.fecha,
  chksi1: form.p1 === "SI",
  chkno1: form.p1 === "NO",
  txtrcual1: form.p1_cual,
  txtrcuando1: form.p1_cuando,
  txtrque1: form.p1_quehizo,
  chksi2: form.p2 === "SI",
  chkno2: form.p2 === "NO",
  chksi3: form.p3 === "SI",
  chkno3: form.p3 === "NO",
  chksi4: form.p4 === "SI",
  chkno4: form.p4 === "NO",
  chksi5: form.p5 === "SI",
  chkno5: form.p5 === "NO",
  chksi6: form.p6 === "SI",
  chkno6: form.p6 === "NO",
  chksi7: form.p7 === "SI",
  chkno7: form.p7 === "NO",
  chksi8: form.p8 === "SI",
  chkno8: form.p8 === "NO",
  chksi9: form.p9 === "SI",
  chkno9: form.p9 === "NO",
  txtrcual9: form.p9_cual,
  txtrdonde9: form.p9_donde,
  txtrque9: form.p9_quehizo,
  chksi10: form.p10 === "SI",
  chkno10: form.p10 === "NO",
  txtrcual10: form.p10_cual,
  txtrdonde10: form.p10_donde,
  txtrque10: form.p10_quehizo,
  chksi11: form.p11 === "SI",
  chkno11: form.p11 === "NO",
  txtrcual11: form.p11_cual,
  txtrcuanto11: form.p11_tiempo,
  chksi12: form.p12 === "SI",
  chkno12: form.p12 === "NO",
  txtrcual12: form.p12_cual,
  txtrcuanto12: form.p12_tiempo,
  chksi13: form.p13 === "SI",
  chkno13: form.p13 === "NO",
  txtrcuanto13: form.p13_tiempo,
  txtrcuando13: form.p13_cuando,
  txtrdonde13: form.p13_donde,
  chksi14: form.p14 === "SI",
  chkno14: form.p14 === "NO",
  txtrcual14: form.p14_cual,
  txtrdonde14: form.p14_donde,
  txtrque14: form.p14_quehizo,
  chksi15: form.p15 === "SI",
  chkno15: form.p15 === "NO",
  txtrcuantos15: form.p15_cuantos,
  chkcaza16: form.p16_caza,
  txtcaza16: form.p16_caza_tiempo,
  chktiro16: form.p16_tiro,
  txttiro16: form.p16_tiro_tiempo,
  chkdiscoteca16: form.p16_discoteca,
  txtdiscoteca16: form.p16_discoteca_tiempo,
  chkauriculares16: form.p16_auriculares,
  txtauriculares16: form.p16_auriculares_tiempo,
  chkmilitar16: form.p16_servicio,
  txtmilitar16: form.p16_servicio_tiempo,
  chkboxeo16: form.p16_boxeo,
  txtboxeo16: form.p16_boxeo_tiempo,
  usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). El reporte (GET) no devuelve quién registró, así que al editar,
// si no se conoce el creador, se manda el usuario en sesión (como siempre) en vez de null para no borrarlo.
const construirBody = (form, user, esActualizacion) =>
  sellarAuditoria(construirBase(form), {
    user,
    esActualizacion,
    userRegistro: form.userRegistro || user,
    fechaRegistro: form.fechaRegistro,
  });

// El backend de este examen responde id 1 al registrar y 0 al actualizar (ambos son éxito).
const IDS_EXITO = [0, 1];

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla) =>
  guardarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla),
    idsExito: IDS_EXITO,
  });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla) =>
  actualizarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla),
    idsExito: IDS_EXITO,
  });

export const PrintHojaR = (nro, token, tabla) => {
  LoadingDefault("Cargando Formato a Imprimir");

  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        const jasperModules = import.meta.glob(
          `../../../../../jaspers/Audiometria/**/*.jsx`
        );
        const modulo = await jasperModules[
          `../../../../../jaspers/Audiometria/CuestionarioAudiometria/CuestionarioAudiometria_Digitalizado.jsx`
        ]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === "function") {
          modulo.default(res);
        } else {
          console.error(
            `El archivo CuestionarioAudiometria_Digitalizado.jsx no exporta una función por defecto`
          );
        }
      }
    })
    .finally(() => {
      Swal.close();
    });
};

//===============Fin Zona Modificación===============

// ===== Búsqueda / verificación por N° Orden =====
// verificarRegistro valida la sede y decide nuevo / existente. `silencioso`: al encontrar un registro existente solo
// cierra el "Validando datos", sin el aviso de "ya cuenta con registros" (formulario incrustado, donde el estado
// del registro ya se ve en pantalla).
export const VerifyTR = (nro, tabla, token, set, sede, { silencioso = false } = {}) =>
  verificarRegistro({
    nro,
    tabla,
    token,
    sede,
    onNuevo: () => GetInfoServicio(nro, set, token, sede),
    onExistente: () =>
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        if (silencioso) {
          Swal.close();
          return;
        }
        Swal.fire({
          icon: "warning",
          title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
          html: "Este paciente ya cuenta con registros del Cuestionario de Audiometría.",
        });
      }),
  });

// ===== Mapeo Registro nuevo =====
export const GetInfoServicio = async (nro, set, token, sede) => {
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
    nombres: res.nombresApellidos,
    genero: res.genero === "M" ? "Masculino" : "Femenino",
    tieneRegistro: false,
  }));
};
