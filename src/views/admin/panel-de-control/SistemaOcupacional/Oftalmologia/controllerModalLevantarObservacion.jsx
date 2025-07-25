import Swal from "sweetalert2";
import { getFetch } from "../../getFetch/getFetch";
import { SubmitData } from "./model";

//===============Zona Modificación===============
const obtenerReporteUrl =
  "/api/v01/ct/agudezaVisual/obtenerReporteOftalmologia";
const obtenerReporteUrlLO =
  "/api/v01/ct/agudezaVisual/obtenerReporteOftalmologiaLo";
const registrarUrl =
  "/api/v01/ct/agudezaVisual/registrarActualizarOftalmologiaLo";

export const GetInfoServicio = (nro, tabla, set, token, esLO) => {
  const link = esLO ? obtenerReporteUrlLO : obtenerReporteUrl;
  getFetch(`${link}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,
          fechaNac: convertirFecha(res.fechaNac),
          empresa: res.empresa,
          contrata: res.contrata,
          nomExam: res.nomExam,
          //   codOf: res.codOf,
          visionCercaOD: res.vcercaSOd,
          visionCercaOI: res.vcercaSOi,
          visionCercaODC: res.vcercaCOd,
          visionCercaOIC: res.vcercaCOi,
          visionLejosOD: res.vlejosSOd,
          visionLejosOI: res.vlejosSOi,
          visionLejosODC: res.vlejosCOd,
          visionLejosOIC: res.vlejosCOi,
          visionColores: res.vcolores,
          visionBinocular: res.vbinocular,
          reflejosPupilares: res.rpupilares,
          enfOculares: res.eoculares,
          fechaExamen: res.fechaOf,
          presenciaPterigion: res.eoculares1,
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      Swal.close();
    });
};

export const SubmitDataService = async (
  form,
  token,
  user,
  limpiar,
  tabla,
  onclose
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = {
    norden: form.norden,
    fechaOf: form.fechaExamen,
    numTicket: null,
    vcercaSOd: form.visionCercaOD,
    vcercaSOi: form.visionCercaOI,
    vcercaCOd: form.visionCercaODC,
    vcercaCOi: form.visionCercaOIC,
    vlejosSOd: form.visionLejosOD,
    vlejosSOi: form.visionLejosOI,
    vlejosCOd: form.visionLejosODC,
    vlejosCOi: form.visionLejosOIC,
    vcolores: form.visionColores,
    vbinocular: form.visionBinocular,
    rpupilares: form.reflejosPupilares,
    eoculares: form.enfOculares,

    eoculares1: form.presenciaPterigion,
    userRegistro: user,
    userMedicoOcup: "",
  };
  SubmitData(body, registrarUrl, token).then((res) => {
    console.log(res);
    if (res.id === 1 || res.id === 0) {
      Swal.fire({
        title: "Exito",
        text: `${res.mensaje},\n¿Desea imprimir?`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        limpiar();
        onclose();
        if (result.isConfirmed) {
          PrintHojaR(form.norden, token, tabla);
        }
      });
    } else {
      Swal.fire("Error", "Ocurrio un error al Registrar", "error");
    }
  });
};

function convertirFecha(fecha) {
  if (fecha === "") return "";
  const [dia, mes, anio] = fecha.split("-");
  return `${anio}/${mes.padStart(2, "0")}/${dia.padStart(2, "0")}`;
}

//===============Fin Zona Modificación===============
export const Loading = (text) => {
  Swal.fire({
    title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
    html: `<div style=\"font-size:1.1em;\"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
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
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
  if (!nro) {
    await Swal.fire(
      "Error",
      "Debe Introducir un Nro de Historia Clinica válido",
      "error"
    );
    return;
  }
  Loading("Validando datos");
  getFetch(
    `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
    token
  ).then((res) => {
    console.log(res);
    if (res.id === 0) {
      VerifySecond(nro, "oftalmologia", token, set, sede);
    } else {
      GetInfoServicio(nro, tabla, set, token, true);
    }
  });
};

export const VerifySecond = async (nro, tabla, token, set, sede) => {
  Loading("Validando datos");
  getFetch(
    `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
    token
  ).then((res) => {
    console.log(res);
    if (res.id === 0) {
      //No tiene registro previo
      GetInfoPac(nro, set, token, sede);
    } else {
      GetInfoServicio(nro, tabla, set, token, false);
    }
  });
};

export const GetInfoPac = (nro, set, token, sede) => {
  getFetch(
    `/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,
    token
  )
    .then((res) => {
      console.log("pros", res);
      set((prev) => ({
        ...prev,
        ...res,
        fechaNac: convertirFecha(res.fechaNac),
        nombres: res.nombresApellidos,
      }));
    })
    .finally(() => {
      Swal.close();
    });
};

export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(
    `${obtenerReporteUrlLO}?nOrden=${nro}&nameService=${tabla}`, //revisar
    token
  )
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        const jasperModules = import.meta.glob(
          "../../../../jaspers/Oftalmologia/*.jsx"
        );
        const modulo = await jasperModules[
          `../../../../jaspers/Oftalmologia/${nombre}.jsx`
        ]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === "function") {
          modulo.default(res);
        } else {
          console.error(
            `El archivo ${nombre}.jsx no exporta una función por defecto`
          );
        }
      }
    })
    .finally(() => {
      Swal.close();
    });
};
