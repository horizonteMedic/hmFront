import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  handleSubidaMasiva,
  handleSubirArchivoDefaultSinSellos,
  LoadingDefault,
  PrintHojaRDefault,
  ReadArchivosFormDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
  "/api/v01/ct/electroCardiograma/obtenerReporteInformeElectroCardiograma";
const registrarUrl =
  "/api/v01/ct/electroCardiograma/registrarActualizarInformeElectroCardiograma";
const obtenerReporteInfoTablaUrl =
  "/api/v01/ct/electroCardiograma/obtenerElectroCardiogramaPorFiltros";
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
      norden: res.norden,
      codigoElectroCardiograma: res.codigoElectroCardiograma,

      fechaExam: res.fechaInforme,

      nombreExamen: res.tipoExamen ?? "",
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
      cargoDesempenar: res.cargoPaciente ?? "",

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
      hallazgos: res.hallazgo ?? "",
      recomendaciones: res.recomendaciones ?? "",

      user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
      user_doctorAsignado: res.doctorAsignado,
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
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  const body = {
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
    conclusion: form.conclusiones,
    recomendaciones: form.recomendaciones,
    edadPaciente: form.edad,

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
    userRegistro: user,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob("../../../../jaspers/EKG/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../jaspers/EKG"
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
          "Este paciente ya cuenta con registros de EKG.",
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
      fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
      edad: res.edad,
      nombres: res.nombresApellidos,
    }));
  }
};

export const getInfoTabla = (
  nombreSearch,
  codigoSearch,
  usuario,
  setData,
  token
) => {
  try {
    getFetch(
      `${obtenerReporteInfoTablaUrl}?${codigoSearch == "" ? "" : `&nOrden=${codigoSearch}`
      }
    ${nombreSearch == "" ? "" : `&nombres=${nombreSearch}`}&usuario=${usuario}`,
      token
    ).then((res) => {
      console.log("pros", res);
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
  handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
  ReadArchivosFormDefault(form, setVisualerOpen, token)
}
export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token) => {
  handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token)
}