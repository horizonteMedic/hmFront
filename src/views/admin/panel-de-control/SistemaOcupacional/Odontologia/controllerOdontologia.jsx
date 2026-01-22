import Swal from "sweetalert2";
import { getFetch } from "../../getFetch/getFetch";
import { SubmitData } from "./model";

//===============Zona Modificación===============
const obtenerReporteUrl = "/api/v01/ct/odontograma/obtenerReporteOdontograma";
const obtenerReporteUrlLo =
  "/api/v01/ct/odontograma/obtenerReporteOdontogramaLo";
const registrarUrl = "/api/v01/ct/odontograma/registrarActualizarOdontograma";
const registrarUrlLo =
  "/api/v01/ct/odontograma/registrarActualizarOdontogramaLo";

const reporteConsultaUrl =
  "/api/v01/ct/odontograma/obtenerReporteOdontogramaFechas";

const labelsToImgs = {
  Ausente: "imgAusente",
  "Cariada por opturar": "imgPorOturar",
  "Por extraer": "imgExtraer",
  Fracturada: "imgFracturada",
  Corona: "imgCorona",
  "Obturacion Efectuada": "imgObturacionEfectuada",
  Puente: "imgPuente",
  "P.P.R Metalica": "imgPPRMetalica",
  "P.P.R Acrilica": "imgPPRAcrilica",
  "P.Total": "imgPTotal",
};

// Invertimos el objeto automáticamente
const imgsToLabels = Object.fromEntries(
  Object.entries(labelsToImgs).map(([label, img]) => [img, label])
);

const interpretarLabelParaRegistrar = (label) => {
  if (label == "Normal") return null;
  const prefijo = "jar:file:/C:/hmsoft/hmsoft.jar!/imagenes/odontograma/";
  const sufijo = ".png";
  const nombreArchivo = labelsToImgs[label];
  return nombreArchivo ? `${prefijo}${nombreArchivo}${sufijo}` : "";
};
const interpretarUrlParaLeer = (url) => {
  if (url == null) return "Normal";
  const match = url.match(/([^/\\]+)(?=\.png$)/);
  const nombreArchivo = match?.[1];
  return nombreArchivo ? imgsToLabels[nombreArchivo] ?? "" : "";
};

