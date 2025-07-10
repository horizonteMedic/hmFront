import Swal from "sweetalert2";
import { getFetch } from "../../getFetch/getFetch";
import { SubmitData } from "./model";

//===============Zona Modificación===============
const obtenerReporteUrl = "/api/v01/ct/espirometria/obtenerReporteEspirometria";
const registrarUrl = "/api/v01/ct/espirometria/registrarActualizarEspirometria";

export const GetInfoServicio = (nro, tabla, set, token) => {
  getFetch(`${obtenerReporteUrl}?nOrden=${nro}`, token)
    .then((res) => {
      if (res.norden) {
        console.log(res);
        set((prev) => ({
          ...prev,
          ...res,

          fecha: res.fechaAbs,
          codExam: res.codExam,
          codAbs: res.codAbs,
          pasoExamen:
            res.fvc == "N/A" &&
            res.fev1 == "N/A" &&
            res.fev1Fvc == "N/A" &&
            res.fef2575 == "N/A" &&
            res.interpretacion == "NO SE REALIZÓ ESPIROMETRÍA",
          fvc: res.fvc,
          fev1: res.fev1,
          fev1_fvc: res.fev1Fvc,
          fef: res.fef2575,
          peso: res.peso,
          talla: res.talla,
          fvcTeorico: res.fvcTeorico,
          fev1Teorico: res.fev1Teorico,
          interpretacion: res.interpretacion,
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
    codAbs: form.codAbs == "" ? null : form.codAbs,
    codExam: form.codExam == "" ? null : form.codExam,
    norden: form.norden,
    fechaAbs: form.fecha,

    fvc: form.fvc,
    fev1: form.fev1,
    fev1Fvc: form.fev1_fvc,
    fef2575: form.fef,
    interpretacion: form.interpretacion,
    fvcTeorico: form.fvcTeorico,
    fev1Teorico: form.fev1Teorico,
  };
  SubmitData(body, registrarUrl, token).then((res) => {
    console.log(res);
    if (res.id === 1 || res.id === 0) {
      Swal.fire({
        title: "Éxito",
        text: res.mensaje,
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        limpiar();
      });
    } else {
      Swal.fire("Error", "Ocurrió un error al registrar", "error");
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
    } else if (res.id == 2) {
      Swal.fire("Error", "Falta llenar triaje", "error");
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
        nombres: res.nombresApellidos,
      }));
    })
    .finally(() => {
      Swal.close();
    });
};
