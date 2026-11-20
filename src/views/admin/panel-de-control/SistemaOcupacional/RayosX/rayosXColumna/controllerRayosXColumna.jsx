import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  handleImgtoPdfDefault,
  handleSubidaMasivaImagenesRXDinamico,
  handleSubirArchivoDefaultSinSellos,
  LoadingDefault,
  PrintHojaRDefault,
  ReadArchivosFormDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl =
  "/api/v01/ct/rayosX/obtenerReporteInformeRadiografico";
const registrarUrl =
  "/api/v01/ct/rayosX/registrarActualizarInformeRadiografico";
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
    onFinish
  );

  if (res) {
    set((prev) => ({
      ...prev,
      norden: res.norden ?? "",
      fechaExam: res.fechaExamen ?? "",

      // InformeRadiograficoReporteDTO trae `nombreExamen` y `fechaNac` (no `tipoExamen` ni
      // `fechaNacimientoPaciente`): antes el tipo de examen y la fecha de nacimiento salían vacíos.
      nombreExamen: res.nombreExamen ?? res.tipoExamen ?? "",
      dni: res.dni ?? "",

      nombres: res.nombres ?? "",
      fechaNacimiento: formatearFechaCorta(
        res.fechaNac ?? res.fechaNacimientoPaciente ?? ""
      ),
      lugarNacimiento: res.lugarNacimientoPaciente ?? "",
      edad: res.edad ?? "",
      sexo: res.sexo === "M" ? "MASCULINO" : "FEMENINO",
      estadoCivil: res.estadoCivilPaciente ?? "",
      nivelEstudios: res.gradoAcademico ?? "",

      // Datos laborales
      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      ocupacion: res.ocupacionPaciente ?? "",
      cargoDesempenar: res.cargo ?? "",

      // Rayos X
      tipoRadiografia: res.tipoRadio ?? "",
      informe: res.informacionGeneral ?? "",
      conclusion: res.conclusiones ?? "",
      conclusionCie10: res.conclusionCie10 ?? "",

      user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

      SubirDoc: true,
      digitalizacion: res.digitalizacion,

      // Auditoría. InformeRadiograficoReporteDTO solo devuelve la fecha de registro (`fechaRegistro`, sin hora):
      // no trae quién registró ni datos de edición (la sección los muestra como "—"). Si el backend los agrega,
      // se leen solos.
      userRegistro: res.userRegistro ?? res.usuarioRegistro ?? "",
      fechaRegistro: res.fechaRegistro ?? "",
      usuarioActualizacion: res.usuarioActualizacion ?? "",
      fechaActualizacion: res.fechaActualizacion ?? "",
      tieneRegistro: true,
    }));
  }
};

// ===== Mapeo: Body =====
// RadiografiaDTO usa `userRegistro` para el usuario que registra. Declara `fechaRegistro` como FECHA (sin hora), por
// eso no se sella auditoría (sellarAuditoria manda fecha-hora): el backend sigue manejándola como hasta ahora. El
// reporte (GET) no devuelve el creador: se manda el usuario en sesión, como siempre.
const construirBody = (form, user) => ({
  norden: form.norden,
  fechaExamen: form.fechaExam,
  tipoRadio: form.tipoRadiografia,
  informacionGeneral: form.informe,
  conclusiones: form.conclusion,
  conclusionCie10: form.conclusionCie10,
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

// verificarRegistro valida la sede del N° Orden y decide nuevo / existente.
export const VerifyTR = async (nro, tabla, token, set, sede) =>
  verificarRegistro({
    nro,
    tabla,
    token,
    sede,
    // NO tiene registro
    onNuevo: () => GetInfoPac(nro, set, token, sede),
    // SÍ tiene registro
    onExistente: () =>
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con un informe radiográfico.",
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

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
  handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token)
};

export const handleSubirArchivo2 = async (form, selectedSede, userlogued, token, nomenclatura) => {
  handleImgtoPdfDefault(form, selectedSede, registrarPDF, userlogued, token, nomenclatura)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token, nomenclatura) => {
  ReadArchivosFormDefault(form, setVisualerOpen, token, nomenclatura)
}

export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token, nomenclatura) => {
  handleSubidaMasivaImagenesRXDinamico(form, selectedSede, registrarPDF, userlogued, token, nomenclatura)
}