export const GetInfoServicio = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => {}
) => {
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,

          codOd: res.codOd,
          fechaExam: res.fechaOd,
          edad: res.edad + " años",

          d1: interpretarUrlParaLeer(res.lbl18),
          d2: interpretarUrlParaLeer(res.lbl17),
          d3: interpretarUrlParaLeer(res.lbl16),
          d4: interpretarUrlParaLeer(res.lbl15),
          d5: interpretarUrlParaLeer(res.lbl14),
          d6: interpretarUrlParaLeer(res.lbl13),
          d7: interpretarUrlParaLeer(res.lbl12),
          d8: interpretarUrlParaLeer(res.lbl11),

          d9: interpretarUrlParaLeer(res.lbl21),
          d10: interpretarUrlParaLeer(res.lbl22),
          d11: interpretarUrlParaLeer(res.lbl23),
          d12: interpretarUrlParaLeer(res.lbl24),
          d13: interpretarUrlParaLeer(res.lbl25),
          d14: interpretarUrlParaLeer(res.lbl26),
          d15: interpretarUrlParaLeer(res.lbl27),
          d16: interpretarUrlParaLeer(res.lbl28),

          d17: interpretarUrlParaLeer(res.lbl48),
          d18: interpretarUrlParaLeer(res.lbl47),
          d19: interpretarUrlParaLeer(res.lbl46),
          d20: interpretarUrlParaLeer(res.lbl45),
          d21: interpretarUrlParaLeer(res.lbl44),
          d22: interpretarUrlParaLeer(res.lbl43),
          d23: interpretarUrlParaLeer(res.lbl42),
          d24: interpretarUrlParaLeer(res.lbl41),

          d25: interpretarUrlParaLeer(res.lbl31),
          d26: interpretarUrlParaLeer(res.lbl32),
          d27: interpretarUrlParaLeer(res.lbl33),
          d28: interpretarUrlParaLeer(res.lbl34),
          d29: interpretarUrlParaLeer(res.lbl35),
          d30: interpretarUrlParaLeer(res.lbl36),
          d31: interpretarUrlParaLeer(res.lbl37),
          d32: interpretarUrlParaLeer(res.lbl38),

          observaciones: res.txtObservaciones || "",
          noPasoExamen: res?.txtObservaciones?.includes(
            "NO PASO EXAMEN ODONTOLOGICO"
          ),
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
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
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = {
    codOd: form.codOd,
    norden: form.norden,
    fechaOd: form.fechaExam,
    edadOd: form.edad.replace("años", ""),
    lbl18: interpretarLabelParaRegistrar(form.d1),
    lbl17: interpretarLabelParaRegistrar(form.d2),
    lbl16: interpretarLabelParaRegistrar(form.d3),
    lbl15: interpretarLabelParaRegistrar(form.d4),
    lbl14: interpretarLabelParaRegistrar(form.d5),
    lbl13: interpretarLabelParaRegistrar(form.d6),
    lbl12: interpretarLabelParaRegistrar(form.d7),
    lbl11: interpretarLabelParaRegistrar(form.d8),

    lbl21: interpretarLabelParaRegistrar(form.d9),
    lbl22: interpretarLabelParaRegistrar(form.d10),
    lbl23: interpretarLabelParaRegistrar(form.d11),
    lbl24: interpretarLabelParaRegistrar(form.d12),
    lbl25: interpretarLabelParaRegistrar(form.d13),
    lbl26: interpretarLabelParaRegistrar(form.d14),
    lbl27: interpretarLabelParaRegistrar(form.d15),
    lbl28: interpretarLabelParaRegistrar(form.d16),

    lbl31: interpretarLabelParaRegistrar(form.d25),
    lbl32: interpretarLabelParaRegistrar(form.d26),
    lbl33: interpretarLabelParaRegistrar(form.d27),
    lbl34: interpretarLabelParaRegistrar(form.d28),
    lbl35: interpretarLabelParaRegistrar(form.d29),
    lbl36: interpretarLabelParaRegistrar(form.d30),
    lbl37: interpretarLabelParaRegistrar(form.d31),
    lbl38: interpretarLabelParaRegistrar(form.d32),

    lbl41: interpretarLabelParaRegistrar(form.d24),
    lbl42: interpretarLabelParaRegistrar(form.d23),
    lbl43: interpretarLabelParaRegistrar(form.d22),
    lbl44: interpretarLabelParaRegistrar(form.d21),
    lbl45: interpretarLabelParaRegistrar(form.d20),
    lbl46: interpretarLabelParaRegistrar(form.d19),
    lbl47: interpretarLabelParaRegistrar(form.d18),
    lbl48: interpretarLabelParaRegistrar(form.d17),

    txtPiezasMalEstado: form.malEstado,
    txtAusentes: form.ausente,
    txtCariadasOturar: form.cariada,
    txtPorExtraer: form.porExtraer,
    txtFracturada: form.fracturada,
    txtObturacionesEfectuadas: form.obturacion,
    txtPuentes: form.puente,
    txtPprMetalicas: form.pprMetalica,
    txtPprAcrilicas: form.pprAcrilica,
    txtPTotal: form.pTotal,
    txtNormales: form.normal,
    txtCoronas: form.corona,
    txtObservaciones: form.observaciones,
    userRegistro: user,
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
        if (result.isConfirmed) {
          PrintHojaR(form.norden, token, tabla, datosFooter);
        }
      });
    } else {
      Swal.fire("Error", "Ocurrio un error al Registrar", "error");
    }
  });
};

