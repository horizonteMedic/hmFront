import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  handleImgtoPdfDefault,
  handleSubidaMasivaImagenes,
  LoadingDefault,
  PrintHojaRDefault,
  ReadArchivosFormDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../../utils/registroOcupacionalUtils";

// nameService del examen (también lo usa Auditoría de Protocolos para abrir el reporte)
export const TABLA_RAYOS_X_TORAX_PA = "radiografia_torax";

const obtenerReporteUrl =
  "/api/v01/ct/rayosX/obtenerReporteRadiografiaTorax";
const registrarUrl =
  "/api/v01/ct/rayosX/registrarActualizarRadiografiaTorax";
const reporteConsultaUrl =
  "/api/v01/ct/rayosX/obtenerReporteFechasRadiografiaTorax";
const registrarPDF =
  "/api/v01/ct/archivos/archivoInterconsulta"


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
    onFinish,
    true
  );

  if (res) {
    set((prev) => ({
      ...prev,
      norden: res.norden ?? "",
      codRat: res.codRat ?? "",
      fechaExam: res.fechaExamen ?? "",
      dni: res.dni ?? "",

      // RadiografiaToraxReporteDTO trae `apellidos`, `sexo` y `cargo` (no `apellidosPaciente`/`sexoPaciente`/
      // `cargoPaciente`): antes los apellidos y el cargo salían vacíos y el sexo siempre "FEMENINO".
      nombres: `${res.nombres ?? ""} ${res.apellidos ?? res.apellidosPaciente ?? ""}`.trim(),
      fechaNacimiento: formatearFechaCorta(
        res.fechaNacimientoPaciente ?? ""
      ),
      lugarNacimiento: res.lugarNacimientoPaciente ?? "",
      edad: res.edad ?? "",
      sexo: (res.sexo ?? res.sexoPaciente) === "M" ? "MASCULINO" : "FEMENINO",
      estadoCivil: res.estadoCivilPaciente ?? "",
      nivelEstudios: res.nivelEstudioPaciente ?? "",
      nombreExamen: res.nombreExamen ?? "",

      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      ocupacion: res.ocupacionPaciente ?? "",
      cargoDesempenar: res.cargo ?? res.cargoPaciente ?? "",

      vertices: res.vertices ?? "",
      hilios: res.hilios ?? "",
      senosCostofrenicos: res.senosCostofrenicos ?? "",
      camposPulmonares: res.camposPulmonares ?? "",
      mediastinos: res.mediastinos ?? "",
      siluetaCardiovascular: res.siluetaCardiovascular ?? "",
      osteomuscular: res.osteomuscular ?? "",
      conclusiones: res.conclusionesRadiograficas ?? "", 
      conclusionesCie10: res.conclusionesCie10 ?? "",
      observaciones: res.observacionesRadiografiaTorax ?? "",

      user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

      SubirDoc: true,
      digitalizacion: res.digitalizacion,

      // Auditoría. RadiografiaToraxReporteDTO no devuelve quién registró ni fechas de registro/edición:
      // quedan vacías (la sección las muestra como "—"). Si el backend las agrega, se leen solas.
      userRegistro: res.userRegistro ?? res.usuarioRegistro ?? "",
      fechaRegistro: res.fechaRegistro ?? "",
      usuarioActualizacion: res.usuarioActualizacion ?? "",
      fechaActualizacion: res.fechaActualizacion ?? "",
      tieneRegistro: true,
    }));
  }
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

// ===== Mapeo: Body =====
// RadiografiaToraxDTO usa `userRegistro` para el usuario que registra y NO tiene campos de fecha de registro /
// actualización, así que no se sella auditoría (sellarAuditoria agregaría campos que el DTO no declara). El
// reporte (GET) tampoco devuelve el creador: se manda el usuario en sesión, como siempre.
const construirBody = (form, user) => ({
  codRat: form.codRat,
  norden: form.norden,
  edad: form.edad,
  fechaExamen: form.fechaExam,
  vertices: form.vertices,
  hilios: form.hilios,
  senosCostofrenicos: form.senosCostofrenicos,
  camposPulmonares: form.camposPulmonares,
  mediastinos: form.mediastinos,
  siluetaCardiovascular: form.siluetaCardiovascular,
  osteomuscular: form.osteomuscular,
  conclusionesRadiograficas: form.conclusiones,
  conclusionesCie10: form.conclusionesCie10,
  observacionesRadiografiaTorax: form.observaciones,
  userRegistro: user,
  usuarioFirma: form.user_medicoFirma,
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

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob(
    "../../../../../jaspers/RayosX/*.jsx"
  );

  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/RayosX"
  );
};

// `silencioso`: al encontrar un registro existente solo cierra el "Validando datos", sin el aviso de
// "ya cuenta con registros" (formulario incrustado, donde el estado del registro ya se ve en pantalla).
// verificarRegistro valida la sede del N° Orden y decide nuevo / existente.
export const VerifyTR = async (nro, tabla, token, set, sede, { silencioso = false } = {}) =>
  verificarRegistro({
    nro,
    tabla,
    token,
    sede,
    onNuevo: () => GetInfoPac(nro, set, token, sede),
    onExistente: () =>
      GetInfoServicio(nro, tabla, set, token, () => {
        if (silencioso) {
          Swal.close();
          return;
        }
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Rayos X Tórax.",
          "warning"
        );
      }),
  });

const GetInfoPac = async (nro, set, token, sede) => {
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
    fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
    edad: res.edad ?? "",
    ocupacion: res.areaO ?? "",
    nombreExamen: res.nomExam ?? "",
    cargoDesempenar: res.cargo ?? "",
    lugarNacimiento: res.lugarNacimiento ?? "",
    sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
    tieneRegistro: false,
  }));
};

export const getInfoTabla = (nombreSearch, codigoSearch, setData, token) => {
  getFetch(
    `/api/v01/ct/rayosX/obtenerRadiografiaToraxPorFiltros?${codigoSearch ? `nOrden=${codigoSearch}` : ""
    }${nombreSearch ? `&nombres=${nombreSearch}` : ""}`,
    token
  ).then(setData);
};

export const PrintConsultaEjecutada = async (
  inicio,
  fin,
  token,
  datosFooter
) => {
  const jasperModules = import.meta.glob(
    "../../../../../jaspers/RayosX/*.jsx"
  );

  const res = await getFetch(
    `${reporteConsultaUrl}?inicio=${inicio}&fin=${fin}`,
    token
  );

  if (res?.nameJasper) {
    const modulo = await jasperModules[
      `../../../../../jaspers/RayosX/${res.nameJasper}.jsx`
    ]();

    if (typeof modulo.default === "function") {
      modulo.default({ ...res, ...datosFooter });
    }
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

export const handleSubirArchivo = async (form, selectedSede, userlogued, token, nomenclatura) => {
  handleImgtoPdfDefault(form, selectedSede, registrarPDF, userlogued, token, nomenclatura)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
  ReadArchivosFormDefault(form, setVisualerOpen, token)
}

export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token, nomenclatura) => {
  handleSubidaMasivaImagenes(form, selectedSede, registrarPDF, userlogued, token, nomenclatura)
}