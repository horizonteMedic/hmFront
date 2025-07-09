import Swal from "sweetalert2";
import { getFetch } from "../../../getFetch/getFetch";
import { SubmitData } from "../model";

//===============Zona Modificación===============
const obtenerReporteUrl =
  "/api/v01/ct/audiometria/obtenerReporteCuestionarioAudiometria";
const registrarUrl =
  "/api/v01/ct/audiometria/registrarActualizarCuestionarioAudiometria";

export const GetInfoServicio = (nro, tabla, set, token) => {
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,
          
          nombres: res.nombres,
          edad: res.edad,
          norden: res.norden,
          dni: res.dni,
          genero: res.genero === "M" ? "Masculino" : "Femenino",
          codCuestionario: res.codCuestionario,
          fecha: res.fechaCuestionario,
          p1: res.chksi1 ? "SI" : "NO",
          p1_cual: res.txtrcual1,
          p1_cuando: res.txtrcuando1,
          p1_quehizo: res.txtrque1,

          p2: res.chksi2 ? "SI" : "NO",
          p3: res.chksi3 ? "SI" : "NO",
          p4: res.chksi4 ? "SI" : "NO",
          p5: res.chksi5 ? "SI" : "NO",
          p6: res.chksi6 ? "SI" : "NO",
          p7: res.chksi7 ? "SI" : "NO",
          p8: res.chksi8 ? "SI" : "NO",
          p9: res.chksi9 ? "SI" : "NO",

          p9_cual: res.txtrcual9,
          p9_donde: res.txtrdonde9,
          p9_quehizo: res.txtrque9,

          p10: res.chksi10 ? "SI" : "NO",

          p10_cual: res.txtrcual10,
          p10_donde: res.txtrdonde10,
          p10_quehizo: res.txtrque10,
          p11: res.chksi11 ? "SI" : "NO",
          p11_cual: res.txtrcual11,
          p11_tiempo: res.txtrcuanto11,
          p12: res.chksi12 ? "SI" : "NO",
          p12_cual: res.txtrcual12,
          p12_tiempo: res.txtrcuanto12,
          p13: res.chksi13 ? "SI" : "NO",
          p13_tiempo: res.txtrcuanto13,
          p13_cuando: res.txtrcuando13,
          p13_donde: res.txtrdonde13,
          p14: res.chksi14 ? "SI" : "NO",
          p14_cual: res.txtrcual14,
          p14_donde: res.txtrdonde14,
          p14_quehizo: res.txtrque14,
          p15: res.chksi15 ? "SI" : "NO",
          p15_cuantos: res.txtrcuantos15,
          p16_caza: res.chkcaza16,
          p16_caza_tiempo: res.txtcaza16,
          p16_tiro: res.chktiro16,
          p16_tiro_tiempo: res.txttiro16,
          p16_discoteca: res.chkdiscoteca16,
          p16_discoteca_tiempo: res.txtdiscoteca16,
          p16_auriculares: res.chkauriculares16,
          p16_auriculares_tiempo: res.txtauriculares16,
          p16_servicio: res.chkmilitar16,
          p16_servicio_tiempo: res.txtmilitar16,
          p16_boxeo: res.chkboxeo16,
          p16_boxeo_tiempo: res.txtboxeo16,
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
    codCuestionario: form.codCuestionario,
    norden: form.norden,
    edad: form.edad,
    fechaCuestionario: form.fecha,
    chksi1: form.p1 === "SI",
    chkno1: form.p1 === "NO",
    txtrcual1: form.p1_cual,
    txtrcuando1: form.p1_cuando,
    txtrque1: form.p1_quehizo,
    chksi2: form.p2 === "SI",
    chkno2: form.p2 === "NO",
    chksi3: form.p3 === "SI",
    chkno3: form.p3 === "NO",
    chksi4: form.p4 === "SI",
    chkno4: form.p4 === "NO",
    chksi5: form.p5 === "SI",
    chkno5: form.p5 === "NO",
    chksi6: form.p6 === "SI",
    chkno6: form.p6 === "NO",
    chksi7: form.p7 === "SI",
    chkno7: form.p7 === "NO",
    chksi8: form.p8 === "SI",
    chkno8: form.p8 === "NO",
    chksi9: form.p9 === "SI",
    chkno9: form.p9 === "NO",
    txtrcual9: form.p9_cual,
    txtrdonde9: form.p9_donde,
    txtrque9: form.p9_quehizo,
    chksi10: form.p10 === "SI",
    chkno10: form.p10 === "NO",
    txtrcual10: form.p10_cual,
    txtrdonde10: form.p10_donde,
    txtrque10: form.p10_quehizo,
    chksi11: form.p11 === "SI",
    chkno11: form.p11 === "NO",
    txtrcual11: form.p11_cual,
    txtrcuanto11: form.p11_tiempo,
    chksi12: form.p12 === "SI",
    chkno12: form.p12 === "NO",
    txtrcual12: form.p12_cual,
    txtrcuanto12: form.p12_tiempo,
    chksi13: form.p13 === "SI",
    chkno13: form.p13 === "NO",
    txtrcuanto13: form.p13_tiempo,
    txtrcuando13: form.p13_cuando,
    txtrdonde13: form.p13_donde,
    chksi14: form.p14 === "SI",
    chkno14: form.p14 === "NO",
    txtrcual14: form.p14_cual,
    txtrdonde14: form.p14_donde,
    txtrque14: form.p14_quehizo,
    chksi15: form.p15 === "SI",
    chkno15: form.p15 === "NO",
    txtrcuantos15: form.p15_cuantos,
    chkcaza16: form.p16_caza,
    txtcaza16: form.p16_caza_tiempo,
    chktiro16: form.p16_tiro,
    txttiro16: form.p16_tiro_tiempo,
    chkdiscoteca16: form.p16_discoteca,
    txtdiscoteca16: form.p16_discoteca_tiempo,
    chkauriculares16: form.p16_auriculares,
    txtauriculares16: form.p16_auriculares_tiempo,
    chkmilitar16: form.p16_servicio,
    txtmilitar16: form.p16_servicio_tiempo,
    chkboxeo16: form.p16_boxeo,
    txtboxeo16: form.p16_boxeo_tiempo,
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
          PrintHojaR(form.norden, token, tabla);
        }
      });
    } else {
      Swal.fire("Error", "Ocurrio un error al Registrar", "error");
    }
  });
};

export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        const jasperModules = import.meta.glob(
          `../../../../../../jaspers/Audiometria/*.jsx`
        );
        const modulo = await jasperModules[
          `../../../../../../jaspers/Audiometria/${nombre}.jsx`
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
      GetInfoServicio(nro, tabla, set, token);
    }
  });
};

function convertirFecha(fecha) {
  if (fecha === "") return "";
  const [dia, mes, anio] = fecha.split("-");
  return `${anio}/${mes.padStart(2, "0")}/${dia.padStart(2, "0")}`;
}

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
        nombres: res.nombresApellidos,
        genero: res.genero === "M" ? "Masculino" : "Femenino",
      }));
    })
    .finally(() => {
      Swal.close();
    });
};
