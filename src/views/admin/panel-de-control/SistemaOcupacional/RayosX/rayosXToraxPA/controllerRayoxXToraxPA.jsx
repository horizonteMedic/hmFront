import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

const obtenerReporteUrl =
  "/api/v01/ct/rayosX/obtenerReporteRadiografiaTorax";
const registrarUrl =
  "/api/v01/ct/rayosX/registrarActualizarRadiografiaTorax";
const reporteConsultaUrl =
  "/api/v01/ct/rayosX/obtenerReporteFechasRadiografiaTorax";

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
      codRat: res.codRat ?? "",
      fechaExam: res.fechaExamen ?? "",
      dni: res.dni ?? "",

      nombres: `${res.nombres ?? ""} ${res.apellidosPaciente ?? ""}`,
      fechaNacimiento: formatearFechaCorta(
        res.fechaNacimientoPaciente ?? ""
      ),
      lugarNacimiento: res.lugarNacimientoPaciente ?? "",
      edad: res.edad ?? "",
      sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
      estadoCivil: res.estadoCivilPaciente ?? "",
      nivelEstudios: res.nivelEstudioPaciente ?? "",

      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      ocupacion: res.ocupacionPaciente ?? "",
      cargoDesempenar: res.cargoPaciente ?? "",

      vertices: res.vertices ?? "",
      hilios: res.hilios ?? "",
      senosCostofrenicos: res.senosCostofrenicos ?? "",
      camposPulmonares: res.camposPulmonares ?? "",
      mediastinos: res.mediastinos ?? "",
      siluetaCardiovascular: res.siluetaCardiovascular ?? "",
      osteomuscular: res.osteomuscular ?? "",
      conclusiones: res.conclusionesRadiograficas ?? "",
      observaciones: res.observacionesRadiografiaTorax ?? "",

      user_medicoFirma: res.usuarioFirma,
    }));
  }
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
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
    observacionesRadiografiaTorax: form.observaciones,
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
      GetInfoPac(nro, set, token, sede);
    },
    () => {
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Rayos X Tórax.",
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
