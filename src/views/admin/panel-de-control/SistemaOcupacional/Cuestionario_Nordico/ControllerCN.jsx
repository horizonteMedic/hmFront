import Swal from "sweetalert2";
import { getFetch } from "../../getFetch/getFetch";
import { URLAzure } from "../../../../config/config";
import { sellarAuditoria } from "../../../../utils/auditoriaUtils";
import { convertirGenero } from "../../../../utils/helpers";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import {
  handleSubidaMasiva,
  handleSubirArchivoDefaultSinSellos,
  ReadArchivosFormDefault,
} from "../../../../utils/functionUtils";

// ===== Configuración =====
const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta";
const obtenerReporteUrl =
  "/api/v01/ct/cuestionarioNordico/obtenerReporteCuestionarioNordico";
const registrarUrl =
  "/api/v01/ct/cuestionarioNordico/registrarActualizarCuestionarioNordico";
const existenciaUrl = "/api/v01/ct/consentDigit/existenciaExamenes";
const infoPacienteUrl = "/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros";

// Reporte Jasper. El glob debe ser un literal para que Vite lo resuelva en build.
const jasperModules = import.meta.glob(
  "../../../../jaspers/Cuestionario_Nordico/*.jsx"
);

const Loading = (text) => {
  Swal.fire({
    title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
    html: `<div style="font-size:1.1em;"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
    icon: "info",
    background: "#f0f6ff",
    color: "#22223b",
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    customClass: {
      popup: "swal2-border-radius",
      title: "swal2-title-custom",
      htmlContainer: "swal2-html-custom",
    },
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// ===== Verificación por N° Orden =====
// existenciaExamenes → id === 0: registro NUEVO (datos del paciente).
//                    → id !== 0: registro EXISTENTE (se carga para ver/editar).
export const VerifyTR = async (nro, tabla, token, set, sede) => {
  if (!nro) {
    await Swal.fire("Error", "Debe Introducir un N° Orden válido", "error");
    return;
  }
  Loading("Validando datos");
  const res = await getFetch(
    `${existenciaUrl}?nOrden=${nro}&nomService=${tabla}`,
    token
  );
  if (!res || res.error) {
    Swal.fire(
      "Norden no encontrado",
      `No se encontraron registros para el N° Orden ${nro}.`,
      "warning"
    );
    return;
  }
  if (res.id === 0) {
    GetInfoPac(nro, set, token, sede);
  } else {
    GetInfoCuestionarioNordic(nro, tabla, set, token);
  }
};

// ===== Mapeo: Registro nuevo (datos del paciente) =====
export const GetInfoPac = (nro, set, token, sede) => {
  getFetch(`${infoPacienteUrl}?nOrden=${nro}&nomSede=${sede}`, token)
    .then((res) => {
      if (!res || res.error) return;
      set((prev) => ({
        ...prev,
        ...res,
        norden: res.norden ?? prev.norden,
        // Datos personales
        nombres: res.nombresApellidos ?? "",
        dni: res.dni ?? "",
        edad: res.edad ?? "",
        sexo: convertirGenero(res.genero),
        fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
        lugarNacimiento: res.lugarNacimiento ?? "",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudios ?? "",
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.areaO ?? "",
        cargoDesempenar: res.cargo ?? "",
        tieneRegistro: false,
      }));
    })
    .finally(() => {
      Swal.close();
    });
};

// ===== Mapeo: Edición (registro existente) =====
export const GetInfoCuestionarioNordic = (nro, tabla, set, token) => {
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (!res || res.error || !res.norden) {
        Swal.fire("Error", "Ocurrió un error al traer los datos", "error");
        return;
      }
      set((prev) => ({
        ...prev,
        // Trae los ~180 booleanos del cuestionario tal cual (mismos nombres en form y respuesta).
        ...res,
        norden: res.norden ?? prev.norden,
        codigoCuestionario: res.codigoCuestionario ?? null,
        fechaCuestionario: res.fechaCuestionario ?? prev.fechaCuestionario,
        // Datos personales (defensivo: el nombre de campo varía según el backend).
        nombres: res.nombres ?? res.nombresApellidos ?? "",
        dni: res.dni ?? res.dniPaciente ?? "",
        edad: res.edad ?? "",
        sexo: convertirGenero(res.genero ?? res.sexo),
        fechaNacimiento: formatearFechaCorta(
          res.fechaNacimientoPaciente ?? res.fechaNac ?? ""
        ),
        lugarNacimiento: res.lugarNacimientoPaciente ?? res.lugarNacimiento ?? "",
        estadoCivil: res.estadoCivilPaciente ?? res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? res.nivelEstudios ?? "",
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? res.areaO ?? "",
        cargoDesempenar: res.cargo ?? res.cargoPaciente ?? "",
        // Médico que certifica
        user_medicoFirma: res.usuarioFirma
          ? res.usuarioFirma
          : prev.user_medicoFirma,
        // Auditoría REAL (defensivo). Se guarda cruda; la vista la formatea.
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? res.usuarioRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
        SubirDoc: true,
      }));
    })
    .finally(() => {
      Swal.close();
    });
};

// ===== Mapeo: Body base (campos propios del cuestionario, sin auditoría) =====
const construirBase = (data) => ({
  codigoCuestionario: data.codigoCuestionario ? data.codigoCuestionario : null,
  norden: data.norden,
  edad: data.edad,
  horasTrabajadas: data.horasTrabajadas,
  meses: data.meses,
  anios: data.anios,
  esDiestro: data.esDiestro,
  esZurdo: data.esZurdo,
  cuelloNo: data.cuelloNo,
  cuelloSi: data.cuelloSi,
  pregunta1CuelloNo: data.pregunta1CuelloNo,
  pregunta1CuelloSi: data.pregunta1CuelloSi,
  pregunta2CuelloNo: data.pregunta2CuelloNo,
  pregunta2CuelloSi: data.pregunta2CuelloSi,
  hombrosNo: data.hombrosNo,
  hombroDerechoSi: data.hombroDerechoSi,
  hombroIzquierdoSi: data.hombroIzquierdoSi,
  ambosHombrosSi: data.ambosHombrosSi,
  pregunta1HombrosNo: data.pregunta1HombrosNo,
  pregunta1HombrosSi: data.pregunta1HombrosSi,
  pregunta2HombrosNo: data.pregunta2HombrosNo,
  pregunta2HombrosSi: data.pregunta2HombrosSi,
  codosNo: data.codosNo,
  codoDerechoSi: data.codoDerechoSi,
  codoIzquierdoNo: data.codoIzquierdoNo,
  ambosCodosSi: data.ambosCodosSi,
  pregunta1CodosNo: data.pregunta1CodosNo,
  pregunta1CodosSi: data.pregunta1CodosSi,
  pregunta2CodosNo: data.pregunta2CodosNo,
  pregunta2CodosSi: data.pregunta2CodosSi,
  munecaNo: data.munecaNo,
  munecaDerechaSi: data.munecaDerechaSi,
  munecaIzquierdaSi: data.munecaIzquierdaSi,
  ambasMunecasSi: data.ambasMunecasSi,
  pregunta1MunecasNo: data.pregunta1MunecasNo,
  pregunta1MunecasSi: data.pregunta1MunecasSi,
  pregunta2MunecasNo: data.pregunta2MunecasNo,
  pregunta2MunecasSi: data.pregunta2MunecasSi,
  espaldaAltaToraxNo: data.espaldaAltaToraxNo,
  espaldaBajaLumbarNo: data.espaldaBajaLumbarNo,
  caderasOMuslosNo: data.caderasOMuslosNo,
  rodillasNo: data.rodillasNo,
  tobillosOPiesNo: data.tobillosOPiesNo,
  pregunta1EspaldaAltaToraxNo: data.pregunta1EspaldaAltaToraxNo,
  pregunta1EspaldaBajaLumbarNo: data.pregunta1EspaldaBajaLumbarNo,
  pregunta1CaderasOMuslosNo: data.pregunta1CaderasOMuslosNo,
  pregunta1RodillasNo: data.pregunta1RodillasNo,
  pregunta1TobillosOPiesNo: data.pregunta1TobillosOPiesNo,
  pregunta2EspaldaAltaToraxNo: data.pregunta2EspaldaAltaToraxNo,
  pregunta2EspaldaBajaLumbarNo: data.pregunta2EspaldaBajaLumbarNo,
  pregunta2CaderasOMuslosNo: data.pregunta2CaderasOMuslosNo,
  pregunta2RodillasNo: data.pregunta2RodillasNo,
  pregunta2TobillosOPiesNo: data.pregunta2TobillosOPiesNo,
  espaldaAltaToraxSi: data.espaldaAltaToraxSi,
  espaldaBajaLumbarSi: data.espaldaBajaLumbarSi,
  caderasOMuslosSi: data.caderasOMuslosSi,
  rodillasSi: data.rodillasSi,
  tobillosOPiesSi: data.tobillosOPiesSi,
  pregunta1EspaldaAltaToraxSi: data.pregunta1EspaldaAltaToraxSi,
  pregunta1EspaldaBajaLumbarSi: data.pregunta1EspaldaBajaLumbarSi,
  pregunta1CaderasOMuslosSi: data.pregunta1CaderasOMuslosSi,
  pregunta1RodillasSi: data.pregunta1RodillasSi,
  pregunta1TobillosOPiesSi: data.pregunta1TobillosOPiesSi,
  pregunta2EspaldaAltaToraxSi: data.pregunta2EspaldaAltaToraxSi,
  pregunta2EspaldaBajaLumbarSi: data.pregunta2EspaldaBajaLumbarSi,
  pregunta2CaderasOMuslosSi: data.pregunta2CaderasOMuslosSi,
  pregunta2RodillasSi: data.pregunta2RodillasSi,
  pregunta2TobillosOPiesSi: data.pregunta2TobillosOPiesSi,
  pregunta1EspaldaBajaNo: data.pregunta1EspaldaBajaNo,
  pregunta2EspaldaBajaNo: data.pregunta2EspaldaBajaNo,
  pregunta3EspaldaBajaNo: data.pregunta3EspaldaBajaNo,
  pregunta5AEspaldaBajaNo: data.pregunta5AEspaldaBajaNo,
  pregunta5BEspaldaBajaNo: data.pregunta5BEspaldaBajaNo,
  pregunta7EspaldaBajaNo: data.pregunta7EspaldaBajaNo,
  pregunta8EspaldaBajaNo: data.pregunta8EspaldaBajaNo,
  pregunta1EspaldaBajaSi: data.pregunta1EspaldaBajaSi,
  pregunta2EspaldaBajaSi: data.pregunta2EspaldaBajaSi,
  pregunta3EspaldaBajaSi: data.pregunta3EspaldaBajaSi,
  pregunta5AEspaldaBajaSi: data.pregunta5AEspaldaBajaSi,
  pregunta5BEspaldaBajaSi: data.pregunta5BEspaldaBajaSi,
  pregunta7EspaldaBajaSi: data.pregunta7EspaldaBajaSi,
  pregunta8EspaldaBajaSi: data.pregunta8EspaldaBajaSi,
  pregunta4AEspaldaBaja: data.pregunta4AEspaldaBaja,
  pregunta4BEspaldaBaja: data.pregunta4BEspaldaBaja,
  pregunta4CEspaldaBaja: data.pregunta4CEspaldaBaja,
  pregunta4DEspaldaBaja: data.pregunta4DEspaldaBaja,
  pregunta4EEspaldaBaja: data.pregunta4EEspaldaBaja,
  pregunta6AEspaldaBaja: data.pregunta6AEspaldaBaja,
  pregunta6BEspaldaBaja: data.pregunta6BEspaldaBaja,
  pregunta6CEspaldaBaja: data.pregunta6CEspaldaBaja,
  pregunta6DEspaldaBaja: data.pregunta6DEspaldaBaja,
  pregunta1ProblemasHombrosNo: data.pregunta1ProblemasHombrosNo,
  pregunta3ProblemasHombrosNo: data.pregunta3ProblemasHombrosNo,
  pregunta6AProblemasHombrosNo: data.pregunta6AProblemasHombrosNo,
  pregunta6BProblemasHombrosNo: data.pregunta6BProblemasHombrosNo,
  pregunta8ProblemasHombrosNo: data.pregunta8ProblemasHombrosNo,
  pregunta1ProblemasHombrosSi: data.pregunta1ProblemasHombrosSi,
  pregunta3ProblemasHombrosSi: data.pregunta3ProblemasHombrosSi,
  pregunta6AProblemasHombrosSi: data.pregunta6AProblemasHombrosSi,
  pregunta6BProblemasHombrosSi: data.pregunta6BProblemasHombrosSi,
  pregunta8ProblemasHombrosSi: data.pregunta8ProblemasHombrosSi,
  pregunta2ProblemasHombrosNo: data.pregunta2ProblemasHombrosNo,
  pregunta2ProblemasHombroDerechoSi: data.pregunta2ProblemasHombroDerechoSi,
  pregunta2ProblemasHombroIzquierdoSi: data.pregunta2ProblemasHombroIzquierdoSi,
  pregunta2ProblemasAmbosHombros: data.pregunta2ProblemasAmbosHombros,
  pregunta4ProblemasHombrosNo: data.pregunta4ProblemasHombrosNo,
  pregunta4ProblemasHombroDerechoSi: data.pregunta4ProblemasHombroDerechoSi,
  pregunta4ProblemasHombroIzquierdoSi: data.pregunta4ProblemasHombroIzquierdoSi,
  pregunta4ProblemasAmbosHombros: data.pregunta4ProblemasAmbosHombros,
  pregunta5AProblemasHombros: data.pregunta5AProblemasHombros,
  pregunta5BProblemasHombros: data.pregunta5BProblemasHombros,
  pregunta5CProblemasHombros: data.pregunta5CProblemasHombros,
  pregunta5DProblemasHombros: data.pregunta5DProblemasHombros,
  pregunta7AProblemasHombros: data.pregunta7AProblemasHombros,
  pregunta7BProblemasHombros: data.pregunta7BProblemasHombros,
  pregunta7CProblemasHombros: data.pregunta7CProblemasHombros,
  pregunta7DProblemasHombros: data.pregunta7DProblemasHombros,
  pregunta9ProblemasHombrosNo: data.pregunta9ProblemasHombrosNo,
  pregunta9ProblemasHombroDerechoSi: data.pregunta9ProblemasHombroDerechoSi,
  pregunta9ProblemasHombroIzquierdoSi: data.pregunta9ProblemasHombroIzquierdoSi,
  pregunta9ProblemasAmbosHombros: data.pregunta9ProblemasAmbosHombros,
  pregunta1ProblemasCuelloNo: data.pregunta1ProblemasCuelloNo,
  pregunta2ProblemasCuelloNo: data.pregunta2ProblemasCuelloNo,
  pregunta3ProblemasCuelloNo: data.pregunta3ProblemasCuelloNo,
  pregunta5AProblemasCuelloNo: data.pregunta5AProblemasCuelloNo,
  pregunta5BProblemasCuelloNo: data.pregunta5BProblemasCuelloNo,
  pregunta7ProblemasCuelloNo: data.pregunta7ProblemasCuelloNo,
  pregunta8ProblemasCuelloNo: data.pregunta8ProblemasCuelloNo,
  pregunta1ProblemasCuelloSi: data.pregunta1ProblemasCuelloSi,
  pregunta2ProblemasCuelloSi: data.pregunta2ProblemasCuelloSi,
  pregunta3ProblemasCuelloSi: data.pregunta3ProblemasCuelloSi,
  pregunta5AProblemasCuelloSi: data.pregunta5AProblemasCuelloSi,
  pregunta5BProblemasCuelloSi: data.pregunta5BProblemasCuelloSi,
  pregunta7ProblemasCuelloSi: data.pregunta7ProblemasCuelloSi,
  pregunta8ProblemasCuelloSi: data.pregunta8ProblemasCuelloSi,
  pregunta4AProblemasCuello: data.pregunta4AProblemasCuello,
  pregunta4BProblemasCuello: data.pregunta4BProblemasCuello,
  pregunta4CProblemasCuello: data.pregunta4CProblemasCuello,
  pregunta4DProblemasCuello: data.pregunta4DProblemasCuello,
  pregunta4EProblemasCuello: data.pregunta4EProblemasCuello,
  pregunta6AProblemasCuello: data.pregunta6AProblemasCuello,
  pregunta6BProblemasCuello: data.pregunta6BProblemasCuello,
  pregunta6CProblemasCuello: data.pregunta6CProblemasCuello,
  pregunta6DProblemasCuello: data.pregunta6DProblemasCuello,
  fechaCuestionario: data.fechaCuestionario,
  usuarioFirma: data.user_medicoFirma,
});

// Body completo (creación / actualización): base + sello de auditoría estándar.
// El backend de Cuestionario Nórdico espera la clave "userRegistro" (default de
// sellarAuditoria). En la actualización se reenvía el creador original y, si el
// backend no lo devolvió, se usa el usuario en sesión para no vaciar la columna.
const construirBody = (data, user) =>
  sellarAuditoria(construirBase(data), {
    user,
    esActualizacion: Boolean(data.codigoCuestionario),
    userRegistro: data.userRegistro || user,
    fechaRegistro: data.fechaRegistro,
  });

// ===== Registrar / Actualizar (fetch) =====
export function SubmitCuestionarioNordicoJS(data, user, token) {
  const body = construirBody(data, user);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };
  return fetch(`${URLAzure}${registrarUrl}`, options)
    .then((res) => {
      if (!res.ok) {
        return res;
      }
      return res.json();
    })
    .then((response) => response);
}

// ===== Guardar / Actualizar (orquestación + Swal) =====
export const SubmitCuestionarioNordic = async (form, token, user, limpiar, tabla) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  SubmitCuestionarioNordicoJS(form, user, token)
    .then((res) => {
      if (res.id === 1 || res.id === 0) {
        Swal.fire({
          title: "Éxito",
          text: `${res.mensaje ?? ""},\n¿Desea imprimir?`,
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          limpiar();
          if (result.isConfirmed) {
            PrintHojaR(form.norden, token, tabla);
          }
        });
      } else {
        Swal.fire("Error", "Ocurrió un error al Registrar", "error");
      }
    })
    .catch(() => {
      Swal.fire("Error", "Ocurrió un error al Registrar", "error");
    });
};

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then(async (res) => {
      if (res && res.norden) {
        const nombre = res.nameJasper;
        const loader =
          jasperModules[
            `../../../../jaspers/Cuestionario_Nordico/${nombre}.jsx`
          ];
        if (!loader) {
          console.error(`Jasper no encontrado: ${nombre}`);
          Swal.fire("Error", "No se encontró el formato de impresión.", "error");
          return;
        }
        const modulo = await loader();
        if (typeof modulo.default === "function") {
          modulo.default(res);
        } else {
          console.error(
            `El archivo ${nombre}.jsx no exporta una función por defecto`
          );
        }
      }
      Swal.close();
    })
    .catch(() => Swal.close());
};

// ===== Subida de documento escaneado =====
export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
  handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token);
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
  ReadArchivosFormDefault(form, setVisualerOpen, token);
};

export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token) => {
  handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token);
};