export const SubmitDataServiceLO = async (
  form,
  token,
  user,
  limpiar,
  tabla,
  closeModal,
  datosFooter
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = {
    norden: form.norden,
    fechaOd: form.fechaExam,
    edadOd: form.edad.replace("años", ""),
    lbl18: interpretarLabelParaRegistrar(form.d1),
    lbl17: interpretarLabelParaRegistrar(form.d2),
    lbl16: interpretarLabelParaRegistrar(form.d3),
    lbl15: interpretarLabelParaRegistrar(form.d4),
    lbl14: interpretarLabelParaRegistrar(form.d5),
    lbl13: interpretarLabelParaRegistrar(form.d6),
    lbl12: interpretarLabelParaRegistrar(form.d7),
    lbl11: interpretarLabelParaRegistrar(form.d8),

    lbl21: interpretarLabelParaRegistrar(form.d9),
    lbl22: interpretarLabelParaRegistrar(form.d10),
    lbl23: interpretarLabelParaRegistrar(form.d11),
    lbl24: interpretarLabelParaRegistrar(form.d12),
    lbl25: interpretarLabelParaRegistrar(form.d13),
    lbl26: interpretarLabelParaRegistrar(form.d14),
    lbl27: interpretarLabelParaRegistrar(form.d15),
    lbl28: interpretarLabelParaRegistrar(form.d16),

    lbl31: interpretarLabelParaRegistrar(form.d25),
    lbl32: interpretarLabelParaRegistrar(form.d26),
    lbl33: interpretarLabelParaRegistrar(form.d27),
    lbl34: interpretarLabelParaRegistrar(form.d28),
    lbl35: interpretarLabelParaRegistrar(form.d29),
    lbl36: interpretarLabelParaRegistrar(form.d30),
    lbl37: interpretarLabelParaRegistrar(form.d31),
    lbl38: interpretarLabelParaRegistrar(form.d32),

    lbl41: interpretarLabelParaRegistrar(form.d24),
    lbl42: interpretarLabelParaRegistrar(form.d23),
    lbl43: interpretarLabelParaRegistrar(form.d22),
    lbl44: interpretarLabelParaRegistrar(form.d21),
    lbl45: interpretarLabelParaRegistrar(form.d20),
    lbl46: interpretarLabelParaRegistrar(form.d19),
    lbl47: interpretarLabelParaRegistrar(form.d18),
    lbl48: interpretarLabelParaRegistrar(form.d17),

    txtPiezasMalEstado: form.malEstado,
    txtAusentes: form.ausente,
    txtCariadasOturar: form.cariada,
    txtPorExtraer: form.porExtraer,
    txtFracturada: form.fracturada,
    txtObturacionesEfectuadas: form.obturacion,
    txtPuentes: form.puente,
    txtPprMetalicas: form.pprMetalica,
    txtPprAcrilicas: form.pprAcrilica,
    txtPTotal: form.pTotal,
    txtNormales: form.normal,
    txtCoronas: form.corona,
    txtObservaciones: form.observaciones,
    userRegistro: user,
  };
  SubmitData(body, registrarUrlLo, token).then((res) => {
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
        closeModal();
        if (result.isConfirmed) {
          PrintHojaRLO(form.norden, token, tabla, datosFooter);
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
      //No tiene registro previo
      GetInfoPac(nro, set, token, sede);
    } else {
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Odontograma.",
          "warning"
        );
      });
    }
  });
};

export const VerifyTRLO = async (nro, tabla, token, set, sede) => {
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
      //No tiene registro previo
      VerifyTR(nro, "odontograma", token, set, sede);
    } else {
      GetInfoServicioLO(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Levantamiento de Observación.",
          "warning"
        );
      });
    }
  });
};

