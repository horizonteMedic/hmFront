import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch";
import { SubmitData } from "../model";
import jsPDF from "jspdf";
const doc = new jsPDF();
//===============Zona Modificación===============
const obtenerReporteUrl =
  "/api/v01/ct/audiometria/obtenerInformacionAudiometriaPo";
const registrarUrl = "/api/v01/ct/audiometria/registrarActualizarAudiometriaPo";

const obtenerReporteFicha =
  "/api/v01/ct/audiometria/obtenerInformacionFichaAudiologica";
const registrarUrlFicha =
  "/api/v01/ct/audiometria/registrarActualizarFichaAudiologica";

const obtenerReporteUrlJasper =
  "/api/v01/ct/audiometria/obtenerReporteAudiometriaM";

export const GetInfoServicio = (nro, tabla, set, token) => {
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,

          codAu: res.codAu,
          fecha: res.fechaAu,

          od_500: res.od500,
          od_1000: res.od1000,
          od_2000: res.od2000,
          od_3000: res.od3000,
          od_4000: res.od4000,
          od_6000: res.od6000,
          od_8000: res.od8000,
          oi_500: res.oi500,

          oi_1000: res.oi1000,
          oi_2000: res.oi2000,
          oi_3000: res.oi3000,
          oi_4000: res.oi4000,
          oi_6000: res.oi6000,
          oi_8000: res.oi8000,

          od_o_500: res.od1_500,
          od_o_1000: res.od1_1000,
          od_o_2000: res.od1_2000,
          od_o_3000: res.od1_3000,
          od_o_4000: res.od1_4000,
          od_o_6000: res.od1_6000,
          od_o_8000: res.od1_8000,

          oi_o_500: res.oi1_500,
          oi_o_1000: res.oi1_1000,
          oi_o_2000: res.oi1_2000,
          oi_o_3000: res.oi1_3000,
          oi_o_4000: res.oi1_4000,
          oi_o_6000: res.oi1_6000,
          oi_o_8000: res.oi1_8000,
          diagnostico: res.diagnostico,
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      Swal.close();
    });
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = {
    codAu: form.codAu == "" ? null : form.codAu,
    norden: form.norden,
    numTicket: null,
    fechaAu: form.fecha,

    od500: form.od_500,
    od1000: form.od_1000,
    od2000: form.od_2000,
    od3000: form.od_3000,
    od4000: form.od_4000,
    od6000: form.od_6000,
    od8000: form.od_8000,

    oi500: form.oi_500,
    oi1000: form.oi_1000,
    oi2000: form.oi_2000,
    oi3000: form.oi_3000,
    oi4000: form.oi_4000,
    oi6000: form.oi_6000,
    oi8000: form.oi_8000,

    od1_500: form.od_o_500,
    od1_1000: form.od_o_1000,
    od1_2000: form.od_o_2000,
    od1_3000: form.od_o_3000,
    od1_4000: form.od_o_4000,
    od1_6000: form.od_o_6000,
    od1_8000: form.od_o_8000,

    oi1_500: form.oi_o_500,
    oi1_1000: form.oi_o_1000,
    oi1_2000: form.oi_o_2000,
    oi1_3000: form.oi_o_3000,
    oi1_4000: form.oi_o_4000,
    oi1_6000: form.oi_o_6000,
    oi1_8000: form.oi_o_8000,

    diagnostico: form.diagnostico,
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
          PrintHojaR(
            form.norden,
            token,
            tabla,
            form.activar_grafico,
            form.asignar_especialista
          );
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
      GetInfoServicio(nro, tabla, set, token);
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
        genero: res.genero == "M" ? "Masculino" : "Femenino",
        nombres: res.nombresApellidos,
      }));
    })
    .finally(() => {
      Swal.close();
    });
};
export const getInfoTabla = (nombreSearch, codigoSearch, setData, token) => {
  try {
    getFetch(
      `/api/v01/ct/audiometria/obtenerAudiometriaPorFiltros?${codigoSearch == "" ? "" : `nOrden=${codigoSearch}`
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

//=================================================Diferent
//=================================================Diferent
//=================================================Diferent
//=================================================Diferent
//=================================================Diferent
//=================================================Diferent
//=================================================Diferent
//=================================================Diferent
//=================================================Diferent
export const VerifyTRFicha = async (
  nro,
  tabla,
  token,
  set,
  sede,
  setSearchNombreMedico
) => {
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
      GetInfoServicioFicha(nro, tabla, set, token, setSearchNombreMedico);
    }
  });
};

export const GetInfoServicioFicha = (
  nro,
  tabla,
  set,
  token,
  setSearchNombreMedico
) => {
  getFetch(`${obtenerReporteFicha}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,

          fecha: res.fechaExamen,
          nomExam: res.nomExam,
          codFa: res.codFa,
          noExamen: res.txtMarca == "-" && res.txtModelo == "-",

          bellPlus:
            res.txtMarca == "BELL INVENTIS" && res.txtModelo == "BELL PLUS",

          genero: res.sexo == "M" ? "Masculino" : "Femenino",
          aniosTrabajo: res.tiempoTrabajo,
          mesesTrabajo: res.txtMesesTrabajo,

          areaO: res?.areaO || "",
          otoscopia: res.txtOtoscopia,

          empresa: res.empresa,
          contrata: res.contrata,

          marca: res.txtMarca,
          modelo: res.txtModelo,
          calibracion: res.fechaCalibracion,
          tiempoExposicion: res.tiempoExposicionTotalPonderado,

          tapones: res.chkTapones,
          orejeras: res.chkgrajeras,
          apreciacion_ruido: res.chkIntenso
            ? "RUIDO MUY INTENSO"
            : res.chkModerado
              ? "RUIDO MODERADO"
              : res.chkNoMolesto
                ? "RUIDO NO MOLESTO"
                : "",

          consumo_tabaco: res.chk1Si ? "SI" : "NO",
          servicio_militar: res.chk2Si ? "SI" : "NO",
          hobbies_ruido: res.chk3Si ? "SI" : "NO",
          exposicion_quimicos: res.chk4Si ? "SI" : "NO",
          infeccion_oido: res.chk5Si ? "SI" : "NO",
          uso_ototoxicos: res.chk6Si ? "SI" : "NO",

          disminucion_audicion: res.chk7Si ? "SI" : "NO",
          dolor_oidos: res.chk8Si ? "SI" : "NO",
          zumbido: res.chk9Si ? "SI" : "NO",
          mareos: res.chk10Si ? "SI" : "NO",
          infeccion_oido_actual: res.chk11Si ? "SI" : "NO",
          otro: res.chk12Si ? "SI" : "NO",
          otroDescripcion: res.otros ?? "",

          conclusiones: res.txtConclusiones,
          nombre_medico: res.txtMedico,

          od_250: res.txtDod250,
          od_500: res.txtDod500,
          od_1000: res.txtDod1000,

          oi_250: res.txtDoi250,
          oi_500: res.txtDoi500,
          oi_1000: res.txtDoi1000,

          d_umbral_discriminacion: res.txtLDUmbralDiscriminacion,
          d_porcentaje: res.txtLDPorcentajeDiscriminacion,
          d_umbral_confort: res.txtLDConfort,
          d_umbral_disconfort: res.txtLDDisconfort,

          i_umbral_discriminacion: res.txtLIUmbralDiscriminacion,
          i_porcentaje: res.txtLIPorcentajeDiscriminacion,
          i_umbral_confort: res.txtLIConfort,
          i_umbral_disconfort: res.txtLIDisconfort,
        }));
        setSearchNombreMedico(res.txtMedico);
      } else {
        Swal.fire(
          "Error",
          "Ocurrio un error al traer los datos de ficha audiometría",
          "error"
        );
      }
    })
    .finally(() => {
      Swal.close();
    });
};

