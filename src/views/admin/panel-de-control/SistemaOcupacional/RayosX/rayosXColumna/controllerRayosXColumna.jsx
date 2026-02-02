import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  handleImgtoPdfDefault,
  handleSubidaMasiva,
  handleSubirArchivoDefaultSinSellos,
  LoadingDefault,
  PrintHojaRDefault,
  ReadArchivosFormDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

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

      nombreExamen: res.tipoExamen ?? "",
      dni: res.dni ?? "",

      nombres: res.nombres ?? "",
      fechaNacimiento: formatearFechaCorta(
        res.fechaNacimientoPaciente ?? ""
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

      user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

      SubirDoc: true,
      digitalizacion: res.digitalizacion
    }));
  }
};

export const SubmitDataService = async (
  form,
  token,
  user,
  limpiar,
  tabla,
  datosFooter
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos incompletos", "error");
    return;
  }

  const body = {
    norden: form.norden,
    fechaExamen: form.fechaExam,
    tipoRadio: form.tipoRadiografia,
    informacionGeneral: form.informe,
    conclusiones: form.conclusion,
    userRegistro: user,

    usuarioFirma: form.user_medicoFirma,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

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

export const VerifyTR = async (nro, tabla, token, set, sede) => {
  VerifyTRDefault(
    nro,
    tabla,
    token,
    set,
    sede,
    () => {
      // NO tiene registro
      GetInfoPac(nro, set, token, sede);
    },
    () => {
      // SÍ tiene registro
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con un informe radiográfico.",
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
      fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
      edad: res.edad ?? "",
      ocupacion: res.areaO ?? "",
      nombreExamen: res.nomExam ?? "",
      cargoDesempenar: res.cargo ?? "",
      lugarNacimiento: res.lugarNacimiento ?? "",
      sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
    }));
  }
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
  handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token, nomenclatura)
}