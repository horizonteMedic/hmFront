import Swal from "sweetalert2";
import { getFetch } from "../../../../getFetch/getFetch.js";
import { SubmitCoproParasitologia } from "../model.js";
// import { SubmitCoprocultivo } from "../model.js";

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

export const VerifyTR = async (nro, tabla, token, set, sede, setIsCopro) => {
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
      GetInfoCoproParasitologia(nro, tabla, set, token,setIsCopro);
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

export const GetInfoCoproParasitologia = (nro, tabla, set, token,setIsCopro) => {

  getFetch(
    `/api/v01/ct/manipuladores/obtenerReporteCoproparasitologico?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then((res) => {
      if (res.norden) {
         Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Parasitología",
          "warning"
      );
        setIsCopro(res.tipoCoproparasitologico);
        set((prev) => ({
          ...prev,
          ...res,
          fecha: res.fecha,
          heces1: {
            color: res.txtcolor,
            aspecto: res.txtaspecto,
            moco: res.txtmocoFecal,
            sangre: res.txtsangrev,
            restos: res.txtrestosa,
            grasa: res.txtgrasa,
          },
          micro1: {
            leucocitos: res.txtleucocitos,
            hematies: res.txthematies,
            parasitos: res.txtlugol,
          },
          heces2: {
            color: res.txtcolor1,
            aspecto: res.txtaspecto1,
            moco: res.txtmocoFecal1,
            sangre: res.txtsangrev1,
            restos: res.txtrestosa1,
            grasa: res.txtgrasa1,
          },
          micro2: {
            leucocitos: res.txtleucocitos1,
            hematies: res.txthematies1,
            parasitos: res.txtlugol1,
          },
          heces3: {
            color: res.txtcolor2,
            aspecto: res.txtaspecto2,
            moco: res.txtmocoFecal2,
            sangre: res.txtsangrev2,
            restos: res.txtrestosa2,
            grasa: res.txtgrasa2,
          },
          micro3: {
            leucocitos: res.txtleucocitos2,
            hematies: res.txthematies2,
            parasitos: res.txtlugol2,
          },
        }));
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
};

export const SubmitCoproParasitologiaManipulador = async (
  form,
  token,
  user,
  limpiar,
  tabla
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  Loading("Registrando Datos");
  console.log("formulario", form);
  SubmitCoproParasitologia(form, user, token).then((res) => {
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

  getFetch(
    `/api/v01/ct/manipuladores/obtenerReporteCoproparasitologico?nOrden=${nro}&nameService=${tabla}`, //revisar
    token
  )
  .then(async (res) => {
    if (res.norden) {
      console.log(res);
      const nombre = res.nameJasper;
      console.log(nombre);
      const jasperModules = import.meta.glob(
        "../../../../../../jaspers/Manipuladores/*.jsx"
      );
      const modulo = await jasperModules[
        `../../../../../../jaspers/Manipuladores/${nombre}.jsx`
      ]();
      // Ejecuta la función exportada por default con los datos
      if (typeof modulo.default === "function") {
        modulo.default(res);
      } else {
        console.error(
          `El archivo ${nombre}.jsx no exporta una función por defecto`
        );
      }
      Swal.close()
    } else {
      Swal.close()
    }
  })
  .catch(async() => {
    await Swal.fire('Error','No se encontro el registro','error')
  })
};