export const SubmitDataServiceFicha = async (
  form,
  token,
  user,
  limpiar,
  tabla,
  mostrarGrafico,
  firmaExtra
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = {
    codFa: form.codFa == "" ? null : form.codFa,
    norden: form.norden,
    fechaExamen: form.fecha,
    tiempoTrabajo: form.aniosTrabajo,
    tiempoExposicionTotalPonderado: form.tiempoExposicion,
    edadFa: form.edad,
    chkTapones: form.tapones,
    chkgrajeras: form.orejeras,
    chkIntenso: form.apreciacion_ruido == "RUIDO MUY INTENSO",
    chkModerado: form.apreciacion_ruido == "RUIDO MODERADO",
    chkNoMolesto: form.apreciacion_ruido == "RUIDO NO MOLESTO",
    txtMarca: form.marca,
    txtModelo: form.modelo,
    fechaCalibracion: form.calibracion,

    chk1Si: form.consumo_tabaco == "SI",
    chk2Si: form.servicio_militar == "SI",
    chk3Si: form.hobbies_ruido == "SI",
    chk4Si: form.exposicion_quimicos == "SI",
    chk5Si: form.infeccion_oido == "SI",
    chk6Si: form.uso_ototoxicos == "SI",
    chk7Si: form.disminucion_audicion == "SI",
    chk8Si: form.dolor_oidos == "SI",
    chk9Si: form.zumbido == "SI",
    chk10Si: form.mareos == "SI",
    chk11Si: form.infeccion_oido_actual == "SI",
    chk12Si: form.otro == "SI",
    otros: form.otroDescripcion,

    chk1No: form.consumo_tabaco == "NO",
    chk2No: form.servicio_militar == "NO",
    chk3No: form.hobbies_ruido == "NO",
    chk4No: form.exposicion_quimicos == "NO",
    chk5No: form.infeccion_oido == "NO",
    chk6No: form.uso_ototoxicos == "NO",
    chk7No: form.disminucion_audicion == "NO",
    chk8No: form.dolor_oidos == "NO",
    chk9No: form.zumbido == "NO",
    chk10No: form.mareos == "NO",
    chk11No: form.infeccion_oido_actual == "NO",
    chk12No: form.otro == "NO",

    txtDod250: form.od_250,
    txtDod500: form.od_500,
    txtDod1000: form.od_1000,
    txtDoi250: form.oi_250,
    txtDoi500: form.oi_500,
    txtDoi1000: form.oi_1000,
    txtLDUmbralDiscriminacion: form.d_umbral_discriminacion,
    txtLIUmbralDiscriminacion: form.i_umbral_discriminacion,
    txtLDPorcentajeDiscriminacion: form.d_porcentaje,
    txtLIPorcentajeDiscriminacion: form.i_porcentaje,
    txtLDConfort: form.d_umbral_confort,
    txtLIConfort: form.i_umbral_confort,
    txtLDDisconfort: form.d_umbral_disconfort,
    txtLIDisconfort: form.i_umbral_disconfort,
    txtResponsable: form.nombre_profecional,
    txtConclusiones: form.conclusiones,
    txtMedico: form.nombre_medico,
    txtOtoscopia: form.otoscopia,
    txtMesesTrabajo: form.mesesTrabajo,
    userRegistro: user,
    userMedicoOcup: form.nombre_profecional,
  };
  SubmitData(body, registrarUrlFicha, token).then((res) => {
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
          PrintHojaR(
            form.norden,
            token,
            "audiometria_po",
            mostrarGrafico,
            firmaExtra
          );
        }
      });
    } else {
      Swal.fire("Error", "Ocurrio un error al Registrar", "error");
    }
  });
};

export const PrintHojaR = (nro, token, tabla, mostrarGrafico, firmaExtra) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(
    `${obtenerReporteUrlJasper}?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        const jasperModules = import.meta.glob(
          `../../../../../jaspers/Audiometria/*.jsx`
        );
        const modulo = await jasperModules[
          `../../../../../jaspers/Audiometria/${nombre}.jsx`
        ]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === "function") {
          modulo.default(res, mostrarGrafico, firmaExtra, doc);
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