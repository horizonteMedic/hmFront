import Swal from "sweetalert2";
import { getFetch } from "../../../../getFetch/getFetch.js";
import { SubmitCualitAntigenos, SubmitCuantAntigenos } from "../model.js";

const sintomasList = [
  'Tos','Dolor de garganta','Congestión nasal','Dificultad respiratoria',
  'Fiebre/Escalofrío','Malestar general','Pérdida olfato o gusto',
  'Diarrea','Náuseas/vómitos','Cefalea','Irritabilidad/confusión',
  'Dolor','Expectoración'
];

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
      GetInfoService(nro, tabla, set, token);
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
        nombres: res.nombresApellidos,
      }));
    })
    .finally(() => {
      Swal.close();
    });
};

export const GetInfoService = (nro, tabla, set, token) => {
  getFetch(
    `/api/v01/ct/pruebasCovid/obtenerReporteExamenInmunologico?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then((res) => {
      if (res.norden) {
        console.log(res);

         const observacionesRaw = res.txtObservaciones || '';

        // Normaliza: quita guiones, espacios y pasa a minúsculas
        const observacionesNormalizadas = observacionesRaw
          .split('\n')
          .map(linea => linea.replace(/^-\s*/, '').trim().toLowerCase());

        // Normaliza la lista de síntomas también
        const sintomasMarcados = sintomasList.filter(sintoma => {
          const sintomaNorm = sintoma.trim().toLowerCase();
          return observacionesNormalizadas.some(obs => obs === sintomaNorm);
        });

        set((prev) => ({
          ...prev,
          ...res,
          fecha: res.fechaExamen,
          marca: res.cboMarca,
          valor: res.valorIgm,
          positivo: res.chkIgmReactivo === true ? true : false,
          negativo: res.chkIggReactivo === true ? true : false,
          fechaSintomas: res.fechaSintomas,
          marsa: res.formatoMarsa,
          observaciones: res.txtObservaciones,
          sintomas: sintomasMarcados
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      Swal.close();
    });
};

export const SubmitData = async (form, token, user, limpiar, tabla) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  SubmitCuantAntigenos(form, user, token).then((res) => {
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

export const SubmitDataCual = async (form, token, user, limpiar, tabla) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  SubmitCualitAntigenos(form, user, token).then((res) => {
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
}

export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");

  getFetch(
    `/api/v01/ct/pruebasCovid/obtenerReporteExamenInmunologico?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then(async (res) => {
      if (res.norden) {
        console.log(res);
        const nombre = res.nameJasper;
        console.log(nombre);
        const jasperModules = import.meta.glob(
          "../../../../../../jaspers/Covid/*.jsx"
        );
        const modulo = await jasperModules[
          `../../../../../../jaspers/Covid/${nombre}.jsx`
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
      Swal.close();
    })
    .catch((error) => {
      console.error("Error al encontrar el documento:", error);
      Swal.fire({
        icon: "error",
        title: "N° Orden no existente",
        text: "Por favor, ingrese un N° Orden válido.",
      });
    });
};
