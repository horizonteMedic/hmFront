import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  handleSubidaMasiva,
  handleSubirArchivoDefaultSinSellos,
  LoadingDefault,
  PrintHojaRDefault,
  ReadArchivosFormDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";
import { sellarAuditoria } from "../../../../utils/auditoriaUtils";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl =
  "/api/v01/ct/electroCardiograma/obtenerReporteInformeElectroCardiograma";
const registrarUrl =
  "/api/v01/ct/electroCardiograma/registrarActualizarInformeElectroCardiograma";
const obtenerReporteInfoTablaUrl =
  "/api/v01/ct/electroCardiograma/obtenerElectroCardiogramaPorFiltros";
const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
// Este examen tiene 2 formatos (2023 / Digitalizado) que el backend resuelve vía
// `nameJasper`, por eso se mantiene PrintHojaRDefault (resolución dinámica por carpeta).
const jasperModules = import.meta.glob("../../../../jaspers/EKG/*.jsx");
const rutaCarpeta = "../../../../jaspers/EKG";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
  const res = await GetInfoPacDefault(nro, token, sede);
  if (!res || res.error || !res.norden) {
    Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
      html: `No se encontró ningún registro con el N° Orden ${nro}.`,
    });
    return;
  }
  set((prev) => ({
    ...prev,
    norden: res.norden ?? "",
    nombres: res.nombresApellidos ?? "",
    fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
    lugarNacimiento: res.lugarNacimiento ?? "",
    estadoCivil: res.estadoCivil ?? "",
    nivelEstudios: res.nivelEstudios ?? "",
    edad: res.edad ?? "",
    dni: res.dni ?? "",
    sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
    empresa: res.empresa ?? "",
    contrata: res.contrata ?? "",
    ocupacion: res.areaO ?? "",
    cargoDesempenar: res.cargo ?? "",
    nombreExamen: res.nomExam ?? "",
    tieneRegistro: false,
  }));
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => {}
) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish
  );
  if (!res) return;
  set((prev) => ({
    ...prev,
    norden: res.norden,
    codigoElectroCardiograma: res.codigoElectroCardiograma,

    fechaExam: res.fechaInforme,

    nombreExamen: res.nombreExamen ?? "",
    dni: res.dni ?? "",

    nombres: res.nombres ?? "",
    fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
    lugarNacimiento: res.lugarNacimientoPaciente ?? "",
    edad: res.edad ?? "",
    sexo: res.sexo === "M" ? "MASCULINO" : "FEMENINO",
    estadoCivil: res.estadoCivilPaciente ?? "",
    nivelEstudios: res.nivelEstudioPaciente ?? "",
    // Datos Laborales
    empresa: res.empresa ?? "",
    contrata: res.contrata ?? "",
    ocupacion: res.ocupacionPaciente ?? "",
    cargoDesempenar: res.cargo ?? "",

    ritmo: res.mensajeRitmo ?? "",
    fc: res.mensajeFC ?? "",
    eje: res.mensajeEje ?? "",
    pr: res.mensajePr ?? "",
    qrs: res.mensajeQrs ?? "",
    ondaP: res.mensajeOndaP ?? "",
    st: res.mensajeSt ?? "",
    ondaT: res.mensajeOndaT ?? "",
    qtc: res.mensajeQtC ?? "",

    informeCompleto: res.informeCompleto ?? "",
    conclusiones: res.conclusion ?? "",
    conclusionesCie10: res.conclusionesCie10 ?? "",
    hallazgos: res.hallazgo ?? "",
    hallazgosCie10: res.hallazgosCie10 ?? "",
    recomendaciones: res.recomendaciones ?? "",

    user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
    user_doctorAsignado: res.doctorAsignado,
    SubirDoc: true,
    digitalizacion: res.digitalizacion,

    // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
    fechaRegistro: res.fechaRegistro ?? "",
    userRegistro: res.userRegistro ?? res.usuarioRegistro ?? "",
    fechaActualizacion: res.fechaActualizacion ?? "",
    usuarioActualizacion: res.usuarioActualizacion ?? "",
    tieneRegistro: true,
  }));
};

// Alias usado por la tabla de búsqueda del panel derecho (carga un registro existente).
export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicioEditar(nro, tabla, set, token, () => {
    Swal.close();
  });
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
  codigoElectroCardiograma: form.codigoElectroCardiograma,
  norden: form.norden,
  fechaInforme: form.fechaExam,
  informeCompleto: form.informeCompleto,
  mensajeRitmo: form.ritmo,
  mensajePr: form.pr,
  mensajeFC: form.fc,
  mensajeQtC: form.qtc,
  mensajeQrs: form.qrs,
  mensajeOndaP: form.ondaP,
  mensajeSt: form.st,
  mensajeOndaT: form.ondaT,
  mensajeEje: form.eje,
  hallazgo: form.hallazgos,
  hallazgosCie10: form.hallazgosCie10,
  conclusion: form.conclusiones,
  conclusionesCie10: form.conclusionesCie10,
  recomendaciones: form.recomendaciones,
  edadPaciente: form.edad,

  usuarioFirma: form.user_medicoFirma,
  doctorAsignado: form.user_doctorAsignado,
});

// Body completo (creación / actualización). Este módulo espera la clave "userRegistro".
const construirBody = (form, user, esActualizacion) =>
  sellarAuditoria(construirBase(form), {
    user,
    esActualizacion,
    userRegistro: form.userRegistro,
    fechaRegistro: form.fechaRegistro,
  });

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    rutaCarpeta
  );
};

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

// ===== Búsqueda / verificación por N° Orden =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
  verificarRegistro({
    nro,
    tabla,
    token,
    sede,
    onNuevo: () => GetInfoServicio(nro, set, token, sede),
    onExistente: () =>
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        Swal.fire({
          icon: "warning",
          title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
          html: "Este paciente ya cuenta con registros de EKG.",
        });
      }),
  });

export const getInfoTabla = (nombreSearch, codigoSearch, usuario, setData, token) => {
  try {
    getFetch(
      `${obtenerReporteInfoTablaUrl}?${codigoSearch == "" ? "" : `&nOrden=${codigoSearch}`}
    ${nombreSearch == "" ? "" : `&nombres=${nombreSearch}`}&usuario=${usuario}`,
      token
    ).then((res) => {
      setData(res);
    });
  } catch (error) {
    console.error("Error en getInfoTabla:", error);
    Swal.fire(
      "Error",
      "Ocurrió un error al obtener los datos de la tabla",
      "error"
    );
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
  handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token);
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
  ReadArchivosFormDefault(form, setVisualerOpen, token);
};

export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token) => {
  handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token);
};