export const GetInfoServicioLO = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => {}
) => {
  getFetch(`${obtenerReporteUrlLo}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,

          fechaExam: res.fechaOd,
          edad: res.edad + " años",
          d1: interpretarUrlParaLeer(res.lbl18),
          d2: interpretarUrlParaLeer(res.lbl17),
          d3: interpretarUrlParaLeer(res.lbl16),
          d4: interpretarUrlParaLeer(res.lbl15),
          d5: interpretarUrlParaLeer(res.lbl14),
          d6: interpretarUrlParaLeer(res.lbl13),
          d7: interpretarUrlParaLeer(res.lbl12),
          d8: interpretarUrlParaLeer(res.lbl11),

          d9: interpretarUrlParaLeer(res.lbl21),
          d10: interpretarUrlParaLeer(res.lbl22),
          d11: interpretarUrlParaLeer(res.lbl23),
          d12: interpretarUrlParaLeer(res.lbl24),
          d13: interpretarUrlParaLeer(res.lbl25),
          d14: interpretarUrlParaLeer(res.lbl26),
          d15: interpretarUrlParaLeer(res.lbl27),
          d16: interpretarUrlParaLeer(res.lbl28),

          d17: interpretarUrlParaLeer(res.lbl48),
          d18: interpretarUrlParaLeer(res.lbl47),
          d19: interpretarUrlParaLeer(res.lbl46),
          d20: interpretarUrlParaLeer(res.lbl45),
          d21: interpretarUrlParaLeer(res.lbl44),
          d22: interpretarUrlParaLeer(res.lbl43),
          d23: interpretarUrlParaLeer(res.lbl42),
          d24: interpretarUrlParaLeer(res.lbl41),

          d25: interpretarUrlParaLeer(res.lbl31),
          d26: interpretarUrlParaLeer(res.lbl32),
          d27: interpretarUrlParaLeer(res.lbl33),
          d28: interpretarUrlParaLeer(res.lbl34),
          d29: interpretarUrlParaLeer(res.lbl35),
          d30: interpretarUrlParaLeer(res.lbl36),
          d31: interpretarUrlParaLeer(res.lbl37),
          d32: interpretarUrlParaLeer(res.lbl38),

          observaciones: res.txtObservaciones || "",
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};

export const GetInfoPac = (
  nro,
  set,
  token,
  sede,
  onFinish = () => {
    Swal.close();
  }
) => {
  getFetch(
    `/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,
    token
  )
    .then((res) => {
      console.log("pros", res);
      set((prev) => ({
        ...prev,
        ...res,
        nombres: res.nombresApellidos,
        edad: res.edad + " años",
        sexo: res.genero,
      }));
    })
    .finally(() => {
      onFinish();
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, //revisar
    token
  )
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        // Buscar en subcarpetas también
        const jasperModules = import.meta.glob(
          "../../../../jaspers/Odontologia/**/*.jsx"
        );
        // Determinar la ruta según el nombre del jasper
        let rutaArchivo;
        if (nombre === "Odontograma_Digitalizado" || nombre === "Odontograma_lo_Digitalizado") {
          rutaArchivo = `../../../../jaspers/Odontologia/OdontogramaDigitalizado/${nombre}.jsx`;
        } else {
          rutaArchivo = `../../../../jaspers/Odontologia/${nombre}.jsx`;
        }
        const modulo = await jasperModules[rutaArchivo]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === "function") {
          modulo.default({ ...res, ...datosFooter });
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

export const PrintHojaRLO = (nro, token, tabla, datosFooter) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(
    `${obtenerReporteUrlLo}?nOrden=${nro}&nameService=${tabla}`, //revisar
    token
  )
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        // Buscar en subcarpetas también
        const jasperModules = import.meta.glob(
          "../../../../jaspers/Odontologia/**/*.jsx"
        );
        // Determinar la ruta según el nombre del jasper
        let rutaArchivo;
        if (nombre === "Odontograma_Digitalizado" || nombre === "Odontograma_lo_Digitalizado") {
          rutaArchivo = `../../../../jaspers/Odontologia/OdontogramaDigitalizado/${nombre}.jsx`;
        } else {
          rutaArchivo = `../../../../jaspers/Odontologia/${nombre}.jsx`;
        }
        const modulo = await jasperModules[rutaArchivo]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === "function") {
          modulo.default({ ...res, ...datosFooter });
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

export const PrintConsultaEjecutada = (inicio, fin, token, datosFooter) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(
    `${reporteConsultaUrl}?inicio=${inicio}&fin=${fin}`, //revisar
    token
  )
    .then(async (res) => {
      if (res.nameJasper) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        // Buscar en subcarpetas también
        const jasperModules = import.meta.glob(
          "../../../../jaspers/Odontologia/**/*.jsx"
        );
        // Determinar la ruta según el nombre del jasper
        let rutaArchivo;
        if (nombre === "Odontograma_Digitalizado" || nombre === "Odontograma_lo_Digitalizado") {
          rutaArchivo = `../../../../jaspers/Odontologia/OdontogramaDigitalizado/${nombre}.jsx`;
        } else {
          rutaArchivo = `../../../../jaspers/Odontologia/${nombre}.jsx`;
        }
        const modulo = await jasperModules[rutaArchivo]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === "function") {
          modulo.default({ ...res, ...datosFooter });
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

export const getInfoTabla = (nombreSearch, codigoSearch, setData, token) => {
  try {
    getFetch(
      `/api/v01/ct/odontograma/obtenerOdontogramaPorFiltros?${
        codigoSearch == "" ? "" : `nOrden=${codigoSearch}`
      }
    ${nombreSearch == "" ? "" : `&nombres=${nombreSearch}`}`,
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
